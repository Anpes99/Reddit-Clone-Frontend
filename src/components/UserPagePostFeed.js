import PostFeedItem from "./PostFeedItem";
import { SunIcon } from "@heroicons/react/outline";
import { TrendingUpIcon } from "@heroicons/react/outline";
import { useCallback, useRef } from "react";

import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import useGetUserPageFeedItems from "../hooks/useGetUserPageFeedItems";
import CommentFeedItem from "./CommentFeedItem";
import FeedItemSkeleton from "./FeedItemSkeleton";

const UserPagePostFeed = ({ subredditId, contentType }) => {
  const username = useParams().username;
  const [searchParams, setSearchParams] = useSearchParams();
  const orderType = searchParams.get("sort") || "new";
  const [fetchMorePosts, loading, feedItems] = useGetUserPageFeedItems({
    sortByType: orderType,
    subredditId,
    username,
    contentType,
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

  const NoPostsYet = () => (
    <div className="flex flex-col items-center py-40 md:min-w-[500px] ">
      <p className="text-xl font-bold text-gray-700">
        {username} hasn't posted yet
      </p>
    </div>
  );

  return (
    <div className="pr-0 lg:pr-7 w-full">
      {contentType !== "overview" && (
        <div className="flex space-x-4 bg-white p-5 text-xs sm:text-sm mb-2 border border-gray-300 w-full">
          <button
            onClick={() => {
              if (orderType === "new") return;
              setSearchParams({ contentType, sort: "new" });
              window.location.reload();
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
              setSearchParams({ contentType, sort: "top" });
              window.location.reload();
            }}
            className={`flex items-center font-semibold ${
              orderType === "top" ? "text-blue-500" : "text-gray-400"
            } space-x-1 hover:bg-gray-100 px-2 py-1 rounded-3xl`}
          >
            <TrendingUpIcon className="h-7" />
            <p className="inline">Top</p>
          </button>
        </div>
      )}
      {feedItems?.length ? (
        feedItems.map((item, i) => {
          if (i + 1 === feedItems.length) {
            return (
              <div key={item.id} ref={lastPostRef}>
                {item.type === "comment" ? (
                  <CommentFeedItem
                    key={"userFeedItem" + i}
                    comment={item.data}
                  />
                ) : (
                  <PostFeedItem key={"userFeedItem" + i} post={item.data} />
                )}
              </div>
            );
          } else
            return (
              <>
                {item.type === "comment" ? (
                  <CommentFeedItem
                    key={"userFeedItem" + i}
                    comment={item.data}
                  />
                ) : (
                  <PostFeedItem key={"userFeedItem" + i} post={item.data} />
                )}
              </>
            );
        })
      ) : loading ? (
        Array(5)
          .fill(null)
          .map((_) => <FeedItemSkeleton loading={true} />)
      ) : (
        <NoPostsYet />
      )}
    </div>
  );
};

export default UserPagePostFeed;
