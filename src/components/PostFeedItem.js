import img from "../fake data/markus-spiske-2siq7rVFeZs-unsplash.jpg";
import { ArrowSmUpIcon } from "@heroicons/react/outline";
import { ArrowSmDownIcon } from "@heroicons/react/outline";
import skyrim from "../fake data/skyrim.png";
import moment from "moment";
import { useNavigate } from "react-router";
import axios from "axios";
import socket from "../websockets/posts";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoginVisible, setSignUpVisible } from "../slices/appSlice";

const PostFeedItem = ({ post }) => {
  const user = useSelector((state) => state.app.user);

  const dispatch = useDispatch();

  const [likes, setLikes] = useState(post?.upVotes - post?.downVotes);

  const date = new Date(post.createdAt);

  const navigate = useNavigate();

  const handleLike = async () => {
    socket.emit("likePost", post.id);
  };
  const handleDislike = async () => {
    socket.emit("dislikePost", post.id);
  };
  socket.on("post_received_likes", (postId) => {
    if (postId === post.id) {
      setLikes(likes + 1);
    }
  });
  socket.on("post_received_dislikes", (postId) => {
    if (postId === post.id) {
      setLikes(likes - 1);
    }
  });

  return (
    <div className=" flex flex-col sm:flex-row w-full    sm:h-min-content bg-white border mb-3  border-gray-300 p-0.5">
      <div className=" hidden sm:flex flex-col items-center bg-gray-50 w-20 p-1.5">
        <ArrowSmUpIcon
          onClick={() => {
            if (user) {
              handleLike();
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className="h-7 text-gray-400 hover:text-red-500 cursor-pointer "
        />
        <p className=" px-1 font-bold text-xs">{likes}</p>
        <ArrowSmDownIcon
          onClick={() => {
            if (user) {
              handleDislike();
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className="h-7 text-gray-400 hover:text-blue-500 cursor-pointer"
        />
      </div>

      <div
        onClick={() => {
          navigate(
            `/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
              post?.title.replaceAll(" ", "_") || "noTitle"
            }`
          );
        }}
        className="flex flex-col cursor-pointer w-full"
      >
        <div className="flex flex-col p-2">
          <div className="flex items-center space-x-2 ">
            <div className="inline-block rounded-full overflow-hidden h-7 w-7">
              <img src={skyrim} />
            </div>
            <p className="inline mr-2 font-bold text-sm">
              r/{post?.subreddit?.name || "noName"}
            </p>
            <p className="inline text-xs text-gray-400">
              posted by u/{post?.user?.username || "noName"}{" "}
              {moment(date.getTime()).fromNow()}
            </p>
          </div>
          <div className="mt-2 font-semibold text-lg line-clamp-5">
            {post.title}
          </div>
        </div>

        <img
          className="block max-w-[40rem]  overflow-hidden  object-contain w-full m-auto"
          src={post?.imageUrl || null}
        />
      </div>
      <div className="flex sm:hidden p-2 items-center">
        <ArrowSmUpIcon
          onClick={() => {
            if (user) {
              handleLike();
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className="text-gray-400 h-7 hover:text-red-500 cursor-pointer"
        />
        <p className=" px-1 font-bold text-sm">
          {post.upVotes - post.downVotes}
        </p>
        <ArrowSmDownIcon
          onClick={() => {
            if (user) {
              handleDislike();
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className="h-7 text-gray-400 hover:text-blue-500 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PostFeedItem;
