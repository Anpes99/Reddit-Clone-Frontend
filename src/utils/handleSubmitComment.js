import * as yup from "yup";
import axios from "axios";

const handleSubmitComment = async (
  directReplyToPost,
  comment,
  subredditId,
  postId,
  commentId,
  user
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
  const result = commentSchema.isValid(data).then(async () => {
    if (commentId && !directReplyToPost) {
      data.commentId = commentId;
    }

    try {
      await axios.post("/api/comments", data, {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      });
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  });
  return result;
};

export default handleSubmitComment;
