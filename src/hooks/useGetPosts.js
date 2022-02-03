import axios from "axios";
import { useEffect, useState } from "react";

const useGetPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPostCount, setTotalPostCount] = useState(true);
  const [error, setError] = useState(false);

  useEffect(async () => {
    setLoading(true);
    const result = await axios.get(`/api/posts?limit=5`);
    console.log(result.data.totalCount);
    setTotalPostCount(result.data.totalCount);
    console.log(result);
    setLoading(false);
    setPosts(result.data.posts);
  }, []);

  const fetchMorePosts = async () => {
    console.log(totalPostCount, posts.length);
    if (totalPostCount > posts.length) {
      setLoading(true);
      const result = await axios
        .get(`/api/posts?offset=${posts.length}&limit=5`)
        .catch((e) => {
          setError(e);
        });
      console.log(posts);
      setLoading(false);
      setPosts([...posts, ...result.data.posts]);
    }
  };

  return [fetchMorePosts, loading, posts, error];
};

export default useGetPosts;
