import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { UserIcon } from "@heroicons/react/outline";
import { ChevronDownIcon, MenuIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { useDispatch } from "react-redux";
import {
  setHeaderDropDownVisible,
  setUser,
  setLoginVisible,
  setSignUpVisible,
  setNavigationDrawerVisible,
  setNavigationDrawerOpenedFromHeader,
} from "../slices/appSlice";
import LoginForm from "./Forms/LoginForm";
import SignUpForm from "./Forms/SignUpForm";
import { Tooltip } from "@mui/material";

import _ from "lodash";
import RedditTextIcon from "../icons/RedditTextIcon";
import RedditIcon from "../icons/RedditIcon";
import HeaderOptionsDropDownList from "./HeaderOptionsDropDownList";
import UserSubredditsDropDownList from "./UserSubredditsDropDown";
import { useSearchParams } from "react-router-dom";
import Axios from "../utils/axios";

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

  const user = useSelector((state) => state.app.user);

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

  return (
    <>
      <div
        onClick={() => {
          if (dropDownVisible) {
            dispatch(setHeaderDropDownVisible(false));
          }
        }}
        className=" relative  lg:fixed lg:top-0 lg:left-0 w-full  sm:pb-0 flex sm:flex-row min-h-12 bg-white  items-center justify-between z-[150] pl-0 sm:pl-2 sm:space-x-2 border-b-[3px] "
      >
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
          onClick={() => navigate("/")}
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
                if (signUpVisible) dispatch(setSignUpVisible(false));
                dispatch(setLoginVisible(true));
              }}
              className={`hidden  ${
                user ? "" : "sm:inline-block"
              } btn hover:bg-blue-50 text-blue-500 border-blue-500`}
            >
              Log In
            </button>
          }
          {
            <button
              onClick={() => {
                localStorage.removeItem("loggedInRedditAppUser");
                dispatch(setUser(null));
              }}
              className={`hidden  ${
                user ? "sm:inline-block" : ""
              } btn hover:bg-blue-50 text-blue-500 border-blue-500 flex-shrink-0`}
            >
              Log Out
            </button>
          }
          <button
            onClick={() => {
              if (loginVisible) dispatch(setLoginVisible(true));
              dispatch(setSignUpVisible(true));
            }}
            className={` ${
              user ? "" : "sm:inline-block"
            } hidden  btn bg-blue-500 text-white  hover:bg-blue-400`}
          >
            Sign Up
          </button>
          <div
            onClick={() => {
              dispatch(setHeaderDropDownVisible(!dropDownVisible));
            }}
            className="px-2 rounded-sm md:px-4 flex items-center text-gray-400 border self-stretch border-gray-50 hover:border-gray-300 transition-all cursor-pointer"
          >
            <UserIcon className="h-5" />
            <ChevronDownIcon className="h-4 -ml-1" />
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
    </>
  );
};

export default Header;
