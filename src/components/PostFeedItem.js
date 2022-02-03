import img from "../fake data/markus-spiske-2siq7rVFeZs-unsplash.jpg";
import { ArrowSmUpIcon } from "@heroicons/react/outline";
import { ArrowSmDownIcon } from "@heroicons/react/outline";
import skyrim from "../fake data/skyrim.png";
import moment from "moment";
import { useNavigate } from "react-router";

const PostFeedItem = ({ post }) => {
  console.log(post.createdAt);
  const date = new Date(post.createdAt);
  console.log(post);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/r/${post.subreddit.name}/comments/${post.id}/${post.title}`);
      }}
      className="cursor-pointer flex flex-col sm:flex-row w-full  sm:h-96 bg-white border mb-4"
    >
      <div className=" hidden sm:flex flex-col items-center bg-gray-100 w-20">
        <ArrowSmUpIcon className="h-7 text-gray-400 hover:text-red-500" />
        <p className=" px-1 font-bold text-sm">
          {post.upVotes - post.downVotes}
        </p>
        <ArrowSmDownIcon className="h-7 text-gray-400 hover:text-blue-500" />
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
          <img src={img} />
        </div>
      </div>
      <div className="flex sm:hidden p-2 items-center">
        <ArrowSmUpIcon className="text-gray-400 h-7 hover:text-red-500" />
        <p className=" px-1 font-bold text-sm">
          {post.upVotes - post.downVotes}
        </p>
        <ArrowSmDownIcon className="h-7 text-gray-400 hover:text-blue-500" />
      </div>
    </div>
  );
};

export default PostFeedItem;
