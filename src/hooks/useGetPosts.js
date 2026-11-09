import { useEffect, useRef, useState } from "react";
import socket from "../shared/lib/socket";

const useGetPosts = ({ queryParamSort, subredditId, username }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPostCount, setTotalPostCount] = useState(true);
  // Increased whenever the feed is reset (new sort/subreddit/user), so
  // "load more" responses for the previous feed can be dropped.
  const feedGenerationRef = useRef(0);
  let sortBy = "createdAt";
  let order = "DESC";
  let orderType;

  if (queryParamSort === "new") {
    order = "DESC";
    sortBy = "createdAt";
  }
  if (queryParamSort === "old") {
    order = "ASC";
    sortBy = "createdAt";
  }
  if (queryParamSort === "top") {
    orderType = "top";
  }

  //////////////////   GET INITIAL POSTS  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // ignore responses for a previous sort/subreddit
    //  instead of letting them overwrite the feed.
    let ignore = false;
    feedGenerationRef.current += 1;

    const runUseEffectFunction = async () => {
      setLoading(true);
      setPosts([]);

      if (
        orderType === null ||
        orderType === "new" ||
        orderType === undefined
      ) {
        socket.emit(
          "fetch_more_posts",
          {
            order,
            sortBy,
            offset: 0,
            limit: 5,
            subredditId,
            username,
          },
          (data) => {
            if (ignore) return;
            setPosts(data.posts);
            setTotalPostCount(data.totalCount);
            setLoading(false);
          },
        );
      }

      if (orderType === "top") {
        socket.emit(
          "fetch_top_posts",
          {
            offset: 0,
            subredditId,
            username,
          },
          (data) => {
            if (ignore) return;
            setPosts(data.posts);
            setTotalPostCount(data.totalCount);
            setLoading(false);
          },
        );
      }
    };
    runUseEffectFunction();
    return () => {
      ignore = true;
    };
  }, [subredditId, queryParamSort, username, order, sortBy, orderType]);

  //////////////////////////////////// GET MORE  POSTS ///////////////////////////////////////////////////
  const fetchMorePosts = async (orderType) => {
    if (totalPostCount > posts.length) {
      const generation = feedGenerationRef.current;
      const isStale = () => feedGenerationRef.current !== generation;

      if (
        orderType === null ||
        orderType === "new" ||
        orderType === undefined
      ) {
        setLoading(true);
        socket.emit(
          "fetch_more_posts",
          {
            order,
            sortBy,
            offset: posts.length,
            limit: 5,
            subredditId,
            username,
          },
          (data) => {
            if (isStale()) return;
            setPosts((curPosts) => [...curPosts, ...data.posts]);
            setTotalPostCount(data.totalCount);
            setLoading(false);
          },
        );
      }

      if (orderType === "top") {
        setLoading(true);

        socket.emit(
          "fetch_top_posts",
          {
            offset: posts.length,
            subredditId,
            username,
          },
          (data) => {
            if (isStale()) return;
            setPosts((curPosts) => [...curPosts, ...data.posts]);
            setTotalPostCount(data.totalCount);
            setLoading(false);
          },
        );
      }
    }
  };

  return [fetchMorePosts, loading, posts];
};

export default useGetPosts;
