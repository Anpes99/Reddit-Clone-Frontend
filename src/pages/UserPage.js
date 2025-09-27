import { useParams } from "react-router";
import Header from "../components/Header";
import { useDispatch } from "react-redux";
import { setHeaderDropDownVisible } from "../slices/appSlice";

import f1 from "../fake data/f1.png";
import UserPagePostFeed from "../components/UserPagePostFeed";

const UserPage = ({ orderType = "new" }) => {
  const username = useParams().username;
  const dispatch = useDispatch();

  const UserIntroductionSection = () => {
    return (
      <div className="flex flex-row pl-4  pb-6 bg-white">
        <div className="rounded-full h-20 w-20 overflow-hidden border-4 border-white mr-4">
          <img src={f1} alt="" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-bold">firstname lastname</h1>
          <h2 className="font-bold text-neutral-500 text-sm">u/{username}</h2>
        </div>
      </div>
    );
  };

  const UserPageContentSelectionButtons = () => {
    return (
      <div className="flex">
        <a
          href="#"
          className=" pl-4 pr-4 py-2  rounded-3xl font-semibold mr-4 hover:underline"
        >
          Overview
        </a>
        <a
          href="#"
          className="bg-gray-300 pl-4 pr-4 py-2 rounded-3xl font-semibold mr-4 hover:underline"
        >
          Posts
        </a>
        <a
          href="#"
          className=" pl-4 pr-4 py-2  rounded-3xl font-semibold hover:underline "
        >
          Comments
        </a>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div
        onClick={() => {
          dispatch(setHeaderDropDownVisible(false));
        }}
        className="flex flex-row min-h-screen justify-between"
      >
        {/* LEFT SIDE BAR SECTION */}
        <div className=""></div>

        {/* 1. USER INTRODUCTION SECTION 2. POST SORTING SECTION 3. USER POSTFEED SECTION/COMMENTS SECTION */}
        <div className=" border-l border-r w-full bg-white px-8 pt-4  max-w-screen-lg">
          <UserIntroductionSection />
          <UserPageContentSelectionButtons />
          <UserPagePostFeed orderType={orderType} />
          <div></div>
        </div>

        {/* RIGHT SIDE BAR SECTION - USER PROFILE MAIN INFO SECTION */}
        <div className=""></div>
      </div>
    </>
  );
};

export default UserPage;
