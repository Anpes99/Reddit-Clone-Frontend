import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { UserIcon } from "@heroicons/react/outline";
import { ChevronDownIcon, MenuIcon } from "@heroicons/react/solid";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { useDispatch } from "react-redux";
import {
  setHeaderDropDownVisible,
  setLoginVisible,
  setSignUpVisible,
  setNavigationDrawerVisible,
  setNavigationDrawerOpenedFromHeader,
  removeGlobalNotification,
} from "../../../app/slices/appSlice";
import LoginForm from "../../Forms/Login/LoginForm";
import SignUpForm from "../../Forms/SignUp/SignUpForm";
import { Alert, AlertTitle, Tooltip } from "@mui/material";

import _ from "lodash";
import RedditTextIcon from "../../../assets/icons/RedditTextIcon";
import RedditIcon from "../../../assets/icons/RedditIcon";
import HeaderOptionsDropDownList from "./HeaderOptionsDropDownList";
import UserSubredditsDropDownList from "./UserSubredditsDropDown";
import { useSearchParams } from "react-router-dom";
import Axios from "../../../shared/lib/axios";
import UserAvatarImg from "../../Users/UserAvatarImg";
import EmailVerificationModal from "../../Forms/EmailVerification/EmailVerificationModal";
import ForgottenPasswordModal from "../../Forms/ForgottenPassword/ForgottenPasswordModal";
import useLogout from "../../../hooks/useLogout";

