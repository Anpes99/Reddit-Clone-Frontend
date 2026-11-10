import { ChevronDownIcon, MenuIcon } from "@heroicons/react/solid";
import "./NavigationDrawer.css";
import { useEffect, useMemo, useState } from "react";
import { HouseOutlined } from "@mui/icons-material";
import { useLocation, Link } from "react-router";
import { PlusIcon } from "@heroicons/react/solid";
import CreateCommunityForm from "../../Forms/CreateCommunityForm";
import DefaultSubredditIcon from "../../../assets/icons/DefaultSubredditIcon";
import Axios from "../../../shared/lib/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoginVisible,
  setNavigationDrawerOpenedFromHeader,
  setNavigationDrawerVisible,
  setSignUpVisible,
} from "../../../app/slices/appSlice";

const CommunitiesSection = ({ title, subreddits }) => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const currentSubredditName = decodeURIComponent(
    location.pathname.match(/^\/r\/([^/]+)/)?.[1] ?? "",
  ).toLowerCase();

  return (
    <div className="pt-5 pb-2 border-b-2">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center justify-between w-full hover:bg-gray-100 p-2 rounded-lg"
      >
        <p className="text-gray-400">{title}</p>
        <ChevronDownIcon
          className={`h-4 -ml-1 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <ul
          className={`overflow-hidden transition-opacity duration-300 ${expanded ? "opacity-100" : "opacity-0"}`}
          // React 18 needs inert as a string; switch to inert={!expanded} on React 19
          inert={expanded ? undefined : "inert"}
        >
          {subreddits.map((subreddit) => {
            const isCurrentSubreddit =
              subreddit.name.toLowerCase() === currentSubredditName;
            return (
              <li key={subreddit.id}>
                <Link
                  to={`/r/${subreddit.name}`}
                  aria-current={isCurrentSubreddit ? "page" : undefined}
                  className={`flex items-center space-x-2 py-2 pl-4 rounded-lg ${isCurrentSubreddit ? "bg-gray-200" : "hover:bg-gray-100"}`}
                >
                  <span className="h-6 w-6 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
                    {subreddit.iconUrl ? (
                      <img
                        src={subreddit.iconUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <DefaultSubredditIcon />
                    )}
                  </span>
                  <p className="truncate min-w-0">r/{subreddit.name}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const TOP_COMMUNITIES_SHOWN = 5;

const TopCommunitiesSection = () => {
  const [subreddits, setSubreddits] = useState([]);

  useEffect(() => {
    let cancelled = false;
    Axios.get("/api/subreddits/leaderboards/top-subreddits")
      .then((res) => {
        if (!cancelled) setSubreddits(res.data.slice(0, TOP_COMMUNITIES_SHOWN));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!subreddits.length) return null;
  return <CommunitiesSection title="TOP COMMUNITIES" subreddits={subreddits} />;
};

const SignUpPrompt = () => {
  const dispatch = useDispatch();
  return (
    <div className="mt-5 p-4 rounded-lg bg-gray-100 text-sm">
      <p className="text-gray-700 mb-3">
        Join communities, post, vote and comment
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            dispatch(setSignUpVisible(false));
            dispatch(setLoginVisible(true));
          }}
          className="btn flex-1 hover:bg-blue-50 text-blue-500 border-blue-500"
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => {
            dispatch(setLoginVisible(false));
            dispatch(setSignUpVisible(true));
          }}
          className="btn flex-1 bg-blue-500 text-white hover:bg-blue-400"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

const NavigationDrawer = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.app.navigationDrawerVisible);
  const [isVisibleCreateCommunityForm, setIsVisibleCreateCommunityForm] =
    useState(false);
  const user = useSelector((state) => state.app.user);

  const joinedSubreddits = useMemo(
    () =>
      [...(user?.subreddits ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      ),
    [user?.subreddits],
  );

  const location = useLocation();
  const isHomePage = ["/", "/top"].includes(location.pathname);

  const [isMobile, setIsMobile] = useState("not-initialized");
  const navigationDrawerOpenedFromHeader = useSelector(
    (state) => state.app.navigationDrawerOpenedFromHeader,
  );

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
    if (isMobile === "not-initialized") return;
    if (isMobile) {
      dispatch(setNavigationDrawerVisible(false));
    } else {
      dispatch(setNavigationDrawerVisible(true));
      dispatch(setNavigationDrawerOpenedFromHeader(false));
      document.body.style.overflow = "";
    }
  }, [isMobile, dispatch]);

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
                to={isHomePage ? location.pathname : "/"}
                className={`flex space-x-2  cursor-pointer py-3 pl-4 rounded-lg ${isHomePage ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <HouseOutlined />
                <p>Home</p>
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
            {user ? (
              joinedSubreddits.length > 0 && (
                <CommunitiesSection
                  title="COMMUNITIES"
                  subreddits={joinedSubreddits}
                />
              )
            ) : (
              <>
                <TopCommunitiesSection />
                <SignUpPrompt />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationDrawer;
