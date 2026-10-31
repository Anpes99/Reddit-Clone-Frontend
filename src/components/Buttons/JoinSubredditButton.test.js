import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JoinSubredditButton from "./JoinSubredditButton";
import {
  handleJoinSubreddit,
  handleLeaveSubreddit,
} from "../../shared/utils/subredditActions";
import { renderWithProviders } from "../../test/renderWithProviders";

jest.mock("../../shared/utils/subredditActions", () => ({
  handleJoinSubreddit: jest.fn(),
  handleLeaveSubreddit: jest.fn(),
}));

const subreddit = { id: 5, name: "javascript" };

beforeEach(() => {
  jest.clearAllMocks();
});

it("renders nothing without a subreddit", () => {
  renderWithProviders(<JoinSubredditButton subreddit={null} />);

  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it("opens the login modal when a logged-out user clicks Join", async () => {
  const user = userEvent.setup();
  const { store } = renderWithProviders(
    <JoinSubredditButton subreddit={subreddit} />,
  );

  await user.click(screen.getByRole("button", { name: "Join" }));

  expect(store.getState().app.loginVisible).toBe(true);
  expect(handleJoinSubreddit).not.toHaveBeenCalled();
});

it("joins the subreddit", async () => {
  const user = userEvent.setup();
  const loggedInUser = { id: 1, subreddits: [] };
  renderWithProviders(<JoinSubredditButton subreddit={subreddit} />, {
    appState: { user: loggedInUser },
  });

  await user.click(screen.getByRole("button", { name: "Join" }));

  expect(handleJoinSubreddit).toHaveBeenCalledWith(
    loggedInUser,
    subreddit,
    expect.any(Function),
  );
});

it("lets a member leave the subreddit", async () => {
  const user = userEvent.setup();
  const loggedInUser = { id: 1, subreddits: [{ id: 5 }] };
  renderWithProviders(<JoinSubredditButton subreddit={subreddit} />, {
    appState: { user: loggedInUser },
  });

  expect(
    screen.queryByRole("button", { name: "Join" }),
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Leave r/javascript" }));

  expect(handleLeaveSubreddit).toHaveBeenCalledWith(
    loggedInUser,
    subreddit,
    expect.any(Function),
  );
});
