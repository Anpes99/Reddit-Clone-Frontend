import { useState } from "react";
import { Link } from "react-router";
import { makeStringSafeForURL } from "../../../../shared/utils/utils";

const sortOptions = [
  { label: "Top", sortBy: "upVotes", order: "DESC" },
  { label: "New", sortBy: "createdAt", order: "DESC" },
  { label: "Old", sortBy: "createdAt", order: "ASC" },
];

const PostPageCommentsSortingSection = ({ post }) => {
  const [sortVisible, setSortVisible] = useState(false);

  const postUrl = `/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
    makeStringSafeForURL(post?.title) || "noTitle"
  }`;

  return (
    <div className="w-[3rem]">
      <button
        className="h-10 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-md w-full"
        onClick={() => setSortVisible(!sortVisible)}
      >
        Sort
      </button>
      <div
        className={` ${
          sortVisible ? "inline-block" : "hidden"
        }  text-gray-500 bg-white font-medium  shadow-md absolute top-full w-full rounded-md flex flex-col z-[1]`}
      >
        {post.id &&
          sortOptions.map(({ label, sortBy, order }) => (
            <Link
              key={label}
              to={`${postUrl}?sortBy=${sortBy}&order=${order}`}
              onClick={() => setSortVisible(false)}
              className="hover:text-gray-800 hover:bg-blue-200 p-2"
            >
              {label}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default PostPageCommentsSortingSection;
