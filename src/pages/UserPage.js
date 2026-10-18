import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setHeaderDropDownVisible } from "../slices/appSlice";

import { PlusCircleIcon } from "@heroicons/react/outline";

import UserPagePostFeed from "../components/UserPagePostFeed";
import { useState } from "react";
import { ArrowSmUpIcon } from "@heroicons/react/outline";
import { ArrowSmDownIcon } from "@heroicons/react/outline";
import UserAvatarImg from "../components/UserAvatarImg";
import { useSearchParams } from "react-router-dom";

const UserPage = ({ orderType = "new" }) => {
  const username = useParams().username;
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentlySelectedContent =
    searchParams.get("contentType") || "overview";

  const UserIntroductionSection = () => {
    return (
      <div>
        <div
          className="lg:hidden"
          style={{
            height: "100px",
            width: "100%",
            backgroundImage: `url(https://api.dicebear.com/10.x/landscape/svg?orbProbability=0&seed=${username})`,
            backgroundSize: "fit",
            backgroundPosition: "center",
          }}
        />
        <div className="flex justify-between pr-4">
          <div className="flex flex-col lg:flex-row  lg:pb-6 bg-white pl-4">
            <div className="rounded-full h-20 w-20 overflow-hidden border-4 border-white mr-4 lg:translate-y-0 -translate-y-5">
              <UserAvatarImg seed={username} size={"auto"} />
            </div>
            <div className="flex flex-col justify-center lg:translate-y-0 -translate-y-5">
              <h1 className="text-xl font-bold">{username}</h1>
              <h2 className="font-bold text-neutral-500 text-sm">
                u/{username}
              </h2>
            </div>
          </div>
          <div className="height-full flex items-center lg:hidden">
            <FollowUserButton />
          </div>
        </div>
      </div>
    );
  };

  const UserPageContentSelectionButtons = () => {
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

  const UserInfoSectionDetails = () => {
    return (
      <div className="flex justify-between ">
        <div className="w-full">
          <div>
            <p className="font-semibold text-[15px]">100,550</p>{" "}
            <p className="text-[13px] text-gray-700 translate-y-[-3px] font-light">
              Karma
            </p>
          </div>

          <div>
            <p className="font-semibold text-[15px]">1 y</p>{" "}
            <p className="text-[13px] text-gray-700 translate-y-[-3px] font-light">
              Reddit Age
            </p>
          </div>
        </div>
        <div className="w-full">
          <div>
            <p className="font-semibold text-[15px]">10</p>{" "}
            <p className="text-[13px] text-gray-700 translate-y-[-3px] font-light">
              Contributions
            </p>
          </div>

          <div>
            <p className="font-semibold text-[15px]">50</p>{" "}
            <p className="text-[13px] text-gray-700 translate-y-[-3px] font-light">
              Subreddits joined
            </p>
          </div>
        </div>
      </div>
    );
  };

  const UserInfoSectionBigScreen = () => {
    return (
      <div
        className=" bg-white rounded-t-sm relative  border-gray-300 rounded-t-xl overflow-hidden bg-[#f6f8f9]"
        style={{ maxWidth: "300px" }}
      >
        <div
          className=""
          style={{
            height: "100px",
            width: "300px",
            backgroundImage: `url(https://api.dicebear.com/10.x/landscape/svg?orbProbability=0&seed=${username})`,
            backgroundSize: "fit",
            backgroundPosition: "center",
          }}
        />

        <div className="p-4 w-full">
          <div className="mb-4 font-bold">{username}</div>
          <FollowUserButton />
          <div className="text-sm  mb-4 text-gray-700 border-b">
            Lorem ipsum, cras non ex sit amet arcu commodo feugiat sed sed
            lorem. Nam auctor, lacus quis varius accumsan, urna est tristique
            lacus, vulputate pharetra arcu mauris sed felis. Aliquam faucibus
            metus risus, nec sagittis urna ultricies eget
          </div>
          <UserInfoSectionDetails />
        </div>
      </div>
    );
  };

  const UserInfoSectionSmallScreen = () => {
    const [dropDownExpanded, setDropDownExpanded] = useState(false);
    return (
      <div className="lg:hidden px-4">
        <div className="text-sm  mb-4 text-gray-700 bg-[#f6f8f9] p-4 rounded-3xl">
          Lorem ipsum, cras non ex sit amet arcu commodo feugiat sed sed lorem.
          Nam auctor, lacus quis varius accumsan, urna est tristique lacus,
          vulputate pharetra arcu mauris sed felis. Aliquam faucibus metus
          risus, nec sagittis urna ultricies eget
        </div>
        <div
          className="w-full bg-[#f6f8f9] rounded-3xl mb-4  overflow-hidden transition-all duration-200"
          style={{
            height: dropDownExpanded ? "300px" : "50px",
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
            <div className="py-2 border-b">
              <UserInfoSectionDetails />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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
          <UserIntroductionSection />
          <UserInfoSectionSmallScreen />
          <UserPageContentSelectionButtons />

          <div className="flex flex-col  w-full">
            <div className="flex justify-center lg:justify-between w-full mt-4">
              <UserPagePostFeed
                contentType={currentlySelectedContent}
                orderType={orderType}
              />

              <div className="hidden lg:block">
                <UserInfoSectionBigScreen />
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
