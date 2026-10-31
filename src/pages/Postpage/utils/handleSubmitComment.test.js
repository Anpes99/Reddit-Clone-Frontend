import Axios from "../../../shared/lib/axios";
import handleSubmitComment from "./handleSubmitComment";

jest.mock("../../../shared/lib/axios", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

beforeEach(() => {
  Axios.post.mockReset();
});

it("posts a direct reply to the post", async () => {
  Axios.post.mockResolvedValue({ status: 201 });

  const result = await handleSubmitComment(true, "Nice post", 3, 7, 11);

  expect(result).toEqual({ success: true });
  expect(Axios.post).toHaveBeenCalledWith("/api/comments", {
    text: "Nice post",
    directReplyToPost: true,
    subredditId: 3,
    postId: 7,
  });
});

it("includes the parent comment when replying to a comment", async () => {
  Axios.post.mockResolvedValue({ status: 201 });

  await handleSubmitComment(false, "I agree", 3, 7, 11);

  expect(Axios.post).toHaveBeenCalledWith("/api/comments", {
    text: "I agree",
    directReplyToPost: false,
    subredditId: 3,
    postId: 7,
    commentId: 11,
  });
});

it("does not send an empty comment", async () => {
  const result = await handleSubmitComment(true, "", 3, 7);

  expect(result).toEqual({ success: false });
  expect(Axios.post).not.toHaveBeenCalled();
});

it("reports a failure when the API rejects the comment", async () => {
  Axios.post.mockRejectedValue(new Error("Network Error"));

  const result = await handleSubmitComment(true, "Nice post", 3, 7);

  expect(result).toEqual({ success: false });
});
