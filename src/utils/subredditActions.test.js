const {
  handleJoinSubreddit,
  handleLeaveSubreddit,
} = require("./subredditActions.js");
const { setUser } = require("../slices/appSlice.js");
import axios from "axios";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

jest.mock("axios");

describe("handleJoinSubreddit", () => {
  test("should add new subreddit to list of joined subreddits", async () => {
    const mockUser = { id: 1, subreddits: [{ id: 1 }] };
    const mockNewJoinedSubreddit = { id: 2 };

    const expectedNewUser = {
      ...mockUser,
      subreddits: [...mockUser.subreddits, mockNewJoinedSubreddit],
    };
    const store = mockStore({});

    axios.post.mockResolvedValue({ status: 200 });
    await handleJoinSubreddit(mockUser, mockNewJoinedSubreddit, store.dispatch);

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: "app/setUser",
        payload: expectedNewUser,
      },
    ]);
  });
});

describe("handleLeaveSubreddit", () => {
  test("should remove the subreddit from list of joined subreddits", async () => {
    const mockUser = { id: 1, subreddits: [{ id: 1 }, { id: 2 }] };
    const mockSubredditUserLeftFrom = { id: 2 };

    const expectedNewUser = {
      ...mockUser,
      subreddits: mockUser.subreddits.filter(
        (subreddit) => subreddit.id !== mockSubredditUserLeftFrom.id
      ),
    };
    const store = mockStore({});
    axios.delete.mockResolvedValue({ status: 204 });
    await handleLeaveSubreddit(
      mockUser,
      mockSubredditUserLeftFrom,
      store.dispatch
    );

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: "app/setUser",
        payload: expectedNewUser,
      },
    ]);
  });
});
