import f1 from "../fake data/f1.png";
import moment from "moment";
import { useNavigate } from "react-router";
import socket from "../websockets/posts";
import { useState } from "react";
import { Voting } from "./PostPageItem";

const PostFeedItem = ({ post }) => {
  const [likes, setLikes] = useState(post?.upVotes - post?.downVotes);

  const date = new Date(post.createdAt);

  const navigate = useNavigate();

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

  return (
    <div className=" flex flex-col sm:flex-row w-full    sm:h-min-content bg-white border mb-3  border-gray-300 p-0.5">
      <div className=" hidden sm:flex flex-col items-center bg-gray-50 w-20 p-1.5">
        <Voting post={post} />
      </div>

      <div
        onClick={() => {
          console.log(post);
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
              <img src={f1} alt="subreddit img" />
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
        <Voting post={post} />
      </div>
    </div>
  );
};

export default PostFeedItem;
