import Axios from "../lib/axios";
import { setUser } from "../../app/slices/appSlice";
import { handleJoinSubreddit, handleLeaveSubreddit } from "./subredditActions";

jest.mock("../lib/axios", () => ({
  __esModule: true,
  default: { post: jest.fn(), delete: jest.fn() },
}));

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("handleJoinSubreddit", () => {
  it("adds the subreddit to the user's joined subreddits", async () => {
    const user = { id: 1, subreddits: [{ id: 1 }] };
    const dispatch = jest.fn();
    Axios.post.mockResolvedValue({ status: 200 });

    await handleJoinSubreddit(user, { id: 2 }, dispatch);

    expect(Axios.post).toHaveBeenCalledWith("/api/subreddits/2/user");
    expect(dispatch).toHaveBeenCalledWith(
      setUser({ id: 1, subreddits: [{ id: 1 }, { id: 2 }] }),
    );
  });

  it("leaves the user unchanged when the request fails", async () => {
    const dispatch = jest.fn();
    Axios.post.mockRejectedValue({ response: { status: 500 } });

    await handleJoinSubreddit({ id: 1, subreddits: [] }, { id: 2 }, dispatch);

    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe("handleLeaveSubreddit", () => {
  it("removes the subreddit from the user's joined subreddits", async () => {
    const user = { id: 1, subreddits: [{ id: 1 }, { id: 2 }] };
    const dispatch = jest.fn();
    Axios.delete.mockResolvedValue({ status: 204 });

    await handleLeaveSubreddit(user, { id: 2 }, dispatch);

    expect(Axios.delete).toHaveBeenCalledWith("/api/subreddits/2/user");
    expect(dispatch).toHaveBeenCalledWith(
      setUser({ id: 1, subreddits: [{ id: 1 }] }),
    );
  });
});
