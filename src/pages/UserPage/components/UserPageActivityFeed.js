import PostFeedItem from "../../../components/Feeds/PostFeed/PostFeedItem";
import { SunIcon } from "@heroicons/react/outline";
import { TrendingUpIcon } from "@heroicons/react/outline";
import { memo, useCallback, useRef } from "react";

import { useParams, useSearchParams } from "react-router";
import useGetUserPageFeedItems from "../../../hooks/useGetUserPageFeedItems";
import CommentFeedItem from "./CommentFeed/CommentFeedItem";
import FeedItemSkeleton from "../../../components/Feeds/FeedItemSkeleton";

const NoPostsYet = ({ username }) => (
  <div className="flex flex-col items-center py-40 md:min-w-[500px] ">
    <p className="text-xl font-bold text-gray-700">
      {username} hasn't posted yet
    </p>
  </div>
);

const UserPageActivityFeed = ({ subredditId, contentType }) => {
  const username = useParams().username;
  const [searchParams, setSearchParams] = useSearchParams();
  const orderType = searchParams.get("sort") || "new";
  const [fetchMorePosts, loading, feedItems] = useGetUserPageFeedItems({
    sortByType: orderType,
    subredditId,
    username,
    contentType,
  });

  const observerRef = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMorePosts(orderType);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, fetchMorePosts, orderType],
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
              <div key={item.type + item.data.id} ref={lastPostRef}>
                {item.type === "comment" ? (
                  <CommentFeedItem comment={item.data} />
                ) : (
                  <PostFeedItem post={item.data} />
                )}
              </div>
            );
          } else {
            return item.type === "comment" ? (
              <CommentFeedItem
                key={"comment-" + item.data.id}
                comment={item.data}
              />
            ) : (
              <PostFeedItem key={"post-" + item.data.id} post={item.data} />
            );
          }
        })
      ) : loading ? (
        Array(5)
          .fill(null)
          .map((_, i) => (
            <FeedItemSkeleton
              // eslint-disable-next-line @eslint-react/no-array-index-key -- static placeholders
              key={"feed-item-skeleton" + i}
              loading={true}
            />
          ))
      ) : (
        <NoPostsYet username={username} />
      )}
    </div>
  );
};

export default memo(UserPageActivityFeed);
