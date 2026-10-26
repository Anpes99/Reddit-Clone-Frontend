import moment from "moment";
import { useNavigate } from "react-router";
import PostVotingArrows from "../../../../components/Feeds/PostFeed/PostVotingArrows";
import { makeStringSafeForURL } from "../../../../shared/utils/utils";
import { BookmarkAdd, MoreHoriz, Reply } from "@mui/icons-material";
import DefaultSubredditIcon from "../../../../assets/icons/DefaultSubredditIcon";
import CommentVotingArrows from "./CommentVotingArrows";

const CommentFeedItem = ({ comment }) => {
  const date = new Date(comment.createdAt);

  const navigate = useNavigate();

  const ActionsSection = () => {
    return (
      <div className="flex space-x-4 text-gray-450 font-bold pl-2 w-fit">
        <div className="flex  hover:bg-gray-300">
          <Reply className="scale-x-[-1]" />
          <p className="hidden sm:inline-block">Share</p>
        </div>
        <div className="flex hover:bg-gray-300">
          <BookmarkAdd className="mr-1" />
          <p className="hidden sm:inline-block">Save</p>
        </div>
        <div className="flex items-center hover:bg-gray-300">
          <MoreHoriz />
        </div>
      </div>
    );
  };
  return (
    <div className=" flex flex-col sm:flex-row w-full    sm:h-min-content bg-white border mb-3  border-gray-300 p-0.5">
      <div className=" hidden sm:flex flex-col items-center bg-gray-50 w-20 p-1.5">
        <CommentVotingArrows comment={comment} />
      </div>
      <div
        onClick={() => {
          console.log(comment);
          console.log(
            `/r/${comment?.subreddit?.name || "noName"}/comments/${comment.post.id}/${
              makeStringSafeForURL(comment?.post?.title) || "noTitle"
            }`,
          );
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
            <div className="inline-block rounded-full overflow-hidden h-7 w-7">
              {comment?.subreddit?.iconUrl ? (
                <img src={comment?.subreddit?.iconUrl} alt="subreddit img" />
              ) : (
                <DefaultSubredditIcon />
              )}
            </div>
            <p className="inline mr-2 font-bold text-sm">
              r/{comment?.subreddit?.name || "noName"}
            </p>
          </div>
          <div className="mt-2  text-xs line-clamp-5">
            {comment.post?.title}
          </div>
          <div className="flex space-x-1 items-center mb-3 mt-2 text-xs">
            <p className="font-bold ">{comment.user?.username}</p>
            {comment.parentComment ? (
              <>
                <p className="text-gray-500">answered to comment by</p>
                <p className="font-bold ">
                  {comment.parentComment?.user?.username}{" "}
                </p>
              </>
            ) : (
              <p className="text-gray-500">commented</p>
            )}
            <p className="text-gray-500"> {moment(date.getTime()).fromNow()}</p>
          </div>
          {comment.text}
        </div>

        <div
          onClick={(e) => {
            // e.stopPropagation();
          }}
          className=" hidden sm:block  pt-2  pb-1  w-fit pr-2"
        >
          <ActionsSection />
        </div>
      </div>

      <div className="flex sm:hidden p-2 items-center">
        <PostVotingArrows post={comment} /> <ActionsSection />
      </div>
    </div>
  );
};

export default CommentFeedItem;
