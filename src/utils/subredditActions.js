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
        id: user.id,
        subreddits: [...user.subreddits, subreddit],
        token: user.token,
        username: user.username,
      };

      dispatch(setUser(updatedUser));
      localStorage.setItem(
        "loggedInRedditAppUser",
        JSON.stringify(updatedUser)
      );
    }

    console.log("joined subreddit");
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
        id: user.id,
        subreddits: user.subreddits.filter(
          (userJoinedSubreddit) => userJoinedSubreddit.id !== subreddit.id
        ),
        token: user.token,
        username: user.username,
      };
      localStorage.setItem(
        "loggedInRedditAppUser",
        JSON.stringify(updatedUser)
      );
      dispatch(setUser(updatedUser));
    }
    console.log(res, "left subreddit");
  } catch (e) {
    console.log(e);
  }
};
