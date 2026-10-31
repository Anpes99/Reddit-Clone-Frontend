import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Axios from "../../../shared/lib/axios";
import socket from "../../../shared/lib/socket";
import Header from "./Header";
import HeaderOptionsDropDownList from "./HeaderOptionsDropDownList";
import { renderWithProviders } from "../../../test/renderWithProviders";

jest.mock("../../../shared/lib/axios", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));
// Rendered for logged-in users; not needed for the logout flow.
jest.mock("./UserSubredditsDropDown", () => () => null);

const loggedInUser = { id: 1, username: "test_user1", token: "access-1" };
const originalLocation = window.location;

beforeAll(() => {
  // Header measures itself with ResizeObserver, which jsdom does not have.
  global.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  // Logout redirects by assigning window.location.href.
  delete window.location;
  window.location = { origin: "http://localhost", href: "http://localhost/" };
});

afterAll(() => {
  delete global.ResizeObserver;
  window.location = originalLocation;
});

beforeEach(() => {
  jest.clearAllMocks();
  Axios.post.mockResolvedValue({ status: 204 });
  socket.auth = { token: "access-1" };
  window.location.href = "http://localhost/";
});

// The header button and the dropdown item run the same logout code.
describe.each([
  [
    "header",
    () => <Header />,
    () => screen.getByRole("button", { name: "Log Out" }),
  ],
  [
    "dropdown",
    () => <HeaderOptionsDropDownList isVisible />,
    () => screen.getByText("Log Out"),
  ],
])("logging out from the %s", (_, renderUi, getLogOutButton) => {
  it("ends the session, resets the socket and returns to the front page", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(renderUi(), {
      appState: { user: loggedInUser },
    });

    await user.click(getLogOutButton());

    expect(Axios.post).toHaveBeenCalledWith("/api/auth/logout");
    expect(store.getState().app.user).toBeNull();
    expect(socket.auth).toEqual({});
    expect(socket.disconnect).toHaveBeenCalled();
    expect(socket.connect).toHaveBeenCalled();
    expect(window.location.href).toBe("/");
  });

  it("keeps the user logged in and shows an error when the request fails", async () => {
    Axios.post.mockRejectedValueOnce(new Error("Network Error"));
    const user = userEvent.setup();
    const { store } = renderWithProviders(renderUi(), {
      appState: { user: loggedInUser },
    });

    await user.click(getLogOutButton());

    expect(store.getState().app.user).toEqual(loggedInUser);
    expect(socket.disconnect).not.toHaveBeenCalled();
    expect(window.location.href).toBe("http://localhost/");
    expect(store.getState().app.globalNotifications).toEqual([
      expect.objectContaining({
        type: "error",
        message: "Couldn't log you out",
      }),
    ]);
  });
});
