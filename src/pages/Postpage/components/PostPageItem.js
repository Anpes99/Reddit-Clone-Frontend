import { ChatIcon } from "@heroicons/react/outline";
import moment from "moment";
import PostVotingArrows from "../../../components/Feeds/PostFeed/PostVotingArrows";
import UserHoverCard from "../../../components/Users/UserHoverCard";
import DefaultSubredditIcon from "../../../assets/icons/DefaultSubredditIcon";
import SubredditHoverCard from "../../../components/Subreddits/SubredditHoverCard";

const PostPageMainInfoSection = ({ post }) => {
  const date = new Date(post?.createdAt);
  return (
    <div className="flex flex-col sm:flex-row w-full max-w-[40rem]  bg-white  mb-4">
      <div className=" hidden sm:flex flex-col items-center  w-25">
        <PostVotingArrows post={post} />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex flex-col p-2">
          <div className="flex items-center space-x-2 ">
            <SubredditHoverCard subredditName={post?.subreddit?.name}>
              <div className="inline-block flex justify-center items-center rounded-full overflow-hidden h-7 w-7 cursor-pointer flex-shrink-0">
                {post?.subreddit?.iconUrl ? (
                  <img src={post?.subreddit?.iconUrl} alt="subreddit img" />
                ) : (
                  <DefaultSubredditIcon />
                )}
              </div>
            </SubredditHoverCard>
            <SubredditHoverCard subredditName={post?.subreddit?.name}>
              <p className="inline mr-2 font-bold text-sm cursor-pointer">
                r/{post?.subreddit?.name || "noName"}
              </p>
            </SubredditHoverCard>
            <p className="inline text-xs text-gray-400">
              posted by{" "}
              <UserHoverCard username={post?.user?.username}>
                u/{post?.user?.username || "noName"}
              </UserHoverCard>{" "}
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
          <p className="p-2 py-3">
            <ChatIcon className="w-6 h-6 inline mr-0.5 " /> {post.commentCount}{" "}
            Comments
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostPageMainInfoSection;
