import axios from "axios";
import { setUser } from "../slices/appSlice";

export const handleJoinSubreddit = async (user, post, dispatch) => {
  console.log("post: ", post);
  try {
    const res = await axios.post(
      `/api/subreddits/${post.subredditId}/user`,
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
        subreddits: [...user.subreddits, post.subreddit],
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

export const handleLeaveSubreddit = async (user, subredditId, dispatch) => {
  console.log(user);
  try {
    const res = await axios.delete(`/api/subreddits/${subredditId}/user`, {
      headers: {
        Authorization: `bearer ${user.token}`,
      },
    });
    if (res.status === 204) {
      const updatedUser = {
        id: user.id,
        subreddits: user.subreddits.filter(
          (subreddit) => subreddit.id !== subredditId
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
