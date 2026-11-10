import { ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/outline";
import {
  handleDislikeComment,
  handleLikeComment,
} from "../../../../shared/utils/utils";
import { useEffect, useState } from "react";
import socket from "../../../../shared/lib/socket";
import { setLoginVisible } from "../../../../app/slices/appSlice";
import { ChatIcon, PencilIcon } from "@heroicons/react/outline";
import ReplyToCommentSection from "./ReplyToCommentSection";

const CommentLikes = ({ comment }) => {
  const [likes, setLikes] = useState(comment.upVotes - comment.downVotes);
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
  }, [comment.id]);

  return <p className=" font-bold">{likes}</p>;
};

const CommentActionsBar = ({ post, comment, user, dispatch, onEdit }) => {
  const [newComment, setNewComment] = useState("");
  const [createCommentVisible, setCreateCommentVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex flex-col">
      <div className="flex  sm:p-2 items-center space-x-1 text-gray-400 font-semibold text-xs">
        <ArrowSmUpIcon
          role="button"
          aria-hidden={false}
          aria-label="Upvote comment"
          onClick={async () => {
            if (loading) return;
            if (user) {
              setLoading(true);
              await handleLikeComment(comment.id, user.id);
              setLoading(false);
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className="text-gray-400 w-4 hover:text-red-500 cursor-pointer"
        />
        <CommentLikes comment={comment} />
        <ArrowSmDownIcon
          role="button"
          aria-hidden={false}
          aria-label="Downvote comment"
          onClick={async () => {
            if (loading) return;
            if (user) {
              setLoading(true);
              await handleDislikeComment(comment.id, user.id);
              setLoading(false);
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className="w-4 text-gray-400 hover:text-blue-500 cursor-pointer"
        />
        <p
          onClick={() => {
            setCreateCommentVisible(!createCommentVisible);
          }}
          className="flex items-center hover:bg-gray-200 cursor-pointer"
        >
          <ChatIcon className="hidden sm:inline-block h-6 mr-1" /> Reply
        </p>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center hover:bg-gray-200 cursor-pointer"
          >
            <PencilIcon className="hidden sm:inline-block h-5 mr-1" /> Edit
          </button>
        )}
      </div>
      <ReplyToCommentSection
        commentId={comment.id}
        comment={newComment}
        setComment={setNewComment}
        visible={createCommentVisible}
        setVisible={setCreateCommentVisible}
        subredditId={post.subredditId}
        postId={post.id}
      />
    </div>
  );
};

export default CommentActionsBar;
