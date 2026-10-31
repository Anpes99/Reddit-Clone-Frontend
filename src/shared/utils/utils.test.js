import axios from "axios";
import Axios from "../lib/axios";
import socket from "../lib/socket";
import { setUser } from "../../app/slices/appSlice";
import {
  createOrUpdateObjInListById,
  handleDislikePost,
  handleLikePost,
  makeStringSafeForURL,
  uploadImageToS3,
} from "./utils";

describe("createOrUpdateObjInListById", () => {
  it("adds an object that is not in the list", () => {
    expect(createOrUpdateObjInListById([{ id: 1 }], { id: 2 })).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  it("replaces an object with the same id without mutating the list", () => {
    const list = [{ id: 1, rating: 1 }];

    expect(createOrUpdateObjInListById(list, { id: 1, rating: -1 })).toEqual([
      { id: 1, rating: -1 },
    ]);
    expect(list).toEqual([{ id: 1, rating: 1 }]);
  });

  it("removes the object when its rating becomes 0", () => {
    expect(
      createOrUpdateObjInListById(
        [
          { id: 1, rating: 1 },
          { id: 2, rating: 1 },
        ],
        { id: 1, rating: 0 },
      ),
    ).toEqual([{ id: 2, rating: 1 }]);
  });
});

describe("makeStringSafeForURL", () => {
  it("turns a post title into a lowercase slug", () => {
    expect(makeStringSafeForURL("Hello World_again")).toBe("hello-world-again");
  });

  it("spells out punctuation instead of dropping it", () => {
    expect(makeStringSafeForURL("Is C++ fast?")).toBe(
      "is-cplusplus-fastquestion",
    );
  });

  it("keeps non-latin letters", () => {
    expect(makeStringSafeForURL("Hyvää päivää")).toBe("hyvää-päivää");
  });

  it("trims dashes and collapses repeated ones", () => {
    expect(makeStringSafeForURL("  --a   b--  ")).toBe("a-b");
  });

  it("enforces the maximum length", () => {
    expect(makeStringSafeForURL("a".repeat(200))).toHaveLength(140);
    expect(makeStringSafeForURL("abcdef", { maxLen: 3 })).toBe("abc");
  });

  it("returns an empty string for null or undefined", () => {
    expect(makeStringSafeForURL(null)).toBe("");
    expect(makeStringSafeForURL(undefined)).toBe("");
  });
});

describe("post voting", () => {
  const post = { id: 7 };

  // Makes the mocked socket answer the vote like the server would.
  const replyToVoteWith = (response) => {
    socket.emit.mockImplementation((eventName, payload, callback) =>
      callback(response),
    );
  };

  // The vote helpers resolve after a 3 second delay. Let their pending awaits
  // run first (Babel's async transform needs a few microtask ticks), then
  // fast-forward through the delay.
  const finishVote = async (votePromise) => {
    for (let tick = 0; tick < 10; tick++) {
      await Promise.resolve();
    }
    jest.runAllTimers();
    return votePromise;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    socket.emit.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("sends an upvote and stores the new rating on the user", async () => {
    const user = { id: 1, ratedPosts: [] };
    const dispatch = jest.fn();
    replyToVoteWith({ success: true, newRating: 1 });

    const result = await finishVote(handleLikePost(post, user, dispatch));

    expect(socket.emit).toHaveBeenCalledWith(
      "likePost",
      { postId: 7 },
      expect.any(Function),
    );
    expect(result).toEqual({ success: true, newRating: 1 });
    expect(dispatch).toHaveBeenCalledWith(
      setUser({ id: 1, ratedPosts: [{ id: 7, rating: 1 }] }),
    );
  });

  it("removes the rating when an upvote is cancelled", async () => {
    const user = { id: 1, ratedPosts: [{ id: 7, rating: 1 }] };
    const dispatch = jest.fn();
    replyToVoteWith({ success: true, newRating: 0 });

    await finishVote(handleLikePost(post, user, dispatch));

    expect(dispatch).toHaveBeenCalledWith(setUser({ id: 1, ratedPosts: [] }));
  });

  it("turns an upvote into a downvote", async () => {
    const user = { id: 1, ratedPosts: [{ id: 7, rating: 1 }] };
    const dispatch = jest.fn();
    replyToVoteWith({ success: true, newRating: -1 });

    await finishVote(handleDislikePost(post, user, dispatch));

    expect(socket.emit).toHaveBeenCalledWith(
      "dislikePost",
      { postId: 7 },
      expect.any(Function),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setUser({ id: 1, ratedPosts: [{ id: 7, rating: -1 }] }),
    );
  });

  it("leaves the user unchanged when the server rejects the vote", async () => {
    const dispatch = jest.fn();
    replyToVoteWith({ success: false });

    await finishVote(handleLikePost(post, { id: 1, ratedPosts: [] }, dispatch));

    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe("uploadImageToS3", () => {
  const presignedPost = (url) => ({
    data: {
      url: {
        url,
        key: "images/abc.png",
        fields: { bucket: "reddit-images", key: "images/abc.png", Policy: "p" },
      },
    },
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("uploads the file with the presigned fields and returns its URL", async () => {
    jest
      .spyOn(Axios, "get")
      .mockResolvedValue(
        presignedPost("https://s3.eu-north-1.amazonaws.com/reddit-images"),
      );
    const upload = jest.spyOn(axios, "post").mockResolvedValue({});
    const file = new File(["image"], "abc.png", { type: "image/png" });

    const imageUrl = await uploadImageToS3(file);

    expect(Axios.get).toHaveBeenCalledWith("/api/utils/s3Url");
    const [uploadUrl, formData] = upload.mock.calls[0];
    expect(uploadUrl).toBe("https://s3.eu-north-1.amazonaws.com/reddit-images");
    expect(formData.get("Policy")).toBe("p");
    expect(formData.get("key")).toBe("images/abc.png");
    expect(formData.get("file")).toBe(file);
    expect(imageUrl).toBe(
      "https://reddit-images.s3.eu-north-1.amazonaws.com/images/abc.png",
    );
  });

  it("fails when the upload URL is not a regional S3 URL", async () => {
    jest
      .spyOn(Axios, "get")
      .mockResolvedValue(presignedPost("https://example.com/upload"));
    jest.spyOn(axios, "post").mockResolvedValue({});

    await expect(uploadImageToS3(new File(["x"], "x.png"))).rejects.toThrow(
      "Could not determine S3 region",
    );
  });
});
