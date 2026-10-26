import { useDispatch, useSelector } from "react-redux";
import CommentActionsBar from "./CommentActionsBar";
import Avatar from "./Avatar";
import { useState } from "react";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/outline";
import "./SingleCommentAndChilrenCommentsThread.css";
import Axios from "../../../../shared/lib/axios";

const SingleCommentInfoAndActions = ({ post, comment }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  return (
    <div className=" flex flex-col items-start text-left space-x-1 p-2 ">
      <Avatar comment={comment} />

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
  const user = useSelector((state) => state.app.user);
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
