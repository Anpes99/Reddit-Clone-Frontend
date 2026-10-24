import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleDislikeComment, handleLikeComment } from "../utils/utils";
import { setLoginVisible } from "../slices/appSlice";
import { ArrowSmUpIcon } from "@heroicons/react/outline";
import { ArrowSmDownIcon } from "@heroicons/react/outline";
import socket from "../websockets/posts";

const CommentLikes = ({ comment, className }) => {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    setLikes(comment.upVotes - comment.downVotes);
  }, [comment]);

  useEffect(() => {
    const handleCommentLikesChanged = ({ commentId, ratingToPlusOrMinus }) => {
      if (commentId === comment.id) {
        setLikes((currentValue) => currentValue + ratingToPlusOrMinus);
      }
    };

    socket.on("comment_likes_changed", handleCommentLikesChanged);

    return () => {
      socket.off("comment_likes_changed", handleCommentLikesChanged);
    };
  }, []);

  return (
    <p className={className}>
      <>{likes}</>
    </p>
  );
};

const CommentVotingArrows = ({ comment, numberColor }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  return (
    <>
      <ArrowSmUpIcon
        onClick={() => {
          if (user) {
            handleLikeComment(comment.id, user.id);
          } else {
            dispatch(setLoginVisible(true));
          }
        }}
        className={`h-7  "text-gray-450" hover:text-red-500 cursor-pointer`}
      />
      <CommentLikes
        className={`px-1 font-bold text-sm ${
          numberColor ? numberColor : "text-black"
        }`}
        comment={comment}
      />
      <ArrowSmDownIcon
        onClick={() => {
          if (user) {
            handleDislikeComment(comment.id, user.id);
          } else {
            dispatch(setLoginVisible(true));
          }
        }}
        className={`h-7  hover:text-blue-500 cursor-pointer  "text-gray-450"   `}
      />
    </>
  );
};

export default CommentVotingArrows;
