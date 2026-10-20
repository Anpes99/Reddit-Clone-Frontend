import { useEffect, useState } from "react";
import Axios from "../utils/axios";

const useGetUserPageFeedItems = ({ username, contentType, sortByType }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [error, setError] = useState(false);
  let sortBy = "createdAt";
  let order = "DESC";

  //////////////////   GET INITIAL ITEMS  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const runUseEffectFunction = async () => {
      setLoading(true);

      Axios.get(`api/users/${username}/feed`, {
        params: { offset: 0, contentType, sortByType, getTotalCount: true },
      }).then((result) => {
        setItems(result.data.feedItems);
        setTotalItemsCount(result.data.totalCount);
        setLoading(false);
      });
    };

    runUseEffectFunction();
  }, []);

  //////////////////////////////////// GET MORE  ITEMS ///////////////////////////////////////////////////
  const fetchMoreItems = async () => {
    if (totalItemsCount > items.length) {
      setLoading(true);
      Axios.get(`api/users/${username}/feed`, {
        params: { offset: items.length, contentType, sortByType },
      }).then((result) => {
        setItems((posts) => [...posts, ...result.data.feedItems]);
        setLoading(false);
      });
    }
  };

  return [fetchMoreItems, loading, items, error];
};

export default useGetUserPageFeedItems;
