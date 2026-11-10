import { useParams, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addGlobalNotification } from "../../app/slices/appSlice";

import UserPageActivityFeed from "./components/UserPageActivityFeed";
import { useState } from "react";
import { ArrowSmUpIcon } from "@heroicons/react/outline";
import { ArrowSmDownIcon } from "@heroicons/react/outline";
import UserAvatarImg from "../../components/Users/UserAvatarImg";
import Axios from "../../shared/lib/axios";
import { EditSharp, ImageOutlined } from "@mui/icons-material";
import { TextareaAutosize, useMediaQuery } from "@mui/material";
import EditUserAvatarImageModal from "./components/EditUserAvatarImageModal";
import moment from "moment";
import EditUserPageBackgroundModal from "./components/EditUserPageBackgroundModal";
import NotFound from "../../components/Shared/NotFound";
import LoadError from "../../components/Shared/LoadError";
import usePageResource from "../../hooks/usePageResource";
import ModeratedCommunities from "./components/ModeratedCommunities";

const getBackgroundImageUrl = (userDetails, username) =>
  userDetails.profilePageBackgroundImageUrl ||
  `https://api.dicebear.com/10.x/landscape/svg?orbProbability=0&seed=${username}`;

const UserIntroductionSection = ({
  viewedUserDetails,
  openEditUserPageBackgroundModal,
  isOwnPage,
  setIsVisibleEditUserAvatarImageModal,
  isVisibleEditUserAvatarImageModal,
  viewedUserUsername,
}) => {
  return (
    <div>
      <div
        className="relative lg:hidden"
        style={{
          height: "100px",
          width: "100%",
          backgroundImage: `url(${getBackgroundImageUrl(viewedUserDetails, viewedUserUsername)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {isOwnPage() && (
          <button
            className="absolute bottom-0 right-0"
            onClick={() => openEditUserPageBackgroundModal()}
          >
            <ImageOutlined className=" bg-gray-200 border border-gray-500" />
          </button>
        )}
      </div>
      <div className="flex justify-between pr-4">
        <div className="flex flex-col lg:flex-row  lg:pb-6 bg-white pl-4">
          <span className="relative flex mr-4">
            <div className="rounded-full h-20 w-20 overflow-hidden border-4 border-white lg:translate-y-0 -translate-y-5">
              <UserAvatarImg
                url={viewedUserDetails.avatarImageUrl}
                size={"auto"}
              />
            </div>

            {isOwnPage() && (
              <div
                onClick={() => {
                  if (isOwnPage()) {
                    setIsVisibleEditUserAvatarImageModal(
                      !isVisibleEditUserAvatarImageModal,
                    );
                  }
                }}
                className={`absolute right-0 bottom-5 lg:right-0 lg:bottom-0 ${isOwnPage() ? "cursor-pointer" : ""} p-1.5 bg-gray-200 rounded-full h-min flex items-center justify-center`}
              >
                <ImageOutlined style={{ height: "20px" }} />
              </div>
            )}
          </span>
          <div className="flex flex-col justify-center lg:translate-y-0 -translate-y-5">
            <h1 className="text-xl font-bold">{viewedUserUsername}</h1>
            <h2 className="font-bold text-neutral-500 text-sm">
              u/{viewedUserUsername}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserPageContentSelectionButtons = ({
  currentlySelectedContent,
  searchParams,
  setSearchParams,
}) => {
  return (
    <div className="flex ">
      <button
        onClick={() => {
          setSearchParams({ contentType: "overview" });
        }}
        className={`${currentlySelectedContent === "overview" ? "bg-gray-300" : ""} pl-4 pr-4 py-2  rounded-3xl font-semibold mr-4 hover:underline`}
      >
        Overview
      </button>
      <button
        onClick={() => {
          setSearchParams({
            contentType: "posts",
            sort: searchParams.get("sort") || "new",
          });
        }}
        className={`${currentlySelectedContent === "posts" ? "bg-gray-300" : ""} pl-4 pr-4 py-2 rounded-3xl font-semibold mr-4 hover:underline`}
      >
        Posts
      </button>
      <button
        onClick={() => {
          setSearchParams({
            contentType: "comments",
            sort: searchParams.get("sort") || "new",
          });
        }}
        className={`${currentlySelectedContent === "comments" ? "bg-gray-300" : ""} pl-4 pr-4 py-2  rounded-3xl font-semibold hover:underline `}
      >
        Comments
      </button>
    </div>
  );
};

const UserInfoSectionDetails = ({ viewedUserDetails }) => {
  return (
    <div className="flex justify-between ">
      <div className="w-full">
        <div>
          <p className="font-semibold text-[15px]">{viewedUserDetails.karma}</p>{" "}
          <p className="text-[13px] text-gray-700 translate-y-[-3px] font-light">
            Karma
          </p>
        </div>

        <div>
          <p className="font-semibold text-[15px]">
            {moment
              .duration(moment().diff(viewedUserDetails.createdAt))
              .humanize()}
          </p>{" "}
          <p className="text-[13px] text-gray-700 translate-y-[-3px] font-light">
            Reddit Age
          </p>
        </div>
      </div>
      <div className="w-full">
        <div>
          <p className="font-semibold text-[15px]">
            {viewedUserDetails.contributionsCount}
          </p>{" "}
          <p className="text-[13px] text-gray-700 translate-y-[-3px] font-light">
            Contributions
          </p>
        </div>

        <div>
          <p className="font-semibold text-[15px]">
            {viewedUserDetails.subredditsJoinedCount}
          </p>{" "}
          <p className="text-[13px] text-gray-700 translate-y-[-3px] font-light">
            Subreddits joined
          </p>
        </div>
      </div>
    </div>
  );
};

const UserIntroductionAndEditSection = ({
  isVisibleEditIntroduction,
  setIsVisibleEditIntroduction,
  viewedUserDetails,
  introductionDraft,
  setIntroductionDraft,
  loading,
  handleUpdateIntroduction,
  user,
  viewedUserUsername,
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");

  return (
    <div className="text-sm  flex flex-col mb-4 text-gray-700 border-b break-words">
      {!isVisibleEditIntroduction && viewedUserDetails.introduction}
      {isVisibleEditIntroduction && (
        <TextareaAutosize
          maxLength={500}
          key={`text-area-${String(isSmallScreen)}`}
          onChange={(e) => {
            setIntroductionDraft(e.target.value);
          }}
          value={introductionDraft}
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
        {user?.username === viewedUserUsername && (
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

const UserInfoSectionBigScreen = ({
  isVisibleEditIntroduction,
  setIsVisibleEditIntroduction,
  viewedUserDetails,
  introductionDraft,
  setIntroductionDraft,
  loading,
  handleUpdateIntroduction,
  user,
  viewedUserUsername,
  isOwnPage,
  openEditUserPageBackgroundModal,
}) => {
  return (
    <div
      className=" bg-white rounded-t-sm relative  border-gray-300 rounded-t-xl overflow-hidden bg-[#f6f8f9]"
      style={{ maxWidth: "300px" }}
    >
      <div
        className="relative"
        style={{
          height: "100px",
          width: "300px",
          backgroundImage: `url(${getBackgroundImageUrl(viewedUserDetails, viewedUserUsername)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {isOwnPage() && (
          <button
            className="absolute bottom-0 right-0"
            onClick={() => openEditUserPageBackgroundModal()}
          >
            <ImageOutlined className=" bg-gray-200 border border-gray-500" />
          </button>
        )}
      </div>

      <div className="p-4 w-full">
        <div className="mb-4 font-bold">{viewedUserUsername}</div>
        <UserIntroductionAndEditSection
          isVisibleEditIntroduction={isVisibleEditIntroduction}
          setIsVisibleEditIntroduction={setIsVisibleEditIntroduction}
          viewedUserDetails={viewedUserDetails}
          introductionDraft={introductionDraft}
          setIntroductionDraft={setIntroductionDraft}
          loading={loading}
          handleUpdateIntroduction={handleUpdateIntroduction}
          user={user}
          viewedUserUsername={viewedUserUsername}
        />
        <UserInfoSectionDetails viewedUserDetails={viewedUserDetails} />
      </div>
    </div>
  );
};

const UserInfoSectionSmallScreen = ({
  isVisibleEditIntroduction,
  setIsVisibleEditIntroduction,
  viewedUserDetails,
  introductionDraft,
  setIntroductionDraft,
  loading,
  handleUpdateIntroduction,
  user,
  viewedUserUsername,
}) => {
  const [dropDownExpanded, setDropDownExpanded] = useState(false);
  return (
    <div className="lg:hidden px-4">
      <UserIntroductionAndEditSection
        isVisibleEditIntroduction={isVisibleEditIntroduction}
        setIsVisibleEditIntroduction={setIsVisibleEditIntroduction}
        viewedUserDetails={viewedUserDetails}
        introductionDraft={introductionDraft}
        setIntroductionDraft={setIntroductionDraft}
        loading={loading}
        handleUpdateIntroduction={handleUpdateIntroduction}
        user={user}
        viewedUserUsername={viewedUserUsername}
      />
      <div
        className="w-full bg-[#f6f8f9] rounded-3xl mb-4  overflow-hidden transition-all duration-200"
        style={{
          height: dropDownExpanded ? "170px" : "50px",
        }}
      >
        <div
          onClick={() => setDropDownExpanded((prev) => !prev)}
          className="flex items-center h-[50px] px-4 font-bold text-lg justify-between  cursor-pointer"
        >
          <p>About</p>
          {dropDownExpanded ? (
            <ArrowSmUpIcon className="h-7" />
          ) : (
            <ArrowSmDownIcon className="h-7" />
          )}
        </div>
        <div
          className="px-4 pt-2 transition-opacity duration-300"
          style={{
            opacity: dropDownExpanded ? 1 : 0,
            pointerEvents: dropDownExpanded ? "auto" : "none",
          }}
        >
          <div className="py-2">
            <UserInfoSectionDetails viewedUserDetails={viewedUserDetails} />
          </div>
        </div>
      </div>
      <ModeratedCommunities
        moderatedSubreddits={viewedUserDetails.moderatedSubreddits}
        collapsible
        className="mb-4"
      />
    </div>
  );
};

const UserPage = () => {
  const viewedUserUsername = useParams().username;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentlySelectedContent =
    searchParams.get("contentType") || "overview";

  const [viewedUserDetails, setViewedUserDetails] = useState({});
  const [introductionDraft, setIntroductionDraft] = useState("");
  const [isVisibleEditIntroduction, setIsVisibleEditIntroduction] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [
    isVisibleEditUserAvatarImageModal,
    setIsVisibleEditUserAvatarImageModal,
  ] = useState(false);

  const { status: loadStatus, retry } = usePageResource(
    "/api/users/" + viewedUserUsername,
    {
      onSuccess: (data) => {
        setViewedUserDetails(data);
        setIntroductionDraft(data.introduction ?? "");
      },
    },
  );

  const handleUpdateIntroduction = async () => {
    setLoading(true);
    try {
      await Axios.patch("/api/loggedInUser", {
        introduction: introductionDraft,
      });
      setViewedUserDetails({
        ...viewedUserDetails,
        introduction: introductionDraft,
      });
      setIsVisibleEditIntroduction(false);
    } catch (e) {
      if (e.response?.status !== 429) {
        dispatch(
          addGlobalNotification({
            type: "error",
            message: "Couldn't update your introduction. Please try again.",
          }),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const applySavedUserDetails = (changes) =>
    setViewedUserDetails((details) => ({ ...details, ...changes }));

  const isOwnPage = () => user?.username === viewedUserDetails.username;

  const [isVisibleEditBackgroundModal, setIsVisibleEditBackgroundModal] =
    useState(false);

  const openEditUserPageBackgroundModal = () => {
    setIsVisibleEditBackgroundModal(true);
  };

  if (loadStatus === "loading") {
    return null;
  }

  if (loadStatus === "error") {
    return (
      <LoadError
        message={`We couldn't load u/${viewedUserUsername}. Please try again.`}
        onRetry={retry}
      />
    );
  }

  if (loadStatus === "notFound") {
    return (
      <NotFound
        title="User not found"
        message={`u/${viewedUserUsername} doesn't exist or may have been deleted.`}
      />
    );
  }

  return (
    <>
      {isVisibleEditUserAvatarImageModal && (
        <EditUserAvatarImageModal
          isVisible={isVisibleEditUserAvatarImageModal}
          closeForm={() => {
            setIsVisibleEditUserAvatarImageModal(false);
          }}
          onSaved={applySavedUserDetails}
        />
      )}
      {isVisibleEditBackgroundModal && (
        <EditUserPageBackgroundModal
          isVisible={isVisibleEditBackgroundModal}
          closeForm={() => {
            setIsVisibleEditBackgroundModal(false);
          }}
          onSaved={applySavedUserDetails}
          currentImageUrl={viewedUserDetails.profilePageBackgroundImageUrl}
        />
      )}

      <div className="w-full xl:w-[1024px] xl:max-w-full mx-auto  md:px-5 lg:pt-6 max-w-screen-lg min-h-[calc(100dvh-var(--header-height))] bg-white ">
        <UserIntroductionSection
          viewedUserDetails={viewedUserDetails}
          openEditUserPageBackgroundModal={openEditUserPageBackgroundModal}
          isOwnPage={isOwnPage}
          setIsVisibleEditUserAvatarImageModal={
            setIsVisibleEditUserAvatarImageModal
          }
          isVisibleEditUserAvatarImageModal={isVisibleEditUserAvatarImageModal}
          viewedUserUsername={viewedUserUsername}
        />
        <UserInfoSectionSmallScreen
          isVisibleEditIntroduction={isVisibleEditIntroduction}
          setIsVisibleEditIntroduction={setIsVisibleEditIntroduction}
          viewedUserDetails={viewedUserDetails}
          introductionDraft={introductionDraft}
          setIntroductionDraft={setIntroductionDraft}
          loading={loading}
          handleUpdateIntroduction={handleUpdateIntroduction}
          user={user}
          viewedUserUsername={viewedUserUsername}
        />
        <UserPageContentSelectionButtons
          currentlySelectedContent={currentlySelectedContent}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

        <div className="flex justify-center lg:justify-between w-full mt-4 gap-6">
          <div className="flex-1 min-w-0">
            <UserPageActivityFeed contentType={currentlySelectedContent} />
          </div>
          <div className="hidden lg:block w-[312px] shrink-0">
            <UserInfoSectionBigScreen
              isVisibleEditIntroduction={isVisibleEditIntroduction}
              setIsVisibleEditIntroduction={setIsVisibleEditIntroduction}
              viewedUserDetails={viewedUserDetails}
              introductionDraft={introductionDraft}
              setIntroductionDraft={setIntroductionDraft}
              loading={loading}
              handleUpdateIntroduction={handleUpdateIntroduction}
              user={user}
              viewedUserUsername={viewedUserUsername}
              isOwnPage={isOwnPage}
              openEditUserPageBackgroundModal={openEditUserPageBackgroundModal}
            />
            <ModeratedCommunities
              moderatedSubreddits={viewedUserDetails.moderatedSubreddits}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
