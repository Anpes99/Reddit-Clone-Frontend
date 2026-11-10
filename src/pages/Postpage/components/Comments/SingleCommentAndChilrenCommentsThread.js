import { useDispatch, useSelector } from "react-redux";
import CommentActionsBar from "./CommentActionsBar";
import Avatar from "./Avatar";
import { useState } from "react";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/outline";
import "./SingleCommentAndChilrenCommentsThread.css";
import TextareaAutosize from "react-textarea-autosize";
import Axios from "../../../../shared/lib/axios";
import { addGlobalNotification } from "../../../../app/slices/appSlice";

const SingleCommentInfoAndActions = ({ post, comment }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  const [text, setText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [isSaveInProgress, setIsSaveInProgress] = useState(false);

  const canEdit =
    !!user && user.username === comment.user?.username && !comment.isDeleted;

  const startEditing = () => {
    setEditText(text);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaveInProgress(true);
    try {
      const res = await Axios.patch(`/api/comments/${comment.id}`, {
        text: editText,
      });
      setText(res.data.comment.text);
      setIsEditing(false);
      dispatch(
        addGlobalNotification({ type: "success", message: "Comment updated." }),
      );
    } catch (e) {
      if (e.response?.status !== 429) {
        dispatch(
          addGlobalNotification({
            type: "error",
            message: "Couldn't update the comment. Please try again.",
          }),
        );
      }
    } finally {
      setIsSaveInProgress(false);
    }
  };

  const canSave =
    !isSaveInProgress && editText.trim().length > 0 && editText !== text;

  return (
    <div className=" flex flex-col items-start text-left space-x-1 p-2 ">
      <Avatar comment={comment} />

      {isEditing ? (
        <div className="self-stretch pl-7">
          <TextareaAutosize
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            maxLength={10000}
            autoFocus
            aria-label="Edit comment"
            className="w-full px-3 pt-2 border min-h-[4rem]"
          />
          <div className="flex justify-end space-x-2 mt-1">
            <button
              onClick={() => setIsEditing(false)}
              disabled={isSaveInProgress}
              className="px-3 py-1 text-gray-500 font-semibold hover:bg-gray-100 rounded-full"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`${
                canSave
                  ? ""
                  : "bg-gray-300 text-gray-400 hover:bg-gray-300 cursor-default"
              } join-btn`}
            >
              {isSaveInProgress ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <p className="p-1 pl-7 whitespace-pre-wrap break-words">{text}</p>
      )}
      <CommentActionsBar
        comment={comment}
        post={post}
        user={user}
        dispatch={dispatch}
        onEdit={canEdit && !isEditing ? startEditing : undefined}
      />
    </div>
  );
};

const CommentCommentsSection = ({ post, fetchedComments }) => {
  return (
    <div className="ml-3 sm:ml-10">
      {fetchedComments.map((comment) => (
        <SingleCommentAndCommentCommentsThread
          key={"comment_" + comment.id}
          post={post}
          comment={comment}
        />
      ))}
    </div>
  );
};

const SingleCommentAndCommentCommentsThread = ({ post, comment }) => {
  const [showChildCommentsThread, setShowChildCommentsThread] = useState(false);
  const [fetchedComments, setFetchedComments] = useState([]);

  const getMoreComments = async () => {
    const { data } = await Axios.get(
      "/api/comments/moreComments/" + comment.id,
    );
    return data;
  };

  return (
    <div className="relative border-l SingleCommentAndCommentCommentsThreadContainer">
      {showChildCommentsThread && (
        <div
          onClick={() => {
            setShowChildCommentsThread(false);
          }}
          style={{
            position: "absolute",
            height: "100%",
            cursor: "pointer",
            left: "-10px",
          }}
          className="commentThreadLeftBorder"
        >
          <MinusCircleIcon
            style={{
              width: "20px",
              position: "relative",
              backgroundColor: "white",
              cursor: "pointer",
            }}
            className="top-[74px] sm:top-[97px]"
          />
        </div>
      )}

      <SingleCommentInfoAndActions comment={comment} post={post} />
      {!showChildCommentsThread && comment.descendantCount ? (
        <div
          onClick={async () => {
            const moreComments = await getMoreComments();
            setFetchedComments(moreComments);
            setShowChildCommentsThread(true);
          }}
          style={{ cursor: "pointer", display: "flex" }}
          className="moreRepliesTextContainer"
        >
          <PlusCircleIcon style={{ height: "20px", marginRight: "5px" }} />
          <p className="text-gray-500 moreRepliesText">
            {comment.descendantCount} more replies
          </p>
        </div>
      ) : (
        <></>
      )}
      {showChildCommentsThread && (
        <CommentCommentsSection fetchedComments={fetchedComments} post={post} />
      )}
    </div>
  );
};

export default SingleCommentAndCommentCommentsThread;