const Header = () => {
  const dropDownVisible = useSelector(
    (state) => state.app.headerDropDownVisible,
  );
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchResults, setSearchResults] = useState([]);

  const loginVisible = useSelector((state) => state.app.loginVisible);
  const signUpVisible = useSelector((state) => state.app.signUpVisible);
  const forgottenPasswordModalVisible = useSelector(
    (state) => state.app.forgottenPasswordModalVisible,
  );
  const emailVerificationModal = useSelector(
    (state) => state.app.emailVerificationModal,
  );

  const user = useSelector((state) => state.app.user);

  const [logout] = useLogout();

  const globalNotifications = useSelector(
    (state) => state.app.globalNotifications,
  );

  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("searchquery");
  const [searchWord, setSearchWord] = useState(searchQuery || "");

  const handleSearchWordChange = (e) => {
    setSearchWord(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = _.debounce(async (word) => {
    if (!word) {
      setSearchResults([]);
      return;
    }

    const response = await Axios.post(
      "/api/search/suggestions",
      { searchWord: word },
      {},
    );
    setSearchResults(response.data.result);
  }, 200);
  const navigationDrawerVisible = useSelector(
    (state) => state.app.navigationDrawerVisible,
  );

  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let rafId = 0;

    const update = () => {
      rafId = 0;
      document.documentElement.style.setProperty(
        "--header-offset-from-viewport-top",
        `${header.getBoundingClientRect().top}px`,
      );
    };

    const scheduleUpdate = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver((entries) => {
      const resizedHeader = entries[0];
      const newHeaderHeight = resizedHeader.contentRect.height;
      document.documentElement.style.setProperty(
        "--header-height",
        newHeaderHeight + "px",
      );
    });
    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        onClick={() => {
          if (dropDownVisible) {
            dispatch(setHeaderDropDownVisible(false));
          }
        }}
        ref={headerRef}
        className=" relative  lg:fixed lg:top-0 lg:left-0 w-full  sm:pb-0 flex sm:flex-row min-h-12 bg-white  items-center justify-between z-[150] pl-0 sm:pl-2 sm:space-x-2 border-b-[3px] "
      >
        {globalNotifications.length ? (
          <div className="fixed right-4 top-[calc(var(--header-height)+12px)] z-[2000] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
            {globalNotifications.map((notification, i) => (
              <Alert
                key={notification.id}
                onClose={() => {
                  dispatch(removeGlobalNotification({ id: notification.id }));
                }}
                severity={notification.type}
                variant="filled"
                className="mt-3"
              >
                {notification.type === "error" && (
                  <AlertTitle>Something went wrong</AlertTitle>
                )}
                {notification.message}
              </Alert>
            ))}
          </div>
        ) : (
          <></>
        )}
        <button
          onClick={() => {
            dispatch(
              setNavigationDrawerOpenedFromHeader(
                navigationDrawerVisible ? false : true,
              ),
            );
            if (navigationDrawerVisible) {
              document.body.style.overflow = "";
            } else {
              document.body.style.overflow = "hidden";
            }

            dispatch(setNavigationDrawerVisible(!navigationDrawerVisible));
          }}
          className="xl:hidden ml-3 mr-1"
        >
          <MenuIcon className="text-gray-400" style={{ height: "25px" }} />
        </button>

        <div
          onClick={() => (window.location.href = "/")}
          className=" h-full flex items-center space-x-1 cursor-pointer"
        >
          <RedditIcon />
          <div className="hidden md:inline">
            <RedditTextIcon />
          </div>
        </div>
        <div className="hidden sm:block">
          {user && <UserSubredditsDropDownList />}
        </div>
        <div className="w-full sm:w-auto flex flex-col border rounded-sm relative bg-gray-100 basis-full flex-shrink min-w-0">
          <SearchIcon className="hidden sm:inline-block pl-4 h-7 top-1/2 translate-y-[-50%] text-gray-400 absolute" />
          <input
            value={searchWord}
            onChange={handleSearchWordChange}
            className="flex flex-grow bg-gray-200 p-2 text-gray-700 placeholder:text-gray-500 sm:pl-20 hover:bg-white focus:bg-white min-w-0"
            placeholder="Search Reddit"
            type="text"
            maxLength={500}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchWord.length) {
                window.location.href = `/search?type=posts&sort=TOP&searchquery=${searchWord}`;
              }
            }}
          />
          {searchResults.length ? (
            <>
              <div className="p-2 bg-white border-t border-gray-200 absolute w-full top-full">
                <div className="text-sm text-gray-500">Search suggestions:</div>
                <ul className="mt-1 space-y-1">
                  {searchResults.map((searchResult) => (
                    <>
                      <li
                        onClick={() => {
                          window.location.href = `/r/${searchResult.name}`;
                        }}
                        className="cursor-pointer hover:underline"
                      >
                        {searchResult.name}
                      </li>
                    </>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="flex items-center space-x-3 p-4 sm:pr-10">
          {currentSubreddit && (
            <Tooltip title="Submit a new post">
              <button
                onClick={
                  user
                    ? () => navigate(`/r/${currentSubreddit.name}/submit`)
                    : () => dispatch(setLoginVisible(true))
                }
                className="h-7 w-7 text-gray-400 hover:bg-gray-300"
              >
                <PlusIcon />
              </button>
            </Tooltip>
          )}
          {
            <button
              onClick={() => {
                if (signUpVisible) {
                  dispatch(setSignUpVisible(false));
                }
                dispatch(setLoginVisible(true));
              }}
              className={`hidden  ${
                user ? "" : "sm:inline-block"
              } btn hover:bg-blue-50 text-blue-500 border-blue-500 `}
            >
              <p className="whitespace-nowrap">Log In</p>
            </button>
          }
          {
            <button
              onClick={logout}
              className={`hidden  ${
                user ? "sm:inline-block" : ""
              } btn hover:bg-blue-50 text-blue-500 border-blue-500 flex-shrink-0`}
            >
              <p className="whitespace-nowrap">Log Out</p>
            </button>
          }
          <button
            onClick={() => {
              if (loginVisible) {
                dispatch(setLoginVisible(false));
              }
              dispatch(setSignUpVisible(true));
            }}
            className={` ${
              user ? "" : "sm:inline-block"
            } hidden  btn bg-blue-500 text-white  hover:bg-blue-400`}
          >
            <p className="whitespace-nowrap">Sign Up</p>
          </button>
          <div
            onClick={() => {
              dispatch(setHeaderDropDownVisible(!dropDownVisible));
            }}
            className="min-w-max px-2 rounded-sm md:px-4 flex items-center text-gray-400 border self-stretch border-gray-50 hover:border-gray-300 transition-all cursor-pointer"
          >
            {user ? (
              <UserAvatarImg url={user.avatarImageUrl} size={"30px"} />
            ) : (
              <>
                <UserIcon className="h-5" />
                <ChevronDownIcon className="h-4 -ml-1" />
              </>
            )}
          </div>
        </div>

        <HeaderOptionsDropDownList isVisible={dropDownVisible} />
      </div>
      {loginVisible && (
        <div
          className={`${
            loginVisible ? "block" : "hidden"
          } fixed top-0 left-0 w-full h-full m-0 p-0 z-[1000]`}
        >
          <LoginForm />
        </div>
      )}
      {signUpVisible && (
        <div
          className={`${
            signUpVisible ? "block" : "hidden"
          }  fixed top-0 left-0 w-full h-full m-0 p-0 z-[1000]`}
        >
          <SignUpForm />
        </div>
      )}
      {emailVerificationModal?.isVisible && (
        <div
          className={`${
            emailVerificationModal.isVisible ? "block" : "hidden"
          }  fixed top-0 left-0 w-full h-full m-0 p-0 z-[1000]`}
        >
          <EmailVerificationModal email={emailVerificationModal.email} />
        </div>
      )}
      {forgottenPasswordModalVisible && <ForgottenPasswordModal />}
    </>
  );
};

export default Header;
