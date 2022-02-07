import img from "../fake data/markus-spiske-2siq7rVFeZs-unsplash.jpg";
import { ArrowSmUpIcon } from "@heroicons/react/outline";
import {
  ArrowSmDownIcon,
  ChatIcon,
  ShareIcon,
  BookmarkIcon,
  EyeOffIcon,
  FlagIcon,
} from "@heroicons/react/outline";
import skyrim from "../fake data/skyrim.png";
import moment from "moment";
import socket from "../websockets/posts";

import { useDispatch, useSelector } from "react-redux";
import { setLoginVisible } from "../slices/appSlice";
import { useEffect, useRef, useState } from "react";

const PostLikes = ({ post, className }) => {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    setLikes(post.upVotes - post.downVotes);
  }, [post]);

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

  return <p className={className}>{likes}</p>;
};

const PostPageItem = ({ post, totalComments }) => {
  console.log(post);
  console.log(post.createdAt);
  const date = new Date(post.createdAt);
  console.log(post);

  const handleLike = async () => {
    socket.emit("likePost", post.id);
  };
  const handleDislike = async () => {
    socket.emit("dislikePost", post.id);
  };

  const dispatch = useDispatch();

  const user = useSelector((state) => state.app.user);

  return (
    <div className="flex flex-col sm:flex-row max-w-[40rem]  bg-white  mb-4">
      <div className=" hidden sm:flex flex-col items-center  w-25">
        <ArrowSmUpIcon
          onClick={() => {
            if (user) {
              handleLike();
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className="h-7 text-gray-400 hover:text-red-500 cursor-pointer"
        />
        <PostLikes className=" px-1 font-bold text-sm" post={post} />
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

      <div className="flex flex-col">
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
          <div className="mt-2 font-semibold text-lg line-clamp-2">
            {post.title}
          </div>
        </div>
        <div className="flex items-center w-full overflow-hidden self-stretch">
          <img className="h-full object-contain" src={post.imageUrl || null} />
        </div>
        <div className="flex text-gray-400 items-center text-xs space-x-1 p-1">
          <p className="hover:bg-gray-200 p-2 py-3">
            <ChatIcon className="w-6 h-6 inline mr-0.5 " /> {totalComments}{" "}
            Comments
          </p>
          <p className="hover:bg-gray-200 p-2 py-3">
            <ShareIcon className="w-6 h-6 inline mr-0.5 " /> Share
          </p>
          <p className="hover:bg-gray-200 p-2 py-3">
            <BookmarkIcon className="w-6 h-6 inline mr-0.5 " /> Save
          </p>
          <p className="hover:bg-gray-200 p-2 py-3">
            <EyeOffIcon className="w-6 h-6 inline mr-0.5 " /> Hide
          </p>
          <p className="hover:bg-gray-200 p-2 py-3">
            <FlagIcon className="w-6 h-6 inline mr-0.5 " /> Report
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostPageItem;
