import { addGlobalNotification, setUser } from "../../app/slices/appSlice";
import Axios from "../lib/axios";

export const handleJoinSubreddit = async (user, subreddit, dispatch) => {
  let res;
  try {
    res = await Axios.post(`/api/subreddits/${subreddit.id}/user`);
  } catch (e) {
    if (e.response?.status !== 429) {
      dispatch(
        addGlobalNotification({
          type: "error",
          message: "Couldn't join the community. Please try again.",
        }),
      );
    }
    return;
  }
  if (res.status === 200) {
    const updatedUser = {
      ...user,
      subreddits: [...user.subreddits, subreddit],
    };

    dispatch(setUser(updatedUser));
  }
};

export const handleLeaveSubreddit = async (user, subreddit, dispatch) => {
  let res;
  try {
    res = await Axios.delete(`/api/subreddits/${subreddit.id}/user`);
  } catch (e) {
    if (e.response?.status !== 429) {
      dispatch(
        addGlobalNotification({
          type: "error",
          message: "Couldn't leave the community. Please try again.",
        }),
      );
    }
    return;
  }
  if (res.status === 204) {
    const updatedUser = {
      ...user,
      subreddits: user.subreddits.filter(
        (userJoinedSubreddit) => userJoinedSubreddit.id !== subreddit.id,
      ),
    };

    dispatch(setUser(updatedUser));
  }
};
