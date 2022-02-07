import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../websockets/posts";

const useGetPosts = (queryParamSort, subredditId) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPostCount, setTotalPostCount] = useState(true);
  const [error, setError] = useState(false);
  let sortBy = "createdAt";
  let order = "DESC";
  let sort;

  if (queryParamSort === "new") {
    order = "DESC";
    sortBy = "createdAt";
  }
  if (queryParamSort === "old") {
    order = "ASC";
    sortBy = "createdAt";
  }

  //////////////////   GET INITIAL POSTS  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(async () => {
    setLoading(true);
    /*const result = await axios.get(
      `/api/posts?limit=5&sortBy=${sortBy}&order=${order}`
    );*/ //  order, sortby, offset, limit, cb

    socket.emit(
      "fetch_more_posts",
      order,
      sortBy,
      0,
      5,
      subredditId,
      (data) => {
        console.log("socket data ", data);
        setPosts(data.posts);
        setTotalPostCount(data.totalCount);
        setLoading(false);
      }
    );

    /*console.log(result.data.totalCount);
    setTotalPostCount(result.data.totalCount);
    console.log(result);
    
    setPosts(result.data.posts);*/
  }, []);

  //////////////////////////////////// GET MORE  POSTS ///////////////////////////////////////////////////
  const fetchMorePosts = async () => {
    console.log(totalPostCount, posts.length);
    if (totalPostCount > posts.length) {
      setLoading(true);
      socket.emit(
        "fetch_more_posts",
        order,
        sortBy,
        posts.length,
        5, //limit
        subredditId,
        (data) => {
          console.log("socket data ", data);
          setPosts([...posts, ...data.posts]);
          setTotalPostCount(data.totalCount);
          setLoading(false);
        }
      );

      /*
      const result = await axios
        .get(`/api/posts?offset=${posts.length}&limit=5`)
        .catch((e) => {
          setError(e);
        });
      console.log(posts);
      setLoading(false);
      setPosts([...posts, ...result.data.posts]);*/
    }
  };

  return [fetchMorePosts, loading, posts, error];
};

export default useGetPosts;
