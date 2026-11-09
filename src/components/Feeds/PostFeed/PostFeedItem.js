import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import PostVotingArrows from "./PostVotingArrows";
import { makeStringSafeForURL } from "../../../shared/utils/utils";
import {
  BookmarkAdd,
  ChatBubbleRounded,
  MoreHoriz,
  Reply,
} from "@mui/icons-material";
import DefaultSubredditIcon from "../../../assets/icons/DefaultSubredditIcon";
import Axios from "../../../shared/lib/axios";
import { addGlobalNotification } from "../../../app/slices/appSlice";
import { hasSubredditPermission } from "../../../config/moderator-permissions";
import { SubredditPermissions } from "../../../enums/subreddit.enum";

const MoreOptionsMenu = ({ onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeMenu = () => setAnchorEl(null);

  useEffect(() => {
    if (!anchorEl) return;

    window.addEventListener("scroll", closeMenu, {
      passive: true,
      capture: true,
    });
    return () =>
      window.removeEventListener("scroll", closeMenu, { capture: true });
  }, [anchorEl]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button
        aria-label="More options"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className="flex items-center hover:bg-gray-300"
      >
        <MoreHoriz />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        disableScrollLock
      >
        <MenuItem
          onClick={() => {
            closeMenu();
            setIsConfirmOpen(true);
          }}
          sx={{ color: "error.main" }}
        >
          Delete
        </MenuItem>
      </Menu>
      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        disableScrollLock
      >
        <DialogTitle>Delete this post?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const ActionsSection = ({ post, onDelete }) => {
  return (
    <div className="flex space-x-4 text-gray-450 font-bold pl-2 w-fit">
      <div className="flex  hover:bg-gray-300">
        <ChatBubbleRounded className=" mr-1" style={{ width: "20px" }} />
        <p>{post.commentCount}</p>
        <p className="hidden sm:inline-block ml-1">Comments</p>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex  hover:bg-gray-300"
      >
        <Reply className="scale-x-[-1]" />
        <p className="hidden sm:inline-block">Share</p>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex hover:bg-gray-300"
      >
        <BookmarkAdd className="mr-1" />
        <p className="hidden sm:inline-block">Save</p>
      </div>
      {onDelete ? (
        <MoreOptionsMenu onDelete={onDelete} />
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center hover:bg-gray-300"
        >
          <MoreHoriz />
        </div>
      )}
    </div>
  );
};

const PostFeedItem = ({ post }) => {
  const date = new Date(post.createdAt);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const [isDeleted, setIsDeleted] = useState(false);

  const isAuthor = !!user && user.username === post?.user?.username;
  const moderatorRole = user?.moderatedSubreddits?.find(
    (subreddit) => subreddit.name === post?.subreddit?.name,
  )?.role;
  const canDelete =
    isAuthor ||
    hasSubredditPermission(moderatorRole, SubredditPermissions.POSTS_MANAGE);

  const handleDeletePost = async () => {
    try {
      await Axios.delete(`/api/posts/${post.id}`);
      setIsDeleted(true);
      dispatch(
        addGlobalNotification({ type: "success", message: "Post deleted." }),
      );
    } catch (e) {
      if (e.response?.status !== 429) {
        dispatch(
          addGlobalNotification({
            type: "error",
            message: "Couldn't delete the post. Please try again.",
          }),
        );
      }
    }
  };

  if (isDeleted) return null;

  const onDelete = canDelete ? handleDeletePost : undefined;

  return (
    <div className=" flex flex-col sm:flex-row w-full    sm:h-min-content bg-white border mb-3  border-gray-300 p-0.5">
      <div className=" hidden sm:flex flex-col items-center bg-gray-50 w-20 p-1.5">
        <PostVotingArrows post={post} />
      </div>

      <div
        onClick={() => {
          navigate(
            `/r/${post?.subreddit?.name || "noName"}/comments/${post.id}/${
              makeStringSafeForURL(post?.title) || "noTitle"
            }`,
          );
        }}
        className="flex flex-col cursor-pointer w-full"
      >
        <div className="flex flex-col p-2">
          <div className="flex items-center space-x-2 ">
            <div className="inline-block flex justify-center items-center rounded-full overflow-hidden h-7 w-7">
              {post?.subreddit?.iconUrl ? (
                <img src={post?.subreddit?.iconUrl} alt="subreddit img" />
              ) : (
                <DefaultSubredditIcon />
              )}
            </div>
            <p className="inline mr-2 font-bold text-sm">
              r/{post?.subreddit?.name || "noName"}
            </p>
            <p className="inline text-xs text-gray-400">
              posted by u/{post?.user?.username || "noName"}{" "}
              {moment(date.getTime()).fromNow()}
            </p>
          </div>
          <div className="mt-2 font-semibold text-lg line-clamp-5">
            {post.title}
          </div>
        </div>
        <img
          className="block max-w-[40rem]  overflow-hidden  object-contain w-full m-auto"
          src={post?.imageUrl || null}
        />
        <div className=" hidden sm:block  pt-2  pb-1  w-fit pr-2">
          <ActionsSection post={post} onDelete={onDelete} />
        </div>
      </div>

      <div className="flex sm:hidden p-2 items-center">
        <PostVotingArrows post={post} />
        <ActionsSection post={post} onDelete={onDelete} />
      </div>
    </div>
  );
};

export default PostFeedItem;
