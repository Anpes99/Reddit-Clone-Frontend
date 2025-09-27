import PostFeedItem from "./PostFeedItem";
import TopCommunities from "./TopCommunities";
import { SunIcon } from "@heroicons/react/outline";
import { TrendingUpIcon } from "@heroicons/react/outline";
import { useCallback, useRef, useState } from "react";
import useGetPosts from "../hooks/useGetPosts";
import { useSelector } from "react-redux";
import SubredditInfo from "./SubredditInfo";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";

const UserPagePostFeed = ({ subredditId }) => {
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);
  const username = useParams().username;
  const [searchParams] = useSearchParams();
  const orderType = searchParams.get("sort") || "new";
  const [fetchMorePosts, loading, posts] = useGetPosts({
    queryParamSort: orderType,
    subredditId,
    username,
  });

  const observer = useRef();
  const lastPostRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMorePosts(orderType);
      }
    });
    if (node) observer.current.observe(node);
  });

  return (
    <div className="flex flex-col  w-full">
      <p className="py-8 font-medium text-gray-700 px-1"></p>
      <div className="flex justify-center lg:justify-between w-full">
        <div className="pr-0 lg:pr-7 w-full">
          <div className="flex space-x-4 bg-white p-5 text-xs sm:text-sm mb-2 border border-gray-300 w-full">
            <button
              onClick={() => {
                if (orderType === "new") return;

                window.location.href = `/user/${username}/?sort=new`;
              }}
              className={`flex items-center font-semibold ${
                orderType === "new" ? "text-blue-500" : "text-gray-400"
              } space-x-1 hover:bg-gray-100 px-2 py-1 rounded-3xl`}
            >
              <SunIcon className="h-7" />
              <p className="inline">New</p>
            </button>
            <button
              onClick={() => {
                if (orderType === "top") return;
                window.location.href = `/user/${username}/?sort=top`;
              }}
              className={`flex items-center font-semibold ${
                orderType === "top" ? "text-blue-500" : "text-gray-400"
              } space-x-1 hover:bg-gray-100 px-2 py-1 rounded-3xl`}
            >
              <TrendingUpIcon className="h-7" />
              <p className="inline">Top</p>
            </button>
          </div>
          {posts.map((post, i) => {
            if (i + 1 === posts.length) {
              return (
                <div key={post.id} ref={lastPostRef}>
                  <PostFeedItem post={post} />
                </div>
              );
            } else return <PostFeedItem post={post} key={post.id} />;
          })}
        </div>
        <div className="hidden lg:block">
          {currentSubreddit?.id && (
            <SubredditInfo style={{ marginBottom: "20px" }} />
          )}
          <TopCommunities />
        </div>
      </div>
    </div>
  );
};

export default UserPagePostFeed;
