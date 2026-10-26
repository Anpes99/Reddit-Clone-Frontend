import { setUser } from "../../app/slices/appSlice";
import Axios from "../lib/axios";

export const handleJoinSubreddit = async (user, subreddit, dispatch) => {
  try {
    const res = await Axios.post(`/api/subreddits/${subreddit.id}/user`);

    if (res.status === 200) {
      const updatedUser = {
        ...user,
        subreddits: [...user.subreddits, subreddit],
      };

      dispatch(setUser(updatedUser));
    }
  } catch (e) {
    console.log(e.response);
  }
};

export const handleLeaveSubreddit = async (user, subreddit, dispatch) => {
  try {
    const res = await Axios.delete(`/api/subreddits/${subreddit.id}/user`);
    if (res.status === 204) {
      const updatedUser = {
        ...user,
        subreddits: user.subreddits.filter(
          (userJoinedSubreddit) => userJoinedSubreddit.id !== subreddit.id,
        ),
      };

      dispatch(setUser(updatedUser));
    }
  } catch (e) {
    console.log(e);
  }
};
