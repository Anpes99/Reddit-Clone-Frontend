import * as yup from "yup";
import Axios from "../../../shared/lib/axios";

const handleSubmitComment = async (
  directReplyToPost,
  comment,
  subredditId,
  postId,
  commentId,
  user,
) => {
  const commentSchema = yup.object().shape({
    text: yup.string().min(1).required(),
    directReplyToPost: yup.boolean().required(),
    subredditId: yup.number().required(),
    postId: yup.number().required(),
  });

  const data = {
    text: comment,
    directReplyToPost,
    subredditId: subredditId, // localstorage.getItem("...")
    postId: postId,
  };
  const result = commentSchema.isValid(data).then(async (isValid) => {
    if (!isValid) {
      return { success: false };
    }

    if (commentId && !directReplyToPost) {
      data.commentId = commentId;
    }

    try {
      await Axios.post("/api/comments", data);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  });
  return result;
};

export default handleSubmitComment;
