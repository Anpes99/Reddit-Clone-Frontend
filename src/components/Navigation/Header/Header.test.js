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
const loggedInUser = { id: 1, username: "test_user1", token: "access-1" };

beforeAll(() => {
  // Header measures itself with ResizeObserver, which jsdom does not have.
  global.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
});

afterAll(() => {
  delete global.ResizeObserver;
});

beforeEach(() => {
  jest.clearAllMocks();
  Axios.post.mockResolvedValue({ status: 204 });
  socket.auth = { token: "access-1" };
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
      route: "/user/test_user1",
      path: "/user/:username",
    });

    await user.click(getLogOutButton());

    expect(Axios.post).toHaveBeenCalledWith("/api/auth/logout");
    expect(store.getState().app.user).toBeNull();
    expect(socket.auth).toEqual({});
    expect(socket.disconnect).toHaveBeenCalled();
    expect(socket.connect).toHaveBeenCalled();
    expect(screen.getByText("navigated away")).toBeInTheDocument();
  });

  it("keeps the user logged in and shows an error when the request fails", async () => {
    Axios.post.mockRejectedValueOnce(new Error("Network Error"));
    const user = userEvent.setup();
    const { store } = renderWithProviders(renderUi(), {
      appState: { user: loggedInUser },
      route: "/user/test_user1",
      path: "/user/:username",
    });

    await user.click(getLogOutButton());

    expect(store.getState().app.user).toEqual(loggedInUser);
    expect(socket.disconnect).not.toHaveBeenCalled();
    expect(screen.queryByText("navigated away")).not.toBeInTheDocument();
    expect(store.getState().app.globalNotifications).toEqual([
      expect.objectContaining({
        type: "error",
        message: "Couldn't log you out",
      }),
    ]);
  });
});
