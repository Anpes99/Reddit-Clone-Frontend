import {
  ChatIcon,
  ShareIcon,
  BookmarkIcon,
  EyeOffIcon,
  FlagIcon,
} from "@heroicons/react/outline";
import moment from "moment";
import PostVotingArrows from "../../../components/Feeds/PostFeed/PostVotingArrows";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import DefaultSubredditIcon from "../../../assets/icons/DefaultSubredditIcon";

const PostPageMainInfoSection = ({ post }) => {
  const date = new Date(post?.createdAt);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row max-w-[40rem]  bg-white  mb-4">
      <div className=" hidden sm:flex flex-col items-center  w-25">
        <PostVotingArrows post={post} />
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col p-2">
          <div className="flex items-center space-x-2 ">
            <div
              onClick={() => {
                navigate(`/r/${post.subreddit.name}`);
              }}
              className="inline-block flex justify-center items-center rounded-full overflow-hidden h-7 w-7 cursor-pointer flex-shrink-0"
            >
              {post.subreddit?.iconUrl ? (
                <img src={post.subreddit?.iconUrl} alt="subreddit img" />
              ) : (
                <DefaultSubredditIcon />
              )}
            </div>
            <p
              onClick={() => {
                navigate(`/r/${post.subreddit.name}`);
              }}
              className="inline mr-2 font-bold text-sm cursor-pointer"
            >
              r/{post?.subreddit?.name || "noName"}
            </p>
            <p className="inline text-xs text-gray-400">
              posted by{" "}
              <Link to={`/user/${post?.user?.username}`}>
                u/{post?.user?.username || "noName"}
              </Link>{" "}
              {moment(date.getTime()).fromNow()}
            </p>
          </div>
          <div className="mt-2 font-semibold text-lg">{post.title}</div>
        </div>
        <div className="flex flex-col items-center w-full overflow-hidden self-stretch">
          {post.imageUrl && (
            <img
              alt="post img"
              className="block max-w-40rem w-full object-contain pb-5"
              src={post.imageUrl}
            />
          )}
          {post.text && <p className="self-start">{post.text}</p>}
        </div>
        <div className="flex text-gray-400 items-center text-xs space-x-1 p-1">
          <p className="hover:bg-gray-200 p-2 py-3">
            <ChatIcon className="w-6 h-6 inline mr-0.5 " /> {post.commentCount}{" "}
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
