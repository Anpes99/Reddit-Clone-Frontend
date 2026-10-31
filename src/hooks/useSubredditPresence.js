import { useEffect, useState } from "react";
const useSubredditPresence = (socket, subredditName) => {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (!socket || !subredditName) return;

    const handleCount = (count) => {
      setOnlineCount(count);
    };

    const joinSubreddit = () => {
      socket.emit("subreddit:view", { subredditName });
    };

    const sendPresenceRefresh = () => {
      if (socket.connected) {
        socket.emit("presence:refresh");
      }
    };

    socket.on("subreddit:online-count", handleCount);
    socket.on("connect", joinSubreddit);

    if (socket.connected) {
      joinSubreddit();
    }

    const presenceRefreshInterval = setInterval(sendPresenceRefresh, 20_000);

    return () => {
      clearInterval(presenceRefreshInterval);
      socket.off("subreddit:online-count", handleCount);
      socket.off("connect", joinSubreddit);
    };
  }, [socket, subredditName]);

  return onlineCount;
};
export default useSubredditPresence;
