import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Axios from "../../../../shared/lib/axios";
import socket from "../../../../shared/lib/socket";
import SingleCommentAndCommentCommentsThread from "./SingleCommentAndChilrenCommentsThread";
import { renderWithProviders } from "../../../../test/renderWithProviders";

jest.mock("../../../../shared/lib/axios", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

const post = { id: 7, subredditId: 3 };

const makeComment = (overrides) => ({
  id: 1,
  text: "Top level comment",
  upVotes: 4,
  downVotes: 1,
  descendantCount: 0,
  createdAt: new Date().toISOString(),
  user: { username: "test_user1", avatarImageUrl: null },
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
});

it("shows the comment, its author and score", () => {
  renderWithProviders(
    <SingleCommentAndCommentCommentsThread
      post={post}
      comment={makeComment()}
    />,
  );

  expect(screen.getByText("Top level comment")).toBeInTheDocument();
  expect(screen.getByText("test_user1")).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();
});

it("loads and shows nested replies on demand", async () => {
  const user = userEvent.setup();
  Axios.get.mockResolvedValue({
    data: [
      makeComment({
        id: 2,
        text: "First reply",
        user: { username: "test_user2" },
        descendantCount: 1,
      }),
      makeComment({ id: 3, text: "Second reply", user: { username: "test_user3" } }),
    ],
  });
  renderWithProviders(
    <SingleCommentAndCommentCommentsThread
      post={post}
      comment={makeComment({ descendantCount: 3 })}
    />,
  );
  expect(screen.queryByText("First reply")).not.toBeInTheDocument();

  await user.click(screen.getByText("3 more replies"));

  expect(Axios.get).toHaveBeenCalledWith("/api/comments/moreComments/1");
  expect(await screen.findByText("First reply")).toBeInTheDocument();
  expect(screen.getByText("Second reply")).toBeInTheDocument();
  expect(screen.queryByText("3 more replies")).not.toBeInTheDocument();
  // The reply's own replies are loaded only when asked for.
  expect(screen.getByText("1 more replies")).toBeInTheDocument();
});

it("asks a logged-out user to log in before voting", async () => {
  const user = userEvent.setup();
  const { store } = renderWithProviders(
    <SingleCommentAndCommentCommentsThread
      post={post}
      comment={makeComment()}
    />,
  );

  await user.click(screen.getByRole("button", { name: "Upvote comment" }));

  expect(store.getState().app.loginVisible).toBe(true);
  expect(socket.emit).not.toHaveBeenCalled();
});

it("sends a comment vote when logged in", async () => {
  const user = userEvent.setup();
  renderWithProviders(
    <SingleCommentAndCommentCommentsThread
      post={post}
      comment={makeComment()}
    />,
    { appState: { user: { id: 1, username: "test_user4" } } },
  );

  await user.click(screen.getByRole("button", { name: "Downvote comment" }));

  expect(socket.emit).toHaveBeenCalledWith("dislikeComment", { commentId: 1 });
});

it("updates the score live when someone votes on the comment", () => {
  renderWithProviders(
    <SingleCommentAndCommentCommentsThread
      post={post}
      comment={makeComment()}
    />,
  );

  act(() => {
    socket.emitServerEvent("comment_likes_changed", {
      commentId: 1,
      ratingToPlusOrMinus: -2,
    });
  });

  expect(screen.getByText("1")).toBeInTheDocument();
});

it("posts a reply to the comment", async () => {
  const user = userEvent.setup();
  Axios.post.mockResolvedValue({ status: 201 });
  renderWithProviders(
    <SingleCommentAndCommentCommentsThread
      post={post}
      comment={makeComment()}
    />,
    { appState: { user: { id: 1, username: "test_user4" } } },
  );

  await user.click(screen.getByText("Reply"));
  await user.type(screen.getByRole("textbox"), "Good point");
  await user.click(screen.getByRole("button", { name: "Send reply" }));

  expect(Axios.post).toHaveBeenCalledWith("/api/comments", {
    text: "Good point",
    directReplyToPost: false,
    subredditId: 3,
    postId: 7,
    commentId: 1,
  });
  expect(await screen.findByText("new comment created")).toBeInTheDocument();
});
