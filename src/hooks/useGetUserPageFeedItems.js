import { useCallback, useEffect, useState } from "react";
import Axios from "../shared/lib/axios";

const emptyFeed = { key: null, items: [], totalCount: 0 };

const useGetUserPageFeedItems = ({ username, contentType, sortByType }) => {
  const queryKey = `${username}|${contentType}|${sortByType}`;
  const [feed, setFeed] = useState(emptyFeed);
  const [loadingMore, setLoadingMore] = useState(false);

  const isCurrent = feed.key === queryKey;
  const items = isCurrent ? feed.items : emptyFeed.items;
  const loading = !isCurrent || loadingMore;

  //////////////////   GET INITIAL ITEMS  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // Ignore responses from a previous username/tab/sort so a slow request
    // can't overwrite the feed the user has since switched to.
    let ignore = false;

    Axios.get(`api/users/${username}/feed`, {
      params: { offset: 0, contentType, sortByType, getTotalCount: true },
    })
      .then((result) => {
        if (ignore) return;
        setFeed({
          key: queryKey,
          items: result.data.feedItems,
          totalCount: result.data.totalCount,
        });
      })
      .catch(() => {
        if (!ignore) setFeed({ ...emptyFeed, key: queryKey });
      });

    return () => {
      ignore = true;
    };
  }, [queryKey, username, contentType, sortByType]);

  //////////////////////////////////// GET MORE  ITEMS ///////////////////////////////////////////////////
  const fetchMoreItems = useCallback(async () => {
    if (!isCurrent || loadingMore || feed.totalCount <= feed.items.length) {
      return;
    }
    setLoadingMore(true);
    try {
      const result = await Axios.get(`api/users/${username}/feed`, {
        params: { offset: feed.items.length, contentType, sortByType },
      });
      setFeed((current) =>
        current.key === queryKey
          ? { ...current, items: [...current.items, ...result.data.feedItems] }
          : current,
      );
    } finally {
      setLoadingMore(false);
    }
  }, [
    isCurrent,
    loadingMore,
    feed.totalCount,
    feed.items.length,
    username,
    contentType,
    sortByType,
    queryKey,
  ]);

  return [fetchMoreItems, loading, items];
};

export default useGetUserPageFeedItems;
