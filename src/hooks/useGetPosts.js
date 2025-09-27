import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../websockets/posts";

const useGetPosts = ({ queryParamSort, subredditId, username }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPostCount, setTotalPostCount] = useState(true);
  const [error, setError] = useState(false);
  let sortBy = "createdAt";
  let order = "DESC";
  let sort;
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
  useEffect(async () => {
    setLoading(true);

    if (orderType === null || orderType === "new" || orderType === undefined) {
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
          setPosts(data.posts);
          setTotalPostCount(data.totalCount);
          setLoading(false);
        }
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
          setPosts(data.posts);
          setTotalPostCount(data.totalCount);
          setLoading(false);
        }
      );
    }
  }, [subredditId]);

  //////////////////////////////////// GET MORE  POSTS ///////////////////////////////////////////////////
  const fetchMorePosts = async (orderType) => {
    if (totalPostCount > posts.length) {
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
          {
            offset: posts.length,
            subredditId,
            username,
          },
          (data) => {
            setPosts([...posts, ...data.posts]);
            setTotalPostCount(data.totalCount);
            setLoading(false);
          }
        );
      }
    }
  };

  return [fetchMorePosts, loading, posts, error];
};

export default useGetPosts;
