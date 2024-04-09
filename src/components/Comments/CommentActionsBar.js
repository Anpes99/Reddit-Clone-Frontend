import { ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/outline";
import { handleDislikeComment, handleLikeComment } from "../../utils/utils";
import { useState } from "react";
import socket from "../../websockets/posts";
import { setLoginVisible } from "../../slices/appSlice";
import { ChatIcon } from "@heroicons/react/outline";
import CommentCommentSection from "./CommentCommentSection";

const CommentActionsBar = ({ post, comment, user, dispatch }) => {
  const [newComment, setNewComment] = useState("");
  const [createCommentVisible, setCreateCommentVisible] = useState(false);
  const [likes, setLikes] = useState(comment.upVotes - comment.downVotes);

  socket.on("comment_received_likes", (commentId) => {
    if (commentId === comment.id) {
      setLikes(likes + 1);
    }
  });
  socket.on("comment_received_dislikes", (commentId) => {
    if (commentId === comment.id) {
      setLikes(likes - 1);
    }
  });

  return (
    <div className="flex flex-col">
      <div className="flex  sm:p-2 items-center space-x-1 text-gray-400 font-semibold text-xs">
        <ArrowSmUpIcon
          onClick={() => {
            if (user) {
              handleLikeComment(comment.id, user.id);
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className="text-gray-400 w-4 hover:text-red-500 cursor-pointer"
        />
        <p className=" font-bold">{likes}</p>
        <ArrowSmDownIcon
          onClick={() => {
            if (user) {
              handleDislikeComment(comment.id, user.id);
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
        <p className="hover:bg-gray-200 cursor-pointer">Share</p>
        <p className="hover:bg-gray-200 cursor-pointer">Report</p>
        <p className="hover:bg-gray-200 cursor-pointer">Save</p>
        <p className="hover:bg-gray-200 cursor-pointer">Follow</p>
      </div>
      <CommentCommentSection
        commentId={comment.id}
        comment={newComment}
        setComment={setNewComment}
        visible={createCommentVisible}
        setVisible={setCreateCommentVisible}
        subredditId={post.subredditId}
        postId={post.id}
        user={user}
      />
    </div>
  );
};

export default CommentActionsBar;
