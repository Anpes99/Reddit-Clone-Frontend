import {
  addGlobalNotification,
  setCurrentSubreddit,
} from "../../../app/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import JoinSubredditButton from "../../../components/Buttons/JoinSubredditButton";
import Axios from "../../../shared/lib/axios";
import DefaultSubredditIcon from "../../../assets/icons/DefaultSubredditIcon";
import { TextareaAutosize } from "@mui/material";
import { EditSharp } from "@mui/icons-material";
import moment from "moment";
import useSubredditPresence from "../../../hooks/useSubredditPresence";
import socket from "../../../shared/lib/socket";

const SubredditIntroductionAndEditSection = ({
  description,
  canManageSettings,
  onSave,
}) => {
  const [descriptionDraft, setDescriptionDraft] = useState(description ?? "");
  const [isVisibleEditIntroduction, setIsVisibleEditIntroduction] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(descriptionDraft);
      setIsVisibleEditIntroduction(false);
    } catch (error) {
      if (error.response?.status !== 429) {
        dispatch(
          addGlobalNotification({
            type: "error",
            message: "Couldn't update the description. Please try again.",
          }),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-sm max-w-xs  flex flex-col mb-4 text-gray-700 border-b break-words">
      {!isVisibleEditIntroduction && description}
      {isVisibleEditIntroduction && (
        <TextareaAutosize
          maxLength={500}
          onChange={(e) => {
            setDescriptionDraft(e.target.value);
          }}
          value={descriptionDraft}
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
            onClick={handleSave}
            className="btn2 hover:bg-blue-500 disabled:bg-gray-300"
          >
            Update description
          </button>
        )}
        {canManageSettings && (
          <EditSharp
            onClick={() =>
              setIsVisibleEditIntroduction(!isVisibleEditIntroduction)
            }
            className="cursor-pointer self-end"
          />
        )}
      </div>
    </div>
  );
};

const SubredditInfoSkeleton = ({ style }) => (
  <div
    className="w-[340px] flex flex-col border rounded-sm pt-5 border-gray-300 bg-white animate-pulse"
    style={style}
    aria-busy="true"
    aria-label="Loading community info"
  >
    <div className="p-2 flex flex-col space-y-3">
      <div className="flex space-x-5 items-center">
        <div className="rounded-full h-[3rem] w-[3rem] bg-gray-200" />
        <div className="h-5 w-32 bg-gray-200 rounded" />
      </div>
      <div className="max-w-xs flex flex-col space-y-2 pb-4 border-b">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-11/12 bg-gray-200 rounded" />
        <div className="h-3 w-2/3 bg-gray-200 rounded" />
      </div>
      <div className="flex space-x-20 border-b pb-5">
        <div className="space-y-1">
          <div className="h-4 w-10 bg-gray-200 rounded" />
          <div className="h-3 w-14 bg-gray-200 rounded" />
        </div>
        <div className="space-y-1">
          <div className="h-4 w-10 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-4 w-36 bg-gray-200 rounded" />
      <div className="h-9 w-full rounded-full bg-gray-200" />
    </div>
  </div>
);

const SubredditInfo = ({ style = {}, isOnPostPage }) => {
  const dispatch = useDispatch();
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);
  const navigate = useNavigate();
  const subredditName = useParams().subredditName;

  const user = useSelector((state) => state.app.user);

  const onlineCount = useSubredditPresence(socket, subredditName, user?.id);

  const [loadFailed, setLoadFailed] = useState(false);

  const isStaleOrMissing =
    !!subredditName &&
    (!currentSubreddit ||
      currentSubreddit.name?.toLowerCase() !== subredditName.toLowerCase());

  useEffect(() => {
    const runUseEffectFunction = async () => {
      if (!subredditName) return;

      const shouldFetch = isOnPostPage || isStaleOrMissing;
      if (!shouldFetch) return;

      setLoadFailed(false);
      try {
        const res = await Axios.get("/api/subreddits/" + subredditName);
        dispatch(setCurrentSubreddit(res.data));
      } catch (e) {
        setLoadFailed(true);
      }
    };
    runUseEffectFunction();
  }, [subredditName, dispatch, isOnPostPage]);

  if (loadFailed) return null;
  if (isStaleOrMissing) return <SubredditInfoSkeleton style={style} />;
  if (!currentSubreddit) return <></>;

  const handleUpdateIntroduction = async (description) => {
    await Axios.patch("/api/subreddits/" + currentSubreddit.id + "/settings", {
      description,
    });
    dispatch(
      setCurrentSubreddit({
        ...currentSubreddit,
        description,
      }),
    );
  };

  return (
    <div
      className="flex flex-col border rounded-sm pt-5 text-gray-800  border-gray-300 bg-white w-[340px]"
      style={style}
    >
      <div className="p-2 flex flex-col space-y-3 ">
        <div
          onClick={() => navigate(`/r/${currentSubreddit?.name}`)}
          className=" font-bold flex space-x-5 items-center self-start cursor-pointer"
        >
          <div className="rounded-full flex justify-center items-center overflow-hidden h-[3rem] w-[3rem]">
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
        <SubredditIntroductionAndEditSection
          key={currentSubreddit.id}
          description={currentSubreddit.description}
          canManageSettings={currentSubreddit.currentUserCanManageSettings}
          onSave={handleUpdateIntroduction}
        />
        <div className="flex space-x-20 border-b pb-5">
          <div className="">
            <p className="font-bold">{currentSubreddit.memberCount || 0}</p>
            <p className="font-medium text-xs text-gray-800">Members</p>
          </div>
          <div className="">
            <p className="font-bold">{onlineCount}</p>
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
