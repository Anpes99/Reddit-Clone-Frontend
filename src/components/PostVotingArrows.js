import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleDislikePost, handleLikePost } from "../utils/utils";
import { setLoginVisible } from "../slices/appSlice";
import { ArrowSmUpIcon } from "@heroicons/react/outline";
import { ArrowSmDownIcon } from "@heroicons/react/outline";
import socket from "../websockets/posts";

const PostLikes = ({ post, className }) => {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    setLikes(post.upVotes - post.downVotes);
  }, [post]);

  socket.on("post_received_likes", (postId, pointsToAdd) => {
    if (postId === post.id) {
      setLikes(likes + pointsToAdd);
    }
  });
  socket.on("post_received_dislikes", (postId, pointsToAdd) => {
    if (postId === post.id) {
      setLikes(likes + pointsToAdd);
    }
  });

  return <p className={className}>{likes}</p>;
};

const PostVotingArrows = ({ post, numberColor }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    const index = user?.ratedPosts?.findIndex((p) => p.id === post?.id);

    if (index === -1) {
      setUserRating(null);
    } else {
      if (user) {
        setUserRating(user?.ratedPosts?.[index]?.rating);
      }
    }
  }, [user, post]);
  return (
    <>
      <ArrowSmUpIcon
        onClick={async () => {
          if (user) {
            if (loading) {
              return;
            }
            setLoading(true);
            await handleLikePost(post, user, dispatch);
            setLoading(false);
          } else {
            dispatch(setLoginVisible(true));
          }
        }}
        className={`h-7  ${
          userRating === 1 ? "text-red-500" : "text-gray-400"
        } hover:text-red-500 cursor-pointer`}
      />
      <PostLikes
        className={`px-1 font-bold text-sm ${
          numberColor ? numberColor : "text-black"
        }`}
        post={post}
      />
      <ArrowSmDownIcon
        onClick={async () => {
          if (user) {
            if (loading) {
              return;
            }
            setLoading(true);
            await handleDislikePost(post, user, dispatch);
            setLoading(false);
          } else {
            dispatch(setLoginVisible(true));
          }
        }}
        className={`h-7  hover:text-blue-500 cursor-pointer ${
          userRating === -1 ? "text-blue-500" : "text-gray-400"
        }   `}
      />
    </>
  );
};

export default PostVotingArrows;
