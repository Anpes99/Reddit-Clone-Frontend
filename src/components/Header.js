import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { UserIcon } from "@heroicons/react/outline";
import { HomeIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { useDispatch } from "react-redux";
import {
  setHeaderDropDownVisible,
  setUser,
  setLoginVisible,
  setSignUpVisible,
} from "../slices/appSlice";
import Login from "./Login";
import SignUp from "./SignUp";
import { Tooltip } from "@mui/material";

import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import f1 from "../fake data/f1.png";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import _ from "lodash";
import axios from "axios";
import RedditTextIcon from "../icons/RedditTextIcon";
import RedditIcon from "../icons/RedditIcon";

const UserSubredditsDropDown = ({}) => {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.app.user);
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="relative">
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <div className="flex space-x-1 items-center text-black">
                <HomeIcon className="text-black h-8" />
                {open ? <ExpandLess /> : <ExpandMore />}
              </div>
            </ListItemIcon>
          </ListItemButton>

          <Collapse in={open} timeout="auto" unmountOnExit>
            <List
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  MY COMMUNITIES
                </ListSubheader>
              }
              component="div"
              disablePadding
              sx={{ position: "absolute", bgcolor: "background.paper" }}
            >
              {user?.subreddits.map((subreddit) => (
                <ListItemButton
                  onClick={() => {
                    window.location.href = `/r/${subreddit.name}`;
                  }}
                  key={subreddit.name}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <div className="rounded-full w-6 h-6 overflow-hidden">
                      <img src={f1} alt="" />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary={"r/" + subreddit.name} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </div>
    </ClickAwayListener>
  );
};

const Header = () => {
  const dropDownVisible = useSelector(
    (state) => state.app.headerDropDownVisible
  );
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const headerDropDownVisible = useSelector(
    (state) => state.app.headerDropDownVisible
  );
  const [searchResults, setSearchResults] = useState([]);

  const loginVisible = useSelector((state) => state.app.loginVisible);
  const signUpVisible = useSelector((state) => state.app.signUpVisible);

  const user = useSelector((state) => state.app.user);

  const handleSearchWordChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = _.debounce(async (word) => {
    if (!word) {
      setSearchResults([]);
      return;
    }

    const response = await axios.post("/api/search", { searchWord: word }, {});
    setSearchResults(response.data.result);
  }, 200);

  return (
    <>
      <div
        onClick={() => {
          if (dropDownVisible) {
            dispatch(setHeaderDropDownVisible(false));
          }
        }}
        className="relative pb-2 sm:pb-0 flex flex-col sm:flex-row min-h-12 bg-white  items-center justify-between z-[90] pl-0 sm:pl-2 sm:space-x-2"
      >
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
          {user && <UserSubredditsDropDown />}
        </div>
        <div className="w-full sm:w-auto flex flex-col border rounded-sm relative bg-gray-100 flex-grow">
          <SearchIcon className="hidden sm:inline-block pl-4 h-7 top-1/2 translate-y-[-50%] text-gray-400 absolute" />
          <input
            onChange={handleSearchWordChange}
            className="flex flex-grow bg-gray-100 p-2 text-gray-700 sm:pl-20 hover:bg-white focus:bg-white"
            placeholder="Search Reddit"
            type="text"
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

        <div className="flex items-center space-x-3 p-4">
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

        <div
          className={`flex right-0  top-[9rem] sm:top-14 w-full sm:w-auto ${
            dropDownVisible ? "" : "h-0 overflow-hidden"
          } absolute  flex-col bg-gray-50 text-sm font-medium select-none duration-200 z-[100]`}
        >
          <h4 className="p-2 text-xs text-gray-400">VIEW OPTIONS</h4>
          <a className="link">Dark Mode</a>
          <h4 className="p-2 text-xs text-gray-400">MORE STUFF</h4>
          <a className="link">Coins</a>
          <a className="link">Premium</a>
          <a className="link">Powerups</a>
          <a className="link">Talk</a>
          <a className="link">Predictions</a>
          <a className="link">Help Center</a>
          {!user && (
            <a
              onClick={() => {
                dispatch(setLoginVisible(true));
              }}
              className="link border-t"
            >
              Log In / Sign Up
            </a>
          )}

          {user && (
            <a
              onClick={() => {
                dispatch(setUser(null));
                localStorage.removeItem("loggedInRedditAppUser");
              }}
              className="link border-t"
            >
              Log Out
            </a>
          )}
        </div>
      </div>
      {loginVisible && (
        <div
          className={`${
            loginVisible ? "block" : "hidden"
          } fixed top-0 left-0 w-full h-full m-0 p-0 z-[1000]`}
        >
          <Login />
        </div>
      )}
      {signUpVisible && (
        <div
          className={`${
            signUpVisible ? "block" : "hidden"
          }  fixed top-0 left-0 w-full h-full m-0 p-0 z-[1000]`}
        >
          <SignUp />
        </div>
      )}
    </>
  );
};

export default Header;
