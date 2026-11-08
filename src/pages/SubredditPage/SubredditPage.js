import { useState } from "react";
import { useParams } from "react-router";
import PostFeed from "../../components/Feeds/PostFeed/PostFeed";
import {
  setCurrentSubreddit,
  setHeaderDropDownVisible,
} from "../../app/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";

import JoinSubredditButton from "../../components/Buttons/JoinSubredditButton";
import DefaultSubredditIcon from "../../assets/icons/DefaultSubredditIcon";
import EditSubredditIconModal from "./components/EditSubredditIconModal";
import { hasSubredditPermission } from "../../config/moderator-permissions";
import { SubredditPermissions } from "../../enums/subreddit.enum";
import { ImageOutlined } from "@mui/icons-material";
import EditSubredditPageBackgroundModal from "./components/EditSubredditPageBackgroundModal";
import NotFound from "../../components/Shared/NotFound";
import LoadError from "../../components/Shared/LoadError";
import usePageResource from "../../hooks/usePageResource";

const EditIconButton = ({ className, onClick }) => (
  <span onClick={onClick} className={className}>
    <span className="p-1.5 bg-gray-200 rounded-full h-min flex items-center justify-center">
      <ImageOutlined style={{ height: "20px" }} />
    </span>
  </span>
);

const SubredditPage = ({ orderType = "new" }) => {
  const dispatch = useDispatch();
  const subredditName = useParams().subredditName;
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);
  const [isVisibleEditSubredditIconModal, setIsVisibleEditSubredditIconModal] =
    useState(false);
  const [
    isVisibleEditSubredditPageBackgroundModal,
    setIsVisibleEditSubredditPageBackgroundModal,
  ] = useState(false);
  const user = useSelector((state) => state.app.user);

  const [subredditId, setSubredditId] = useState(null);
  const { status: loadStatus, retry } = usePageResource(
    "/api/subreddits/" + subredditName,
    {
      refetchKey: user?.id,
      onSuccess: (data) => {
        setSubredditId(data.id);
        dispatch(
          setCurrentSubreddit({
            ...data,
            currentUserCanManageSettings: hasSubredditPermission(
              data.currentUserRole,
              SubredditPermissions.SETTINGS_MANAGE,
            ),
          }),
        );
      },
    },
  );

  const openEditSubredditPageBackgroundModal = () =>
    setIsVisibleEditSubredditPageBackgroundModal(true);

  if (loadStatus === "loading") return null;

  if (loadStatus === "notFound") {
    return (
      <NotFound
        title="Subreddit not found"
        message={`r/${subredditName} doesn't exist or may have been removed.`}
      />
    );
  }

  if (loadStatus === "error") {
    return (
      <LoadError
        message={`We couldn't load r/${subredditName}. Please try again.`}
        onRetry={retry}
      />
    );
  }

  return (
    <>
      <EditSubredditIconModal
        isVisible={isVisibleEditSubredditIconModal}
        closeForm={() => setIsVisibleEditSubredditIconModal(false)}
      />
      <EditSubredditPageBackgroundModal
        isVisible={isVisibleEditSubredditPageBackgroundModal}
        closeForm={() => setIsVisibleEditSubredditPageBackgroundModal(false)}
      />
      <div
        onClick={() => {
          dispatch(setHeaderDropDownVisible(false));
        }}
        className="bg-gray-200 min-h-[calc(100dvh-var(--header-height))] xl:w-[1024px] xl:max-w-full"
      >
        <div>
          <div
            className="relative bg-white border-b-2 h-20"
            style={{
              backgroundImage: currentSubreddit?.subredditPageBackgroundImageUrl
                ? `url(${currentSubreddit.subredditPageBackgroundImageUrl})`
                : `url(https://api.dicebear.com/10.x/glass/svg?animationProbability=0&seed=${subredditName})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {currentSubreddit?.currentUserCanManageSettings && (
              <button
                className="absolute bottom-0 right-0"
                onClick={() => openEditSubredditPageBackgroundModal()}
              >
                <ImageOutlined className=" bg-gray-200 border border-gray-500" />
              </button>
            )}
          </div>
          <div className="bg-white h-[6rem]">
            <div className="max-w-screen-lg m-auto flex space-x-4">
              <div className={`-translate-y-5 `}>
                {currentSubreddit?.iconUrl ? (
                  <div className="rounded-full flex justify-center items-center overflow-hidden h-20 w-20 border-4 border-white bg-white">
                    <img src={currentSubreddit?.iconUrl} alt="" />
                  </div>
                ) : (
                  <div className="rounded-full overflow-hidden h-20 w-20 border-4 border-white  ">
                    <DefaultSubredditIcon />
                  </div>
                )}
                {currentSubreddit?.currentUserCanManageSettings && (
                  <EditIconButton
                    className="absolute bottom-0 right-0 cursor-pointer "
                    onClick={() => {
                      if (currentSubreddit?.currentUserCanManageSettings) {
                        setIsVisibleEditSubredditIconModal(true);
                      }
                    }}
                  />
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
