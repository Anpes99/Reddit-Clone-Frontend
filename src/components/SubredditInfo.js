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
import JoinSubredditButton from "./JoinSubredditButton";

const SubredditInfo = ({ style = {} }) => {
  const dispatch = useDispatch();
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);

  const subredditName = useParams().subredditName;
  useEffect(async () => {
    const res = await axios.get("/api/subreddits?name=" + subredditName);
    dispatch(setCurrentSubreddit(res.data[0]));
  }, [subredditName]);
  if (!currentSubreddit) return <></>;
  return (
    <div
      className="flex flex-col border rounded-sm pt-5 text-gray-800 border border-gray-300 bg-white"
      style={style}
    >
      <div className="p-2 flex flex-col space-y-3 ">
        <div
          onClick={() =>
            (window.location.href = `/r/${currentSubreddit?.name}`)
          }
          className=" font-bold flex space-x-5 items-center self-start cursor-pointer"
        >
          <div className="rounded-full overflow-hidden h-[3rem] w-[3rem]">
            <img src={f1} />
          </div>
          <p className="text-lg font-semibold">r/{currentSubreddit?.name}</p>{" "}
        </div>
        <p className="max-w-xs text-base">{currentSubreddit.text}</p>
        <div className="flex space-x-20 border-b pb-5">
          <div className="">
            <p className="font-bold">{currentSubreddit.memberCount || 0}</p>
            <p className="font-medium text-xs text-gray-800">Members</p>
          </div>
          <div className="">
            <p className="font-bold">0</p>
            <p className="font-medium text-xs text-gray-800">Online</p>
          </div>
        </div>
        <div className="text-base font-normal">created aug 27 2008</div>
        <JoinSubredditButton subreddit={currentSubreddit} size="big" />
      </div>
    </div>
  );
};

export default SubredditInfo;
