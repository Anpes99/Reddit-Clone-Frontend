import { useState } from "react";
import handleSubmitComment from "../../utils/handleSubmitComment";
import TextareaAutosize from "react-textarea-autosize";

const CommentCommentSection = ({
  commentId,
  setComment,
  comment,
  setVisible,
  visible,
  subredditId,
  postId,
  user,
}) => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  return (
    <>
      <p
        className={`${
          error ? "text-red-600" : "text-green-600"
        } font-medium text-medium`}
      >
        {message && message}
      </p>

      <div className={`mb-5 ${visible ? "block" : "hidden"}`}>
        <TextareaAutosize
          onChange={(event) => {
            setComment(event.target.value);
          }}
          className="w-full px-5 pt-3 border m-0 min-h-[5rem] "
        />
        <div className="bg-gray-100 w-full h-10 -mt-1.5 rounded-b-md flex items-center justify-end">
          <button
            onClick={async () => {
              const res = await handleSubmitComment(
                false,
                comment,
                subredditId,
                postId,
                commentId,
                user
              );

              if (res.success) {
                setVisible(false);
                setMessage("new comment created");
                setTimeout(() => {
                  setMessage(null);
                }, 3000);
              }
            }}
            className="join-btn mr-5 "
          >
            Send reply
          </button>
        </div>
      </div>
    </>
  );
};

export default CommentCommentSection;
