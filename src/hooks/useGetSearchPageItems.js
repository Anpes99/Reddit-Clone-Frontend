import axios from "axios";
import { useEffect, useState } from "react";

const useGetSearchPageItems = ({
  queryParamSort,
  subredditId,
  itemsType,
  searchQuery,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItemsCount, setTotalItemsCount] = useState(true);
  const [error, setError] = useState(false);
  let sortBy = "createdAt";
  let order = "DESC";
  let sort;
  let orderType;

  if (queryParamSort === "new") {
    order = "DESC";
    sortBy = "createdAt";
  }

  if (queryParamSort === "top") {
    orderType = "top";
  }

  //////////////////   GET INITIAL POSTS/SUBREDDITS  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(async () => {
    setLoading(true);
    if (itemsType === "posts") {
      if (
        orderType === null ||
        orderType === "new" ||
        orderType === undefined
      ) {
        setLoading(true);

        const result = await axios.post(`/api/search/posts`, {
          searchQuery,
          offset: 0,
          limit: 5,
          order,
          sortBy,
          orderType,
        });
        setItems(result.data.posts);
        setTotalItemsCount(result.data.totalCount);
        setLoading(false);
      } else if (orderType === "top") {
        setLoading(true);

        const result = await axios.post(`/api/search/posts`, {
          searchQuery,
          offset: 0,
          limit: 5,
          orderType,
        });
        setLoading(false);
        setItems(result.data.posts);
        setTotalItemsCount(result.data.totalCount);
        setLoading(false);
      }
    } else if (itemsType === "communities") {
      setLoading(true);

      const result = await axios.post(`/api/search/subreddits`, {
        searchQuery,
        offset: 0,
        limit: 10,
      });
      setItems(result.data.subreddits);
      setTotalItemsCount(result.data.totalCount);
      setLoading(false);
    }
  }, [subredditId]);

  //////////////////////////////////// GET MORE  POSTS ///////////////////////////////////////////////////
  const fetchMoreItems = async (orderType) => {
    if (totalItemsCount > items.length) {
      if (itemsType === "posts") {
        if (
          orderType === null ||
          orderType === "new" ||
          orderType === undefined
        ) {
          setLoading(true);
          const result = await axios.post(`/api/search/posts`, {
            searchQuery,
            offset: items.length,
            limit: 5,
            order,
            sortBy,
            orderType,
          });
          setItems([...items, ...result.data.posts]);
          setTotalItemsCount(result.data.totalCount);
          setLoading(false);
        } else if (orderType === "top") {
          setLoading(true);

          const result = await axios.post(`/api/search/posts`, {
            searchQuery,
            offset: items.length,
            limit: 5,
            orderType,
          });
          setLoading(false);
          setItems([...items, ...result.data.posts]);

          setTotalItemsCount(result.data.totalCount);
          setLoading(false);
        }
      } else if (itemsType === "communities") {
        setLoading(true);

        const result = await axios.post(`/api/search/subreddits`, {
          searchQuery,
          offset: items.length,
          limit: 5,
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
