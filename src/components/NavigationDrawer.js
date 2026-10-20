import {
  ChevronDownIcon,
  ChevronUpIcon,
  MenuIcon,
} from "@heroicons/react/solid";
import "./NavigationDrawer.css";
import { useEffect, useState } from "react";
import {
  Article,
  Book,
  Campaign,
  Code,
  Groups,
  Help,
  HouseOutlined,
  QuestionAnswer,
  Reddit,
  Rocket,
  Share,
  TrendingUp,
  Work,
  WorkspacePremium,
  Workspaces,
} from "@mui/icons-material";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/solid";
import CreateCommunityForm from "./Forms/CreateCommunityForm";
import { useDispatch, useSelector } from "react-redux";
import {
  setNavigationDrawerOpenedFromHeader,
  setNavigationDrawerVisible,
} from "../slices/appSlice";

const NavigationDrawer = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.app.navigationDrawerVisible);
  const [isVisibleCreateCommunityForm, setIsVisibleCreateCommunityForm] =
    useState(false);
  const user = useSelector((state) => state.app.user);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const ResourcesDropDownList = () => {
    const [isVisibleResources, setIsVisibleResources] = useState(false);

    return (
      <div className="border-b-2 pt-5 pb-2">
        <button
          onClick={() => {
            setIsVisibleResources(!isVisibleResources);
          }}
          className=" font font-semibold flex items-center justify-between w-full hover:bg-gray-100 p-2 rounded-lg"
        >
          <p className="text-gray-400">RESOURCES</p>
          {isVisibleResources && <ChevronUpIcon className="h-4 -ml-1" />}
          {!isVisibleResources && <ChevronDownIcon className="h-4 -ml-1" />}
        </button>
        <div style={{ display: isVisibleResources ? "block" : "none" }}>
          <Link
            to={""}
            className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
          >
            <Reddit />
            <p>About Reddit</p>
          </Link>
          <Link
            to={""}
            className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
          >
            <Campaign />
            <p>Advertise</p>
          </Link>
          <Link
            to={""}
            className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
          >
            <Code />
            <p>Developer Platform</p>
          </Link>
          <Link
            to={""}
            className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
          >
            <WorkspacePremium />
            <p>Reddit Pro</p>
          </Link>
          <Link
            to={""}
            className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
          >
            <Help />
            <p>Help</p>
          </Link>
          <Link
            to={""}
            className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
          >
            <Book />
            <p>Blog</p>
          </Link>
          <Link
            to={""}
            className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
          >
            <Work />
            <p>Careers</p>
          </Link>
          <Link
            to={""}
            className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
          >
            <Article />
            <p>Press</p>
          </Link>
        </div>
      </div>
    );
  };

  const [isMobile, setIsMobile] = useState(false);
  const navigationDrawerOpenedFromHeader = useSelector(
    (state) => state.app.navigationDrawerOpenedFromHeader,
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1280px)");
    const update = () => setIsMobile(media.matches);

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      if (!isMounted) {
        setIsMounted(true);
        return;
      }
      dispatch(setNavigationDrawerVisible(false));
    } else {
      dispatch(setNavigationDrawerVisible(true));
      dispatch(setNavigationDrawerOpenedFromHeader(false));
      document.body.style.overflow = "";
    }
    setIsMounted(true);
  }, [isMobile]);

  return (
    <>
      <CreateCommunityForm
        isVisible={isVisibleCreateCommunityForm}
        closeForm={() => setIsVisibleCreateCommunityForm(false)}
      />
      {navigationDrawerOpenedFromHeader && (
        <div
          onClick={() => {
            dispatch(setNavigationDrawerVisible(false));
            dispatch(setNavigationDrawerOpenedFromHeader(false));
            document.body.style.overflow = "";
            setIsVisibleCreateCommunityForm(false);
          }}
          className="fixed top-0 left-0  h-full w-full bg-black opacity-60 z-20 "
        ></div>
      )}
      <div
        className={`NavigationDrawerContainer text-gray-500 font-semibold ${!isVisible ? "NavigationDrawerContainer--closed" : ""}`}
      >
        <div
          onClick={() => {
            dispatch(setNavigationDrawerVisible(!isVisible));
          }}
          className="hidden xl:block absolute right-0 top-5 translate-x-[50%] bg-white rounded-full border-4 border-gray-400 p-1 w-min cursor-pointer"
        >
          <MenuIcon className="text-gray-400" style={{ height: "20px" }} />
        </div>
        <div className="NavigationDrawerScrollArea">
          <div className="pt-5 pl-7 pr-9">
            <div className="flex flex-col   pb-2 border-b-2">
              <Link
                to={"/"}
                className={`flex space-x-2  cursor-pointer py-3 pl-4 rounded-lg ${isHomePage ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <HouseOutlined />
                <p>Home</p>
              </Link>
              <Link
                to={""}
                className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
              >
                <TrendingUp />
                <p>Popular</p>
              </Link>
              <Link
                to={""}
                className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
              >
                <QuestionAnswer />
                <p>Answers</p>
              </Link>
              <Link
                to={""}
                className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
              >
                <Workspaces />
                <p>Explore</p>
              </Link>

              {user && (
                <button
                  onClick={() => {
                    setIsVisibleCreateCommunityForm(true);
                  }}
                  className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
                >
                  <PlusIcon className="h-[24px]" />
                  <p>Create community</p>
                </button>
              )}
            </div>
            <ResourcesDropDownList />
            <div className="pt-2">
              <Link
                to={""}
                className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
              >
                <Groups />
                <p>Communities</p>
              </Link>{" "}
              <Link
                to={""}
                className="flex space-x-2 hover:bg-gray-100 cursor-pointer py-3 pl-4 rounded-lg"
              >
                <Rocket />
                <p>Best of Reddit</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationDrawer;
