import { useState } from "react";

const PostPageCommentsSortingSection = ({ post }) => {
  const [sortVisible, setSortVisible] = useState(false);

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
        }  text-gray-500 bg-white font-medium  shadow-md absolute top-full w-full rounded-md flex flex-col`}
      >
        <a
          href={
            post.id
              ? `/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
                  post?.title?.replaceAll(" ", "_") || "noTitle"
                }?sortBy=upVotes&order=DESC`
              : null
          }
          className="hover:text-gray-800 hover:bg-blue-200 p-2"
        >
          Top
        </a>
        <a
          href={
            post.id
              ? `/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
                  post?.title?.replaceAll(" ", "_") || "noTitle"
                }?sortBy=createdAt&order=DESC`
              : null
          }
          className="hover:text-gray-800 hover:bg-blue-200 p-2"
        >
          New
        </a>
        <a
          href={
            post.id
              ? `/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
                  post?.title?.replaceAll(" ", "_") || "noTitle"
                }?sortBy=createdAt&order=ASC`
              : null
          }
          className="hover:text-gray-800 hover:bg-blue-200 p-2"
        >
          Old
        </a>
      </div>
    </div>
  );
};

export default PostPageCommentsSortingSection;
