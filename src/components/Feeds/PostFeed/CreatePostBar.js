import { UserIcon } from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setLoginVisible } from "../../../app/slices/appSlice";
import UserAvatarImg from "../../Users/UserAvatarImg";

const CreatePostBar = () => {
  const user = useSelector((state) => state.app.user);
  const subredditName = useSelector(
    (state) => state.app.currentSubreddit?.name,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!subredditName) return null;

  return (
    <div className="flex items-center gap-3 bg-white p-3 mb-2 border border-gray-300 w-full">
      {user?.avatarImageUrl ? (
        <UserAvatarImg url={user.avatarImageUrl} size={38} />
      ) : (
        <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
          <UserIcon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <button
        type="button"
        onClick={
          user
            ? () => navigate(`/r/${subredditName}/submit`)
            : () => dispatch(setLoginVisible(true))
        }
        className="flex-grow min-w-0 truncate rounded border border-gray-200 bg-gray-50 px-4 py-2 text-left text-sm text-gray-500 transition-colors hover:border-blue-500 hover:bg-white "
      >
        Create a post in r/{subredditName}
      </button>
    </div>
  );
};

export default CreatePostBar;
