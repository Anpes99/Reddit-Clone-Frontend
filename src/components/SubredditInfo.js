import {
  setLoginVisible,
  setCurrentSubreddit,
  setUser,
} from "../slices/appSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  handleJoinSubreddit,
  handleLeaveSubreddit,
} from "../utils/subredditActions";
import f1 from "../fake data/f1.png";
import { useParams } from "react-router";
import { useEffect } from "react";
import axios from "axios";

const SubredditInfo = ({ post }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);

  const subredditName = useParams().subredditName;

  useEffect(async () => {
    const res = await axios.get("/api/subreddits?name=" + subredditName);
    dispatch(setCurrentSubreddit(res.data[0]));
  }, [subredditName]);

  return (
    <div className="p-2 flex flex-col space-y-3">
      <div
        onClick={() => (window.location.href = `/r/${currentSubreddit?.name}`)}
        className=" font-bold flex space-x-5 items-center self-start cursor-pointer"
      >
        <div className="rounded-full overflow-hidden h-[3rem] w-[3rem]">
          <img src={f1} />
        </div>
        <p className="text-lg font-semibold">r/{currentSubreddit?.name}</p>{" "}
      </div>
      <p className="max-w-xs text-base">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
      <div className="flex space-x-20 border-b pb-5">
        <div className="">
          <p className="font-bold">100k</p>
          <p className="font-medium text-xs text-gray-800">Members</p>
        </div>
        <div className="">
          <p className="font-bold">2k</p>
          <p className="font-medium text-xs text-gray-800">Online</p>
        </div>
      </div>
      <div className="text-base font-normal">created aug 27 2008</div>
      {!user?.subreddits?.map((s) => s.id).includes(currentSubreddit?.Id) && (
        <button
          onClick={() => {
            if (user) {
              handleJoinSubreddit(user, post, dispatch);
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className="btn2"
        >
          Join
        </button>
      )}
      {user?.subreddits?.map((s) => s.id).includes(currentSubreddit?.Id) && (
        <button
          onClick={() => {
            if (user) {
              handleLeaveSubreddit(user, currentSubreddit?.Id, dispatch);
            } else {
              dispatch(setLoginVisible(true));
            }
          }}
          className={`btn2 after:content-['Joined'] hover:after:content-['Leave'] bg-blue-500 hover:bg-blue-400`}
        ></button>
      )}
    </div>
  );
};

export default SubredditInfo;
