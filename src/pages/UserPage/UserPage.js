import { useParams, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  addGlobalNotification,
  setHeaderDropDownVisible,
} from "../../app/slices/appSlice";

import { PlusCircleIcon } from "@heroicons/react/outline";

import UserPageActivityFeed from "./components/UserPageActivityFeed";
import { useEffect, useState } from "react";
import { ArrowSmUpIcon } from "@heroicons/react/outline";
import { ArrowSmDownIcon } from "@heroicons/react/outline";
import UserAvatarImg from "../../components/Users/UserAvatarImg";
import Axios from "../../shared/lib/axios";
import { EditSharp, ImageOutlined } from "@mui/icons-material";
import { TextareaAutosize, useMediaQuery } from "@mui/material";
import EditUserAvatarImageModal from "./components/EditUserAvatarImageModal";
import moment from "moment";
import EditUserPageBackgroundModal from "./components/EditUserPageBackgroundModal";

const UserIntroductionSection = ({
  viewedUserDetails,
  openEditUserPageBackgroundModal,
  isOwnPage,
  setIsVisibleEditUserAvatarImageModal,
  isVisibleEditUserAvatarImageModal,
  viewedUserUsername,
  user,
}) => {
  return (
    <div>
      <div
        className="relative lg:hidden"
        style={{
          height: "100px",
          width: "100%",
          backgroundImage: viewedUserDetails.profilePageBackgroundImageUrl
            ? `url(${viewedUserDetails.profilePageBackgroundImageUrl})`
            : `url(https://api.dicebear.com/10.x/landscape/svg?orbProbability=0&seed=${viewedUserUsername})`,
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
        <div className="height-full flex items-center lg:hidden">
          {viewedUserUsername !== user?.username && <FollowUserButton />}
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
          window.location.reload();
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
          window.location.reload();
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
          window.location.reload();
        }}
        className={`${currentlySelectedContent === "comments" ? "bg-gray-300" : ""} pl-4 pr-4 py-2  rounded-3xl font-semibold hover:underline `}
      >
        Comments
      </button>
    </div>
  );
};

const FollowUserButton = () => (
  <button className="bg-blue-800 text-white rounded-full px-3 py-1 font-semibold flex text-sm items-center mb-4 font-normal hover:bg-blue-900">
    <PlusCircleIcon
      style={{ width: "1.5rem", marginRight: "7px" }}
      className="hidden lg:block"
    />
    Follow
  </button>
);

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
          backgroundImage: viewedUserDetails.profilePageBackgroundImageUrl
            ? `url(${viewedUserDetails.profilePageBackgroundImageUrl})`
            : `url(https://api.dicebear.com/10.x/landscape/svg?orbProbability=0&seed=${viewedUserUsername})`,
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
        {viewedUserUsername !== user?.username && <FollowUserButton />}
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
    </div>
  );
};

const UserPage = ({ orderType = "new" }) => {
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

  useEffect(() => {
    const runUseEffectFunction = async () => {
      const result = await Axios.get("/api/users/" + viewedUserUsername);

      setViewedUserDetails(result.data);
      setIntroductionDraft(result.data.introduction ?? "");
    };
    runUseEffectFunction();
  }, [viewedUserUsername]);

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

  const isOwnPage = () => user?.username === viewedUserDetails.username;

  const [isVisibleEditBackgroundModal, setIsVisibleEditBackgroundModal] =
    useState(false);

  const openEditUserPageBackgroundModal = () => {
    setIsVisibleEditBackgroundModal(true);
  };

  return (
    <>
      {isVisibleEditUserAvatarImageModal && (
        <EditUserAvatarImageModal
          isVisible={isVisibleEditUserAvatarImageModal}
          closeForm={() => {
            setIsVisibleEditUserAvatarImageModal(false);
          }}
        />
      )}
      {isVisibleEditBackgroundModal && (
        <EditUserPageBackgroundModal
          isVisible={isVisibleEditBackgroundModal}
          closeForm={() => {
            setIsVisibleEditBackgroundModal(false);
          }}
        />
      )}

      <div
        onClick={() => {
          dispatch(setHeaderDropDownVisible(false));
        }}
        className="flex flex-row min-h-[100dvh] justify-between bg-white "
      >
        {/* LEFT SIDE BAR SECTION */}
        <div className=""></div>

        {/* 1. USER INTRODUCTION SECTION 2. POST SORTING SECTION 3. USER POSTFEED SECTION/COMMENTS SECTION */}
        <div className="w-full  md:px-5 lg:pt-6 max-w-screen-lg">
          <UserIntroductionSection
            viewedUserDetails={viewedUserDetails}
            openEditUserPageBackgroundModal={openEditUserPageBackgroundModal}
            isOwnPage={isOwnPage}
            setIsVisibleEditUserAvatarImageModal={
              setIsVisibleEditUserAvatarImageModal
            }
            isVisibleEditUserAvatarImageModal={
              isVisibleEditUserAvatarImageModal
            }
            viewedUserUsername={viewedUserUsername}
            user={user}
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

          <div className="flex flex-col  w-full">
            <div className="flex justify-center lg:justify-between w-full mt-4">
              <UserPageActivityFeed
                contentType={currentlySelectedContent}
                orderType={orderType}
              />

              <div className="hidden lg:block">
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
                  openEditUserPageBackgroundModal={
                    openEditUserPageBackgroundModal
                  }
                />
              </div>
            </div>
          </div>

          <div></div>
        </div>

        {/* RIGHT SIDE BAR SECTION - USER PROFILE MAIN INFO SECTION */}
        <div className=""></div>
      </div>
    </>
  );
};

export default UserPage;
