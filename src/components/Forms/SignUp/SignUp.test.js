import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Axios from "../../../shared/lib/axios";
import SignUp, { validateWithJoi, validationSchema } from "./SignUp";
import { renderWithProviders } from "../../../test/renderWithProviders";

jest.mock("../../../shared/lib/axios", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

const validate = validateWithJoi(validationSchema);

const fillInAndSubmit = async (user, { username, email, password }) => {
  await user.type(screen.getByPlaceholderText("Username"), username);
  await user.type(screen.getByPlaceholderText("Email"), email);
  await user.type(screen.getByPlaceholderText("Password"), password);
  await user.click(screen.getByRole("button", { name: "create my account" }));
};

beforeEach(() => {
  Axios.post.mockReset();
});

describe("sign-up validation", () => {
  it("accepts valid values", () => {
    expect(
      validate({
        username: "test_user1",
        email: "test_user1@example.com",
        password: "secret",
      }),
    ).toEqual({});
  });

  it("requires every field", () => {
    expect(validate({ username: "", email: "", password: "" })).toEqual({
      username: "Username is required",
      email: "Email is required",
      password: "Password is required",
    });
  });

  it("rejects usernames with characters other than letters, numbers, _ and -", () => {
    expect(
      validate({
        username: "test_user1!",
        email: "test_user1@example.com",
        password: "secret",
      }),
    ).toEqual({
      username:
        "Username may contain letters, numbers, underscores and hyphens only",
    });
  });

  it("rejects an invalid email and a short password", () => {
    expect(
      validate({ username: "test_user1", email: "not-an-email", password: "123" }),
    ).toEqual({
      email: "Please enter a valid email address",
      password: "Password must be at least 4 characters",
    });
  });
});

describe("SignUp", () => {
  it("creates the account and asks the user to verify their email", async () => {
    const user = userEvent.setup();
    Axios.post.mockResolvedValue({ status: 201 });
    const { store } = renderWithProviders(<SignUp />, {
      appState: { signUpVisible: true },
    });

    await fillInAndSubmit(user, {
      username: "test_user1",
      email: "test_user1@example.com",
      password: "secret",
    });

    await waitFor(() =>
      expect(store.getState().app.emailVerificationModal).toEqual({
        email: "test_user1@example.com",
        username: "test_user1",
        isVisible: true,
      }),
    );
    expect(Axios.post).toHaveBeenCalledWith("/api/users", {
      username: "test_user1",
      email: "test_user1@example.com",
      password: "secret",
    });
    expect(store.getState().app.signUpVisible).toBe(false);
  });

  it("shows validation errors without calling the API", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignUp />);

    await fillInAndSubmit(user, {
      username: "a",
      email: "bad",
      password: "1",
    });

    expect(
      await screen.findByText("Username must be at least 2 characters"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid email address"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Password must be at least 4 characters"),
    ).toBeInTheDocument();
    expect(Axios.post).not.toHaveBeenCalled();
  });

  it("tells the user when the username is already taken", async () => {
    const user = userEvent.setup();
    Axios.post.mockRejectedValue({
      response: { status: 400, data: { error: "username already taken" } },
    });
    const { store } = renderWithProviders(<SignUp />, {
      appState: { signUpVisible: true },
    });

    await fillInAndSubmit(user, {
      username: "test_user1",
      email: "test_user1@example.com",
      password: "secret",
    });

    expect(
      await screen.findByText("This username is already taken."),
    ).toBeInTheDocument();
    expect(store.getState().app.signUpVisible).toBe(true);
  });
});
