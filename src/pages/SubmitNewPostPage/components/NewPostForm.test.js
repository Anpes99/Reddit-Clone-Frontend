import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Axios from "../../../shared/lib/axios";
import NewPostForm from "./NewPostForm";
import { renderWithProviders } from "../../../test/renderWithProviders";

jest.mock("../../../shared/lib/axios", () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

const renderForm = (appState = { user: { id: 1, username: "test_user1" } }) =>
  renderWithProviders(<NewPostForm />, {
    appState,
    path: "/r/:subredditName/submit",
    route: "/r/javascript/submit",
  });

const setup = () =>
  userEvent.setup({ advanceTimers: (ms) => jest.advanceTimersByTime(ms) });

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(console, "log").mockImplementation(() => {});
  Axios.post.mockReset();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

it("keeps the Post button disabled until there is a title and text", async () => {
  const user = setup();
  renderForm();
  const submit = screen.getByRole("button", { name: "Post" });

  expect(submit).toBeDisabled();
  await user.type(screen.getByPlaceholderText("Title"), "Hello");
  expect(submit).toBeDisabled();
  await user.type(screen.getByPlaceholderText("Text"), "World");
  expect(submit).toBeEnabled();
});

it("does not let a logged-out user write a post", () => {
  renderForm({ user: null });

  expect(screen.getByPlaceholderText("Text")).toBeDisabled();
});

it("creates the post in the subreddit from the URL and returns home", async () => {
  const user = setup();
  Axios.post.mockResolvedValue({ status: 201 });
  renderForm();

  await user.type(screen.getByPlaceholderText("Title"), "My first post");
  await user.type(screen.getByPlaceholderText("Text"), "Hello everyone");
  await user.click(screen.getByRole("button", { name: "Post" }));

  expect(Axios.post).toHaveBeenCalledWith("/api/posts", {
    title: "My first post",
    text: "Hello everyone",
    subredditName: "javascript",
  });
  expect(await screen.findByText("New Post Created")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Title")).toHaveValue("");

  act(() => {
    jest.advanceTimersByTime(2000);
  });
  expect(screen.getByText("navigated away")).toBeInTheDocument();
});

it("shows an error and keeps the post when submitting fails", async () => {
  const user = setup();
  Axios.post.mockRejectedValue(new Error("Network Error"));
  renderForm();

  await user.type(screen.getByPlaceholderText("Title"), "My first post");
  await user.type(screen.getByPlaceholderText("Text"), "Hello everyone");
  await user.click(screen.getByRole("button", { name: "Post" }));

  expect(await screen.findByText("Failed to submit post")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Title")).toHaveValue("My first post");
  expect(screen.getByRole("button", { name: "Post" })).toBeEnabled();
});
