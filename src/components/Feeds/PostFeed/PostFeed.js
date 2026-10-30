import PostFeedItem from "./PostFeedItem";
import TopCommunities from "../../Subreddits/TopCommunities";
import { SunIcon } from "@heroicons/react/outline";
import { TrendingUpIcon } from "@heroicons/react/outline";
import { useCallback, useRef } from "react";
import useGetPosts from "../../../hooks/useGetPosts";
import { useDispatch, useSelector } from "react-redux";
import SubredditInfo from "../../../pages/SubredditPage/components/SubredditInfo";
import FeedItemSkeleton from "../FeedItemSkeleton";
import { setLoginVisible } from "../../../app/slices/appSlice";

const PostFeed = ({ subredditId, orderType }) => {
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);
  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();

  const [fetchMorePosts, loading, posts] = useGetPosts({
    queryParamSort: orderType,
    subredditId,
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

  const NoPostsYet = () =>
    currentSubreddit?.name ? (
      <div className="flex flex-col items-center space-y-2 py-40 px-5 bg-white ">
        <p className="text-2xl font-bold text-gray-700">
          This community doesnt have any posts yet
        </p>
        <p className="text-gray-500">Make one and get this feed started.</p>
        <button
          onClick={
            user
              ? () =>
                  (window.location.href = `/r/${currentSubreddit?.name}/submit`)
              : () => dispatch(setLoginVisible(true))
          }
          className="btn2 w-max"
        >
          Create post
        </button>
      </div>
    ) : (
      <div></div>
    );

  return (
    <div className="flex flex-col  w-full">
      <p className="py-4 font-medium text-gray-700 px-1">Popular posts</p>
      <div className="flex justify-center lg:justify-between w-full">
        <div className="pr-0 lg:pr-7 w-full">
          <div className="flex space-x-4 bg-white p-5 text-xs sm:text-sm mb-2 border border-gray-300 w-full">
            <button
              onClick={() => {
                if (orderType === "new") return;

                if (currentSubreddit?.name) {
                  window.location.href = `/r/${currentSubreddit.name}`;
                } else {
                  window.location.href = `/`;
                }
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

                if (currentSubreddit?.name) {
                  window.location.href = `/r/${currentSubreddit.name}/top`;
                } else {
                  window.location.href = `/top`;
                }
              }}
              className={`flex items-center font-semibold ${
                orderType === "top" ? "text-blue-500" : "text-gray-400"
              } space-x-1 hover:bg-gray-100 px-2 py-1 rounded-3xl`}
            >
              <TrendingUpIcon className="h-7" />
              <p className="inline">Top</p>
            </button>
          </div>
          {posts.length ? (
            posts.map((post, i) => {
              if (i + 1 === posts.length) {
                return (
                  <div key={post.id} ref={lastPostRef}>
                    <PostFeedItem post={post} />
                  </div>
                );
              } else return <PostFeedItem post={post} key={post.id} />;
            })
          ) : loading ? (
            Array(5)
              .fill(null)
              .map((_, i) => (
                <FeedItemSkeleton
                  key={"feed-item-skeleton" + i}
                  loading={true}
                />
              ))
          ) : (
            <NoPostsYet />
          )}
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

export default PostFeed;
