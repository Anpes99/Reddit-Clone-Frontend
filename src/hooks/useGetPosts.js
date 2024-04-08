import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../websockets/posts";

const useGetPosts = (queryParamSort, subredditId, orderType) => {
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

    if (orderType === null || orderType === "new" || orderType === undefined) {
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
    }

    if (orderType === "top") {
      socket.emit(
        "fetch_top_posts",
        0, // offset
        subredditId,
        (data) => {
          console.log("socket data ", data);
          setPosts(data.posts);
          setTotalPostCount(data.totalCount);
          setLoading(false);
        }
      );
    }

    /*console.log(result.data.totalCount);
    setTotalPostCount(result.data.totalCount);
    console.log(result);
    
    setPosts(result.data.posts);*/
  }, [subredditId]);

  //////////////////////////////////// GET MORE  POSTS ///////////////////////////////////////////////////
  const fetchMorePosts = async (orderType) => {
    console.log(totalPostCount, posts.length);
    if (totalPostCount > posts.length) {
      if (
        orderType === null ||
        orderType === "new" ||
        orderType === undefined
      ) {
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
      }

      if (orderType === "top") {
        setLoading(true);

        socket.emit(
          "fetch_top_posts",
          posts.length, // offset
          subredditId,
          (data) => {
            console.log("socket data ", data);
            setPosts([...posts, ...data.posts]);
            setTotalPostCount(data.totalCount);
            setLoading(false);
          }
        );
      }

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
