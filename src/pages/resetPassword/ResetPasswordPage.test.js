import axios from "axios";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordPage from "./ResetPasswordPage";
import { renderWithProviders } from "../../test/renderWithProviders";

const renderPage = (route = "/reset-password?token=reset-token-1") =>
  renderWithProviders(<ResetPasswordPage />, {
    path: "/reset-password",
    route,
  });

const submitPasswords = async (user, password, confirmation) => {
  await user.type(screen.getByLabelText("New password"), password);
  await user.type(screen.getByLabelText("Confirm new password"), confirmation);
  await user.click(screen.getByRole("button", { name: "Reset password" }));
};

afterEach(() => {
  jest.restoreAllMocks();
});

it("renders nothing without a reset token", () => {
  renderPage("/reset-password");

  expect(
    screen.queryByRole("button", { name: "Reset password" }),
  ).not.toBeInTheDocument();
});

it("rejects a password shorter than 8 characters", async () => {
  const user = userEvent.setup();
  const reset = jest.spyOn(axios, "post");
  renderPage();

  await submitPasswords(user, "short", "short");

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Password must be at least 8 characters long.",
  );
  expect(reset).not.toHaveBeenCalled();
});

it("rejects passwords that do not match", async () => {
  const user = userEvent.setup();
  const reset = jest.spyOn(axios, "post");
  renderPage();

  await submitPasswords(user, "new-password-1", "new-password-2");

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Passwords do not match.",
  );
  expect(reset).not.toHaveBeenCalled();
});

it("resets the password, returns home and confirms the change", async () => {
  const user = userEvent.setup();
  const reset = jest.spyOn(axios, "post").mockResolvedValue({ status: 200 });
  const { store } = renderPage();

  await submitPasswords(user, "new-password-1", "new-password-1");

  expect(reset).toHaveBeenCalledWith(
    "http://localhost/api/users/reset-password",
    { password: "new-password-1", passwordResetToken: "reset-token-1" },
  );
  await waitFor(() =>
    expect(screen.getByText("navigated away")).toBeInTheDocument(),
  );
  expect(store.getState().app.globalNotifications).toEqual([
    expect.objectContaining({ type: "success" }),
  ]);
});

it("explains when the reset link is invalid or expired", async () => {
  const user = userEvent.setup();
  jest.spyOn(axios, "post").mockRejectedValue({ response: { status: 400 } });
  renderPage();

  await submitPasswords(user, "new-password-1", "new-password-1");

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "This password reset link is invalid or has expired.",
  );
});

it("can show the typed password", async () => {
  const user = userEvent.setup();
  renderPage();
  const input = screen.getByLabelText("New password");

  expect(input).toHaveAttribute("type", "password");
  await user.click(screen.getAllByRole("button", { name: "Show" })[0]);
  expect(input).toHaveAttribute("type", "text");
});
