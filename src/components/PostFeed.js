import PostFeedItem from "./PostFeedItem";
import TopCommunities from "./TopCommunities";
import { FireIcon } from "@heroicons/react/solid";
import { SunIcon } from "@heroicons/react/outline";
import { TrendingUpIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import useGetPosts from "../hooks/useGetPosts";

const PostFeed = () => {
  const [reachedEnd, setReachedEnd] = useState(false);
  const [fetchMorePosts, loading, posts] = useGetPosts();

  const observer = useRef();
  const lastPostRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  });

  return (
    <div
      onScroll={() => {
        console.log("scroll");
      }}
      className="flex space-x-10 w-full"
    >
      <div>
        <div className="flex space-x-4 bg-white p-5 text-xs sm:text-sm">
          <button className="flex items-center font-semibold text-gray-400 sm:space-x-1 hover:bg-gray-100 px-2 py-1 rounded-3xl">
            <FireIcon className="h-4 sm:h-7" />
            <p className="hidden sm:inline">Hot</p>
          </button>
          <button className="flex items-center font-semibold text-gray-400 space-x-1 hover:bg-gray-100 px-2 py-1 rounded-3xl">
            <SunIcon className="h-4 sm:h-7" />
            <p className="hidden sm:inline">New</p>
          </button>
          <button className="flex items-center font-semibold text-gray-400 space-x-1 hover:bg-gray-100 px-2 py-1 rounded-3xl">
            <TrendingUpIcon className="h-4 sm:h-7" />
            <p className="hidden sm:inline">Top</p>
          </button>
          <button className="flex items-center font-semibold text-gray-400 space-x-1 hover:bg-gray-100 px-2 py-1 rounded-3xl">
            <p className="hidden sm:inline">Today</p>
            <ChevronDownIcon className="h-4 sm:h-7" />
          </button>
          <button className="flex items-center font-semibold text-gray-400 space-x-1 hover:bg-gray-100 px-2 py-1 rounded-3xl">
            <p>...</p>
          </button>
        </div>
        {posts.map((post, i) => {
          if (i + 1 === posts.length) {
            return (
              <div ref={lastPostRef}>
                <PostFeedItem post={post} key={i} />
              </div>
            );
          } else return <PostFeedItem post={post} key={i} />;
        })}
      </div>

      <div className="hidden lg:block">
        <TopCommunities />
      </div>
    </div>
  );
};

export default PostFeed;
