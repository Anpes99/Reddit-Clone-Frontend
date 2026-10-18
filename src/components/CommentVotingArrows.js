import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleDislikeComment, handleLikeComment } from "../utils/utils";
import { setLoginVisible } from "../slices/appSlice";
import { ArrowSmUpIcon } from "@heroicons/react/outline";
import { ArrowSmDownIcon } from "@heroicons/react/outline";
import socket from "../websockets/posts";

const PostLikes = ({ post, className }) => {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    setLikes(post.upVotes - post.downVotes);
  }, [post]);

  useEffect(() => {
    socket.on("comment_likes_changed", ({ commentId, ratingToPlusOrMinus }) => {
      if (commentId === post.id) {
        setLikes((currentValue) => currentValue + ratingToPlusOrMinus);
      }
    });
  }, []);

  return (
    <p className={className}>
      <>{likes}</>
    </p>
  );
};

const CommentVotingArrows = ({ post, numberColor }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  return (
    <>
      <ArrowSmUpIcon
        onClick={() => {
          if (user) {
            handleLikeComment(post.id, user.id);
          } else {
            dispatch(setLoginVisible(true));
          }
        }}
        className={`h-7  "text-gray-450" hover:text-red-500 cursor-pointer`}
      />
      <PostLikes
        className={`px-1 font-bold text-sm ${
          numberColor ? numberColor : "text-black"
        }`}
        post={post}
      />
      <ArrowSmDownIcon
        onClick={() => {
          if (user) {
            handleDislikeComment(post.id, user.id);
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
