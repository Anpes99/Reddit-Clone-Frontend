import {
  ChevronDownIcon,
  ChevronUpIcon,
  MenuIcon,
} from "@heroicons/react/solid";
import "./NavigationDrawer.css";
import { useState } from "react";
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

const NavigationDrawer = () => {
  const [isVisible, setIsVisible] = useState(true);

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

  return (
    <div
      className={`NavigationDrawerContainer ${!isVisible ? "NavigationDrawerContainer--closed" : ""}`}
    >
      <div
        onClick={() => {
          setIsVisible(!isVisible);
          console.log(isVisible);
        }}
        className="absolute right-0 top-5 translate-x-[50%] bg-white rounded-full border-4 border-gray-400 p-1 w-min cursor-pointer"
      >
        <MenuIcon className="text-gray-400" style={{ height: "20px" }} />
      </div>
      <div className="pt-5 pl-7 pr-9">
        <div className="flex flex-col  text-gray-500 font-semibold pb-2 border-b-2">
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
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};

export default NavigationDrawer;
