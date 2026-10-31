import axios from "axios";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignIn from "./SignIn";
import socket from "../../../shared/lib/socket";
import { renderWithProviders } from "../../../test/renderWithProviders";

const fillInAndSubmit = async (user, { username, password }) => {
  await user.type(screen.getByPlaceholderText("Username"), username);
  await user.type(screen.getByPlaceholderText("Password"), password);
  await user.click(screen.getByRole("button", { name: "create my account" }));
};

const httpError = (status, data = {}) =>
  Object.assign(new Error(`status ${status}`), { response: { status, data } });

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  socket.connect.mockClear();
  socket.disconnect.mockClear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("shows validation errors and does not call the API for empty fields", async () => {
  const user = userEvent.setup();
  const login = jest.spyOn(axios, "post");
  renderWithProviders(<SignIn />);

  await user.click(screen.getByRole("button", { name: "create my account" }));

  expect(await screen.findByText("Username is required")).toBeInTheDocument();
  expect(screen.getByText("Password is required")).toBeInTheDocument();
  expect(login).not.toHaveBeenCalled();
});

it("logs the user in, closes the login modal and reconnects the socket", async () => {
  const user = userEvent.setup();
  jest.spyOn(axios, "post").mockResolvedValue({
    status: 200,
    data: {
      token: "access-1",
      username: "test_user1",
      email: "test_user1@example.com",
      id: 3,
    },
  });
  const { store } = renderWithProviders(<SignIn />, {
    appState: { loginVisible: true },
  });

  await fillInAndSubmit(user, { username: "test_user1", password: "secret" });

  await waitFor(() =>
    expect(store.getState().app.user).toEqual({
      token: "access-1",
      username: "test_user1",
      id: 3,
    }),
  );
  expect(axios.post).toHaveBeenCalledWith("http://localhost/api/auth/login", {
    username: "test_user1",
    password: "secret",
  });
  expect(store.getState().app.loginVisible).toBe(false);
  expect(socket.auth).toEqual({ token: "access-1" });
  expect(socket.disconnect).toHaveBeenCalled();
  expect(socket.connect).toHaveBeenCalled();
});

it("shows an error for a wrong username or password", async () => {
  const user = userEvent.setup();
  jest.spyOn(axios, "post").mockRejectedValue(httpError(401));
  const { store } = renderWithProviders(<SignIn />);

  await fillInAndSubmit(user, { username: "test_user1", password: "wrong" });

  expect(
    await screen.findByText("Incorrect username or password"),
  ).toBeInTheDocument();
  expect(store.getState().app.user).toBeNull();
});

it("shows an error when there are too many login attempts", async () => {
  const user = userEvent.setup();
  jest.spyOn(axios, "post").mockRejectedValue(httpError(429));
  renderWithProviders(<SignIn />);

  await fillInAndSubmit(user, { username: "test_user1", password: "secret" });

  expect(
    await screen.findByText("Too many login attempts. Try again later"),
  ).toBeInTheDocument();
});

it("asks the user to verify their email when it is not verified yet", async () => {
  const user = userEvent.setup();
  jest.spyOn(axios, "post").mockRejectedValue(
    httpError(403, {
      email: "test_user1@example.com",
      error: { status: "EMAIL_NOT_VERIFIED" },
    }),
  );
  const { store } = renderWithProviders(<SignIn />, {
    appState: { loginVisible: true },
  });

  await fillInAndSubmit(user, { username: "test_user1", password: "secret" });

  await waitFor(() =>
    expect(store.getState().app.emailVerificationModal).toEqual({
      email: "test_user1@example.com",
      username: "test_user1",
      isVisible: true,
    }),
  );
  expect(store.getState().app.loginVisible).toBe(false);
});

it("opens the forgotten password modal", async () => {
  const user = userEvent.setup();
  const { store } = renderWithProviders(<SignIn />, {
    appState: { loginVisible: true },
  });

  await user.click(screen.getByRole("button", { name: "Forgot password?" }));

  expect(store.getState().app.loginVisible).toBe(false);
  expect(store.getState().app.forgottenPasswordModalVisible).toBe(true);
});
