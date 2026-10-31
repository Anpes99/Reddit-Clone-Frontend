import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostVotingArrows from "./PostVotingArrows";
import socket from "../../../shared/lib/socket";
import { renderWithProviders } from "../../../test/renderWithProviders";

const post = { id: 7, upVotes: 10, downVotes: 3 };
const loggedInUser = { id: 1, username: "test_user1", ratedPosts: [] };

beforeEach(() => {
  socket.emit.mockReset();
});

it("shows the post's score", () => {
  renderWithProviders(<PostVotingArrows post={post} />);

  expect(screen.getByText("7")).toBeInTheDocument();
});

it("opens the login modal instead of voting when logged out", async () => {
  const user = userEvent.setup();
  const { store } = renderWithProviders(<PostVotingArrows post={post} />);

  await user.click(screen.getByRole("button", { name: "Upvote" }));

  expect(store.getState().app.loginVisible).toBe(true);
  expect(socket.emit).not.toHaveBeenCalled();
});

it("sends an upvote and marks the arrow as voted", async () => {
  const user = userEvent.setup();
  socket.emit.mockImplementation((eventName, payload, callback) =>
    callback({ success: true, newRating: 1 }),
  );
  const { store } = renderWithProviders(<PostVotingArrows post={post} />, {
    appState: { user: loggedInUser },
  });

  await user.click(screen.getByRole("button", { name: "Upvote" }));

  expect(socket.emit).toHaveBeenCalledWith(
    "likePost",
    { postId: 7 },
    expect.any(Function),
  );
  expect(store.getState().app.user.ratedPosts).toEqual([{ id: 7, rating: 1 }]);
  expect(screen.getByRole("button", { name: "Upvote" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

it("sends a downvote", async () => {
  const user = userEvent.setup();
  renderWithProviders(<PostVotingArrows post={post} />, {
    appState: { user: loggedInUser },
  });

  await user.click(screen.getByRole("button", { name: "Downvote" }));

  expect(socket.emit).toHaveBeenCalledWith(
    "dislikePost",
    { postId: 7 },
    expect.any(Function),
  );
});

it("shows the user's existing vote", () => {
  renderWithProviders(<PostVotingArrows post={post} />, {
    appState: {
      user: { ...loggedInUser, ratedPosts: [{ id: 7, rating: -1 }] },
    },
  });

  expect(screen.getByRole("button", { name: "Downvote" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByRole("button", { name: "Upvote" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

it("updates the score live when someone else votes on the post", () => {
  renderWithProviders(<PostVotingArrows post={post} />);

  act(() => {
    socket.emitServerEvent("post_likes_changed", {
      postId: 7,
      pointsToAddOrMinus: 2,
    });
    socket.emitServerEvent("post_likes_changed", {
      postId: 8,
      pointsToAddOrMinus: 100,
    });
  });

  expect(screen.getByText("9")).toBeInTheDocument();
});
