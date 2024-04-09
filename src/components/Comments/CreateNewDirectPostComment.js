import { useState } from "react";
import { useDispatch } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import handleSubmitComment from "../../utils/handleSubmitComment";
import { setLoginVisible } from "../../slices/appSlice";

const CreateNewDirectPostComment = ({ user, post }) => {
  const [commentPost, setCommentPost] = useState("");

  const [commentPostMessageError, setCommentPostMessageError] = useState(false);

  const [commentPostMessage, setCommentPostMessage] = useState(null);

  const dispatch = useDispatch();

  return (
    <div className="">
      <div>
        <TextareaAutosize
          value={commentPost}
          disabled={user ? false : true}
          onChange={(event) => {
            setCommentPost(event.target.value);
          }}
          className="w-full px-5 pt-3 border m-0 min-h-[10rem] "
        />

        <div className="bg-gray-100 w-full h-10 -mt-1.5 rounded-b-md flex items-center justify-end">
          <button
            onClick={async () => {
              if (user) {
                const res = await handleSubmitComment(
                  true,
                  commentPost,
                  post.subredditId,
                  post.id,
                  null,
                  user
                );
                if (res.success) {
                  setCommentPost("");
                  setCommentPostMessage("New comment created");
                  setTimeout(() => {
                    setCommentPostMessage(null);
                  }, 3000);
                } else {
                  setCommentPostMessage("Error while submitting comment");
                  setCommentPostMessageError(true);
                  setTimeout(() => {
                    setCommentPostMessage(null);
                    setCommentPostMessageError(null);
                  }, 3000);
                }
              } else {
                dispatch(setLoginVisible(true));
              }
            }}
            disabled={commentPost?.length < 1}
            className={`${
              user && commentPost?.length >= 1
                ? ""
                : "bg-gray-300 text-gray-400 hover:bg-gray-300 cursor-default"
            } join-btn mr-5 `}
          >
            {user ? "Comment" : "Log in to Comment"}
          </button>
        </div>
      </div>

      <p
        className={`${
          commentPostMessageError ? "text-red-600" : "text-green-600"
        } font-medium text-medium`}
      >
        {commentPostMessage && commentPostMessage}
      </p>
    </div>
  );
};

export default CreateNewDirectPostComment;
