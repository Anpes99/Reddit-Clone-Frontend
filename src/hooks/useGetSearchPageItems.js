import { useCallback, useEffect, useState } from "react";
import Axios from "../shared/lib/axios";

const PAGE_SIZE = 20;
const emptyResults = {
  key: null,
  items: [],
  totalCount: 0,
  searchWordEmbedding: "",
};

const fetchSearchPage = async ({
  itemsType,
  searchQuery,
  orderType,
  offset,
  prevSearchWordEmbedding,
}) => {
  if (itemsType === "communities") {
    const result = await Axios.post(`/api/search/subreddits`, {
      searchQuery,
      offset,
      limit: PAGE_SIZE,
    });
    return {
      items: result.data.subreddits,
      totalCount: result.data.totalCount,
    };
  }

  const result = await Axios.post(`/api/search/posts`, {
    searchQuery,
    offset,
    limit: PAGE_SIZE,
    orderType,
    ...(orderType === "TOP" && offset > 0 ? { prevSearchWordEmbedding } : {}),
  });
  return {
    items: result.data.posts,
    totalCount: result.data.totalCount,
    searchWordEmbedding: result.data.searchWordEmbedding,
  };
};

const useGetSearchPageItems = ({ queryParamSort, itemsType, searchQuery }) => {
  const orderType = queryParamSort === "TOP" ? "TOP" : "NEW";

  const queryKey = `${itemsType}|${orderType}|${searchQuery}`;
  const [results, setResults] = useState(emptyResults);
  const [loadingMore, setLoadingMore] = useState(false);

  const isCurrent = results.key === queryKey;
  const items = isCurrent ? results.items : emptyResults.items;
  const loading = !isCurrent || loadingMore;

  //////////////////   GET INITIAL POSTS/SUBREDDITS  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    let ignore = false;

    fetchSearchPage({ itemsType, searchQuery, orderType, offset: 0 })
      .then((page) => {
        if (ignore) return;
        setResults({
          key: queryKey,
          items: page.items,
          totalCount: page.totalCount,
          searchWordEmbedding: page.searchWordEmbedding ?? "",
        });
      })
      .catch(() => {
        if (!ignore) setResults({ ...emptyResults, key: queryKey });
      });

    return () => {
      ignore = true;
    };
  }, [queryKey, itemsType, searchQuery, orderType]);

  //////////////////////////////////// GET MORE  POSTS ///////////////////////////////////////////////////
  const fetchMoreItems = useCallback(async () => {
    if (
      !isCurrent ||
      loadingMore ||
      results.totalCount <= results.items.length
    ) {
      return;
    }
    setLoadingMore(true);
    try {
      const page = await fetchSearchPage({
        itemsType,
        searchQuery,
        orderType,
        offset: results.items.length,
        prevSearchWordEmbedding: results.searchWordEmbedding,
      });
      setResults((current) =>
        current.key === queryKey
          ? {
              ...current,
              items: [...current.items, ...page.items],
              totalCount: page.totalCount,
            }
          : current,
      );
    } finally {
      setLoadingMore(false);
    }
  }, [
    isCurrent,
    loadingMore,
    results.totalCount,
    results.items.length,
    results.searchWordEmbedding,
    itemsType,
    searchQuery,
    orderType,
    queryKey,
  ]);

  return [fetchMoreItems, loading, items];
};

export default useGetSearchPageItems;
