import { useDispatch, useSelector } from "react-redux";
import CommentActionsBar from "./CommentActionsBar";
import Avatar from "./Avatar";
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/outline";
import "./SingleCommentAndChilrenCommentsThread.css";

const SingleCommentInfoAndActions = ({ post, comment }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  return (
    <div className=" flex flex-col items-start text-left space-x-1 p-2 ">
      <Avatar createdAt={comment.createdAt} />

      <p className="p-1 pl-7">{comment.text}</p>
      <CommentActionsBar
        comment={comment}
        post={post}
        user={user}
        dispatch={dispatch}
      />
    </div>
  );
};

const CommentCommentsSection = ({ post, comment }) => {
  return (
    <div className="translate-x-3 sm:translate-x-10">
      {comment.comments.map((childComment) => (
        <SingleCommentAndCommentCommentsThread
          post={post}
          comment={childComment}
        />
      ))}
    </div>
  );
};

const SingleCommentAndCommentCommentsThread = ({ post, comment }) => {
  const [showChildCommentsThread, setShowChildCommentsThread] = useState(false);
  return (
    <div className="border-l">
      <SingleCommentInfoAndActions comment={comment} post={post} />
      {!showChildCommentsThread && comment.descendantCount ? (
        <div
          onClick={() => {
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
        <CommentCommentsSection comment={comment} post={post} />
      )}
    </div>
  );
};

export default SingleCommentAndCommentCommentsThread;
