import moment from "moment";
import { useNavigate } from "react-router";
import PostVotingArrows from "../../../../components/Feeds/PostFeed/PostVotingArrows";
import { makeStringSafeForURL } from "../../../../shared/utils/utils";
import CommentVotingArrows from "./CommentVotingArrows";
import UserHoverCard from "../../../../components/Users/UserHoverCard";
import DefaultSubredditIcon from "../../../../assets/icons/DefaultSubredditIcon";
import SubredditHoverCard from "../../../../components/Subreddits/SubredditHoverCard";

const CommentFeedItem = ({ comment }) => {
  const date = new Date(comment.createdAt);

  const navigate = useNavigate();

  return (
    <div className=" flex flex-col sm:flex-row w-full    sm:h-min-content bg-white border mb-3  border-gray-300 p-0.5">
      <div className=" hidden sm:flex flex-col items-center bg-gray-50 w-20 p-1.5">
        <CommentVotingArrows comment={comment} />
      </div>
      <div
        onClick={() => {
          navigate(
            `/r/${comment?.subreddit?.name || "noName"}/comments/${comment.post.id}/${
              makeStringSafeForURL(comment?.post?.title) || "noTitle"
            }`,
          );
        }}
        className="flex flex-col cursor-pointer w-full"
      >
        <div className="flex flex-col p-2">
          <div className="flex items-center space-x-2 ">
            <SubredditHoverCard subredditName={comment?.subreddit?.name}>
              <div className="inline-block rounded-full overflow-hidden h-7 w-7">
                {comment?.subreddit?.iconUrl ? (
                  <img src={comment?.subreddit?.iconUrl} alt="subreddit img" />
                ) : (
                  <DefaultSubredditIcon />
                )}
              </div>
            </SubredditHoverCard>
            <SubredditHoverCard subredditName={comment?.subreddit?.name}>
              <p className="inline mr-2 font-bold text-sm">
                r/{comment?.subreddit?.name || "noName"}
              </p>
            </SubredditHoverCard>
          </div>
          <div className="mt-2  text-xs line-clamp-5">
            {comment.post?.title}
          </div>
          <div className="flex space-x-1 items-center mb-3 mt-2 text-xs">
            <UserHoverCard username={comment.user?.username}>
              <p className="font-bold ">{comment.user?.username}</p>
            </UserHoverCard>
            {comment.parentComment ? (
              <>
                <p className="text-gray-500">answered to comment by</p>
                <UserHoverCard username={comment.parentComment?.user?.username}>
                  <p className="font-bold ">
                    {comment.parentComment?.user?.username}{" "}
                  </p>
                </UserHoverCard>
              </>
            ) : (
              <p className="text-gray-500">commented</p>
            )}
            <p className="text-gray-500"> {moment(date.getTime()).fromNow()}</p>
          </div>
          {comment.text}
        </div>
      </div>

      <div className="flex sm:hidden p-2 items-center">
        <PostVotingArrows post={comment} />
      </div>
    </div>
  );
};

export default CommentFeedItem;
