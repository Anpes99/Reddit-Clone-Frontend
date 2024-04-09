import { useDispatch, useSelector } from "react-redux";
import { setLoginVisible } from "../../slices/appSlice";
import {
  handleJoinSubreddit,
  handleLeaveSubreddit,
} from "../../utils/subredditActions";

const JoinSubredditButton = ({ size, subreddit }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  if (!subreddit?.id || !subreddit?.name) {
    return <></>;
  }
  if (
    !user?.subreddits
      ?.map((s) => s.id)
      .filter((id) => !!id)
      .includes(subreddit?.id)
  )
    return (
      <button
        onClick={() => {
          if (user) {
            handleJoinSubreddit(user, subreddit, dispatch);
          } else {
            dispatch(setLoginVisible(true));
          }
        }}
        className={`${
          size === "big" ? "btn2" : "join-btn self-center w-[80px]"
        } `}
      >
        Join
      </button>
    );

  return (
    <button
      onClick={() => {
        if (user) {
          handleLeaveSubreddit(user, subreddit, dispatch);
        } else {
          dispatch(setLoginVisible(true));
        }
      }}
      className={`${
        size === "big" ? "btn2" : "join-btn self-center w-[80px]"
      } after:content-['Joined'] hover:after:content-['Leave'] bg-blue-500 hover:bg-blue-400`}
    ></button>
  );
};

export default JoinSubredditButton;
