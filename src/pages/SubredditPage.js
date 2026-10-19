import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Header from "../components/Header";
import PostFeed from "../components/PostFeed";
import f1 from "../fake data/f1.png";
import {
  setCurrentSubreddit,
  setHeaderDropDownVisible,
} from "../slices/appSlice";
import { useDispatch, useSelector } from "react-redux";

import JoinSubredditButton from "../components/Buttons/JoinSubredditButton";
import Axios from "../utils/axios";
import DefaultSubredditIcon from "../icons/DefaultSubredditIcon";
import EditSubredditIconModal from "../components/Forms/EditSubredditIconModal";
import { hasSubredditPermission } from "../config/moderator-permissions";
import { SubredditPermissions } from "../enums/subreddit.enum";
import { ImageOutlined } from "@mui/icons-material";

const SubredditPage = ({ orderType = "new" }) => {
  const dispatch = useDispatch();
  const subredditName = useParams().subredditName;
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);
  const [isVisibleEditSubredditIconModal, setIsVisibleEditSubredditIconModal] =
    useState(false);

  const user = useSelector((state) => state.app.user);

  const [subredditId, setSubredditId] = useState(null);
  useEffect(async () => {
    const res = await Axios.get("/api/subreddits/" + subredditName);
    setSubredditId(res.data.id);

    const getCanManageSettings = () =>
      hasSubredditPermission(
        res.data?.currentUserRole,
        SubredditPermissions.SETTINGS_MANAGE,
      );
    dispatch(
      setCurrentSubreddit({
        ...res.data,
        currentUserCanManageSettings: getCanManageSettings(),
      }),
    );
  }, [subredditName, user]);

  const EditIconButton = ({ className }) => (
    <span
      onClick={() => {
        if (currentSubreddit?.currentUserCanManageSettings) {
          setIsVisibleEditSubredditIconModal(true);
        }
      }}
      className={className}
    >
      <span className="p-1.5 bg-gray-200 rounded-full h-min flex items-center justify-center">
        <ImageOutlined style={{ height: "20px" }} />
      </span>
    </span>
  );

  return (
    <>
      <EditSubredditIconModal
        isVisible={isVisibleEditSubredditIconModal}
        closeForm={() => setIsVisibleEditSubredditIconModal(false)}
      />
      <div
        onClick={() => {
          dispatch(setHeaderDropDownVisible(false));
        }}
        className="bg-gray-200 min-h-[100dvh]"
      >
        <div>
          <div
            className="bg-blue-500 h-20"
            style={{
              backgroundImage: `url(https://api.dicebear.com/10.x/glass/svg?animationProbability=0&seed=${subredditName})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="bg-white h-[6rem]">
            <div className="max-w-screen-lg m-auto flex space-x-4">
              <div className={`-translate-y-5 `}>
                {currentSubreddit?.iconUrl ? (
                  <div className="rounded-full overflow-hidden h-20 w-20 border-4 border-white ">
                    <img src={currentSubreddit?.iconUrl} alt="" />
                  </div>
                ) : (
                  <div className="rounded-full overflow-hidden h-20 w-20 border-4 border-white  ">
                    <DefaultSubredditIcon />
                  </div>
                )}
                {currentSubreddit?.currentUserCanManageSettings && (
                  <EditIconButton className="absolute bottom-0 right-0 cursor-pointer " />
                )}
              </div>

              <div className="flex flex-col items-start space-y-1 py-2">
                <h2 className="font-bold text-lg">{subredditName}</h2>
                <p className="font-semibold text-xs text-gray-400">
                  r/{subredditName}
                </p>
              </div>

              <JoinSubredditButton
                subreddit={{ name: subredditName, id: subredditId }}
              />
            </div>
          </div>
        </div>
        <main className="max-w-screen-lg m-auto">
          {subredditId && (
            <div>
              <PostFeed orderType={orderType} subredditId={subredditId} />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default SubredditPage;
