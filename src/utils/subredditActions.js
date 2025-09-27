import axios from "axios";
import { setUser } from "../slices/appSlice";

export const handleJoinSubreddit = async (user, subreddit, dispatch) => {
  try {
    const res = await axios.post(
      `/api/subreddits/${subreddit.id}/user`,
      {},
      {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      }
    );

    if (res.status === 200) {
      const updatedUser = {
        ...user,
        subreddits: [...user.subreddits, subreddit],
      };

      dispatch(setUser(updatedUser));
      localStorage.setItem(
        "loggedInRedditAppUser",
        JSON.stringify(updatedUser)
      );
    }
  } catch (e) {
    console.log(e.response);
  }
};

export const handleLeaveSubreddit = async (user, subreddit, dispatch) => {
  try {
    const res = await axios.delete(`/api/subreddits/${subreddit.id}/user`, {
      headers: {
        Authorization: `bearer ${user.token}`,
      },
    });
    if (res.status === 204) {
      const updatedUser = {
        ...user,
        subreddits: user.subreddits.filter(
          (userJoinedSubreddit) => userJoinedSubreddit.id !== subreddit.id
        ),
      };
      localStorage.setItem(
        "loggedInRedditAppUser",
        JSON.stringify(updatedUser)
      );
      dispatch(setUser(updatedUser));
    }
  } catch (e) {
    console.log(e);
  }
};
