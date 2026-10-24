import { useEffect, useState } from "react";
import Axios from "../utils/axios";

const useGetSearchPageItems = ({
  queryParamSort,
  subredditId,
  itemsType,
  searchQuery,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItemsCount, setTotalItemsCount] = useState(true);
  const [error, setError] = useState(false);
  const [searchWordEmbedding, setSearchWordEmbedding] = useState("");

  let orderType;

  if (queryParamSort === "NEW") {
    orderType = "NEW";
  }

  if (queryParamSort === "TOP") {
    orderType = "TOP";
  }

  //////////////////   GET INITIAL POSTS/SUBREDDITS  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const runUseEffectFunction = async () => {
      if (loading) return;

      if (itemsType === "posts") {
        if (
          orderType === null ||
          orderType === "NEW" ||
          orderType === undefined
        ) {
          setLoading(true);

          const result = await Axios.post(`/api/search/posts`, {
            searchQuery,
            offset: 0,
            limit: 20,

            orderType,
          });
          setItems(result.data.posts);
          setTotalItemsCount(result.data.totalCount);
          setLoading(false);
        } else if (orderType === "TOP") {
          setLoading(true);

          const result = await Axios.post(`/api/search/posts`, {
            searchQuery,
            offset: 0,
            limit: 20,
            orderType,
          });
          setSearchWordEmbedding(result.data.searchWordEmbedding);
          setLoading(false);
          setItems(result.data.posts);
          setTotalItemsCount(result.data.totalCount);
          setLoading(false);
        }
      } else if (itemsType === "communities") {
        setLoading(true);

        const result = await Axios.post(`/api/search/subreddits`, {
          searchQuery,
          offset: 0,
          limit: 20,
        });
        setItems(result.data.subreddits);
        setTotalItemsCount(result.data.totalCount);
        setLoading(false);
      }
    };
    runUseEffectFunction();
  }, [subredditId]);

  //////////////////////////////////// GET MORE  POSTS ///////////////////////////////////////////////////
  const fetchMoreItems = async (orderType) => {
    if (loading) return;

    if (totalItemsCount > items.length) {
      if (itemsType === "posts") {
        if (
          orderType === null ||
          orderType === "NEW" ||
          orderType === undefined
        ) {
          setLoading(true);
          const result = await Axios.post(`/api/search/posts`, {
            searchQuery,
            offset: items.length,
            limit: 20,

            orderType,
          });
          setItems([...items, ...result.data.posts]);
          setTotalItemsCount(result.data.totalCount);
          setLoading(false);
        } else if (orderType === "TOP") {
          setLoading(true);

          const result = await Axios.post(`/api/search/posts`, {
            searchQuery,
            offset: items.length,
            limit: 20,
            orderType,
            prevSearchWordEmbedding: searchWordEmbedding,
          });
          setLoading(false);
          setItems([...items, ...result.data.posts]);

          setTotalItemsCount(result.data.totalCount);
          setLoading(false);
        }
      } else if (itemsType === "communities") {
        setLoading(true);

        const result = await Axios.post(`/api/search/subreddits`, {
          searchQuery,
          offset: items.length,
          limit: 20,
        });
        setItems([...items, ...result.data.subreddits]);
        setTotalItemsCount(result.data.totalCount);
        setLoading(false);
      }
    }
  };

  return [fetchMoreItems, loading, items, error];
};

export default useGetSearchPageItems;
