import f1 from "../fake data/f1.png";
import moment from "moment";
import { useNavigate } from "react-router";
import PostVotingArrows from "./PostVotingArrows";
import { makeStringSafeForURL } from "../utils/utils";
import {
  BookmarkAdd,
  ChatBubbleRounded,
  MoreHoriz,
  Reply,
} from "@mui/icons-material";

const PostFeedItem = ({ post }) => {
  const date = new Date(post.createdAt);

  const navigate = useNavigate();

  const ActionsSection = () => {
    return (
      <div className="flex space-x-4 text-gray-450 font-bold pl-2 w-fit">
        <div className="flex  hover:bg-gray-300">
          <ChatBubbleRounded className=" mr-1" style={{ width: "20px" }} />
          <p>{post.commentCount}</p>
          <p className="hidden sm:inline-block ml-1">Comments</p>
        </div>
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
        <PostVotingArrows post={post} />
      </div>

      <div
        onClick={() => {
          navigate(
            `/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
              makeStringSafeForURL(post?.title) || "noTitle"
            }`,
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
        <PostVotingArrows post={post} /> <ActionsSection />
      </div>
    </div>
  );
};

export default PostFeedItem;
