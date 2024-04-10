import {
  ChatIcon,
  ShareIcon,
  BookmarkIcon,
  EyeOffIcon,
  FlagIcon,
} from "@heroicons/react/outline";
import f1 from "../fake data/f1.png";
import moment from "moment";
import PostVotingArrows from "./PostVotingArrows";

const PostPageMainInfoSection = ({ post, totalComments }) => {
  const date = new Date(post?.createdAt);

  return (
    <div className="flex flex-col sm:flex-row max-w-[40rem]  bg-white  mb-4">
      <div className=" hidden sm:flex flex-col items-center  w-25">
        <PostVotingArrows post={post} />
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col p-2">
          <div className="flex items-center space-x-2 ">
            <div
              onClick={() =>
                (window.location.href = `/r/${post.subreddit.name}`)
              }
              className="inline-block rounded-full overflow-hidden h-7 w-7 cursor-pointer flex-shrink-0"
            >
              <img src={f1} alt="user img" />
            </div>
            <p
              onClick={() =>
                (window.location.href = `/r/${post.subreddit.name}`)
              }
              className="inline mr-2 font-bold text-sm cursor-pointer"
            >
              r/{post?.subreddit?.name || "noName"}
            </p>
            <p className="inline text-xs text-gray-400">
              posted by u/{post?.user?.username || "noName"}{" "}
              {moment(date.getTime()).fromNow()}
            </p>
          </div>
          <div className="mt-2 font-semibold text-lg">{post.title}</div>
        </div>
        <div className="flex items-center w-full overflow-hidden self-stretch">
          {post.imageUrl && (
            <img
              alt="post img"
              className="block max-w-40rem w-full object-contain"
              src={post.imageUrl}
            />
          )}
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

export default PostPageMainInfoSection;
