import { setCurrentSubreddit } from "../slices/appSlice";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import JoinSubredditButton from "./Buttons/JoinSubredditButton";
import Axios from "../utils/axios";
import DefaultSubredditIcon from "../icons/DefaultSubredditIcon";
import { TextareaAutosize } from "@mui/material";
import { EditSharp } from "@mui/icons-material";
import moment from "moment";

const SubredditInfo = ({ style = {}, isOnPostPage }) => {
  const dispatch = useDispatch();
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);
  const navigate = useNavigate();
  const subredditName = useParams().subredditName;

  const editedIntroductionRef = useRef("");

  useEffect(() => {
    const runUseEffectFunction = async () => {
      if (!isOnPostPage) return;
      const res = await Axios.get("/api/subreddits/" + subredditName);
      dispatch(setCurrentSubreddit(res.data));
    };
    runUseEffectFunction();
  }, [subredditName]);

  useEffect(() => {
    editedIntroductionRef.current = currentSubreddit?.description;
  }, [subredditName, currentSubreddit]);

  const [isVisibleEditIntroduction, setIsVisibleEditIntroduction] =
    useState(false);
  const [loading, setLoading] = useState(false);

  if (!currentSubreddit) return <></>;

  const handleUpdateIntroduction = async () => {
    setLoading(true);
    await Axios.patch("/api/subreddits/" + currentSubreddit.id + "/settings", {
      description: editedIntroductionRef.current,
    });
    dispatch(
      setCurrentSubreddit({
        ...currentSubreddit,
        description: editedIntroductionRef.current,
      }),
    );

    setIsVisibleEditIntroduction(false);
    setLoading(false);
  };

  const SubredditIntroductionAndEditSection = () => {
    return (
      <div className="text-sm max-w-xs  flex flex-col mb-4 text-gray-700 border-b break-words">
        {!isVisibleEditIntroduction && currentSubreddit.description}
        {isVisibleEditIntroduction && (
          <TextareaAutosize
            maxLength={500}
            onChange={(e) => {
              editedIntroductionRef.current = e.target.value;
            }}
            defaultValue={editedIntroductionRef.current}
            className="p-1 w-full border border-gray-600 max-h-[500px]"
            minRows={5}
            maxRows={20}
          />
        )}

        <div
          className={`py-2 flex ${isVisibleEditIntroduction ? "justify-between" : "justify-end"}`}
        >
          {isVisibleEditIntroduction && (
            <button
              disabled={loading}
              onClick={() => handleUpdateIntroduction()}
              className="btn2 hover:bg-blue-500 disabled:bg-gray-300"
            >
              Update description
            </button>
          )}
          {currentSubreddit?.currentUserCanManageSettings && (
            <EditSharp
              onClick={() => {
                setIsVisibleEditIntroduction(!isVisibleEditIntroduction);
              }}
              className="cursor-pointer self-end"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col border rounded-sm pt-5 text-gray-800  border-gray-300 bg-white"
      style={style}
    >
      <div className="p-2 flex flex-col space-y-3 ">
        <div
          onClick={() => navigate(`/r/${currentSubreddit?.name}`)}
          className=" font-bold flex space-x-5 items-center self-start cursor-pointer"
        >
          <div className="rounded-full overflow-hidden h-[3rem] w-[3rem]">
            {currentSubreddit.iconUrl ? (
              <img src={currentSubreddit.iconUrl} />
            ) : (
              <DefaultSubredditIcon />
            )}
          </div>
          <p className="text-lg font-semibold">
            r/{currentSubreddit?.name}
          </p>{" "}
        </div>
        <SubredditIntroductionAndEditSection />
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
        <div className="text-base font-normal">
          created {moment(currentSubreddit.createdAt).format("D MMM YYYY")}
        </div>
        <JoinSubredditButton subreddit={currentSubreddit} size="big" />
      </div>
    </div>
  );
};

export default SubredditInfo;
