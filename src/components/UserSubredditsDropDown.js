import { HomeIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useSelector } from "react-redux";
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

const UserSubredditsDropDownList = ({}) => {
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

export default UserSubredditsDropDownList;
