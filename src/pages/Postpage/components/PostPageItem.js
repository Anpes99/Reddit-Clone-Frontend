import { ChatIcon, PencilIcon, TrashIcon } from "@heroicons/react/outline";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import TextareaAutosize from "react-textarea-autosize";
import Axios from "../../../shared/lib/axios";
import { addGlobalNotification } from "../../../app/slices/appSlice";
import PostVotingArrows from "../../../components/Feeds/PostFeed/PostVotingArrows";
import UserHoverCard from "../../../components/Users/UserHoverCard";
import DefaultSubredditIcon from "../../../assets/icons/DefaultSubredditIcon";
import SubredditHoverCard from "../../../components/Subreddits/SubredditHoverCard";
import { hasSubredditPermission } from "../../../config/moderator-permissions";
import { SubredditPermissions } from "../../../enums/subreddit.enum";

const PostPageMainInfoSection = ({ post, onPostUpdated }) => {
  const date = new Date(post?.createdAt);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const navigate = useNavigate();
  const isAuthor = !!user && user.username === post?.user?.username;
  const moderatorRole = user?.moderatedSubreddits?.find(
    (subreddit) => subreddit.name === post?.subreddit?.name,
  )?.role;
  const canDelete =
    isAuthor ||
    hasSubredditPermission(moderatorRole, SubredditPermissions.POSTS_MANAGE);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await Axios.delete(`/api/posts/${post.id}`);
      dispatch(
        addGlobalNotification({ type: "success", message: "Post deleted." }),
      );
      navigate(post?.subreddit?.name ? `/r/${post.subreddit.name}` : "/");
    } catch (e) {
      if (e.response?.status !== 429) {
        dispatch(
          addGlobalNotification({
            type: "error",
            message: "Couldn't delete the post. Please try again.",
          }),
        );
      }
      setDeleting(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  const startEditing = () => {
    setEditText(post.text || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await Axios.patch(`/api/posts/${post.id}`, {
        text: editText,
      });
      onPostUpdated?.({ text: res.data.post.text });
      setIsEditing(false);
      dispatch(
        addGlobalNotification({ type: "success", message: "Post updated." }),
      );
    } catch (e) {
      if (e.response?.status !== 429) {
        dispatch(
          addGlobalNotification({
            type: "error",
            message: "Couldn't update the post. Please try again.",
          }),
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const canSave =
    !saving && editText.trim().length > 0 && editText !== post.text;
  return (
    <div className="flex flex-col sm:flex-row w-full max-w-[40rem]  bg-white  mb-4">
      <div className=" hidden sm:flex flex-col items-center  w-25">
        <PostVotingArrows post={post} />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex flex-col p-2">
          <div className="flex items-center space-x-2 ">
            <SubredditHoverCard subredditName={post?.subreddit?.name}>
              <div className="inline-block flex justify-center items-center rounded-full overflow-hidden h-7 w-7 cursor-pointer flex-shrink-0">
                {post?.subreddit?.iconUrl ? (
                  <img src={post?.subreddit?.iconUrl} alt="subreddit img" />
                ) : (
                  <DefaultSubredditIcon />
                )}
              </div>
            </SubredditHoverCard>
            <SubredditHoverCard subredditName={post?.subreddit?.name}>
              <p className="inline mr-2 font-bold text-sm cursor-pointer">
                r/{post?.subreddit?.name || "noName"}
              </p>
            </SubredditHoverCard>
            <p className="inline text-xs text-gray-400">
              posted by{" "}
              <UserHoverCard username={post?.user?.username}>
                u/{post?.user?.username || "noName"}
              </UserHoverCard>{" "}
              {moment(date.getTime()).fromNow()}
            </p>
          </div>
          <div className="mt-2 font-semibold text-lg">{post.title}</div>
        </div>
        <div className="flex flex-col items-center w-full overflow-hidden self-stretch">
          {post.imageUrl && (
            <img
              alt="post img"
              className="block max-w-40rem w-full object-contain pb-5"
              src={post.imageUrl}
            />
          )}
          {isEditing ? (
            <div className="self-stretch">
              <TextareaAutosize
                value={editText}
                onChange={(event) => setEditText(event.target.value)}
                maxLength={40000}
                autoFocus
                className="w-full px-3 pt-2 border min-h-[6rem]"
              />
              <div className="flex justify-end space-x-2 mt-1">
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="px-3 py-1 text-gray-500 font-semibold hover:bg-gray-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!canSave}
                  className={`${
                    canSave
                      ? ""
                      : "bg-gray-300 text-gray-400 hover:bg-gray-300 cursor-default"
                  } join-btn`}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            post.text && (
              <p className="self-start whitespace-pre-wrap break-words">
                {post.text}
              </p>
            )
          )}
        </div>
        <div className="flex text-gray-400 items-center text-xs space-x-1 p-1">
          <p className="p-2 py-3">
            <ChatIcon className="w-6 h-6 inline mr-0.5 " /> {post.commentCount}{" "}
            Comments
          </p>
          {isAuthor && !isEditing && (
            <button
              onClick={startEditing}
              className="flex items-center p-2 py-3 hover:bg-gray-100 rounded"
            >
              <PencilIcon className="w-5 h-5 inline mr-0.5" /> Edit
            </button>
          )}
          {canDelete && !isEditing && (
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="flex items-center p-2 py-3 hover:bg-gray-100 rounded"
            >
              <TrashIcon className="w-5 h-5 inline mr-0.5" /> Delete
            </button>
          )}
          <Dialog
            open={isDeleteConfirmOpen}
            onClose={() => {
              if (!deleting) setIsDeleteConfirmOpen(false);
            }}
            disableScrollLock
          >
            <DialogTitle>Delete this post?</DialogTitle>
            <DialogActions>
              <Button
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button color="error" onClick={handleDelete} disabled={deleting}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PostPageMainInfoSection;
