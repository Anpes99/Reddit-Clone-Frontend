import { Link } from "react-router";
import { Skeleton } from "@mui/material";
import moment from "moment";
import HoverCard, { createCachedFetcher } from "../Shared/HoverCard";
import UserAvatarImg from "./UserAvatarImg";

const fetchCached = createCachedFetcher();

const UserInfoCardContent = ({ username, userData, status, onNavigate }) => (
  <div className="w-64 p-3">
    <div className="flex items-center space-x-3">
      <Link
        to={`/user/${username}`}
        onClick={onNavigate}
        aria-label={`View u/${username}'s profile`}
        className="block h-12 w-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 cursor-pointer"
      >
        {userData ? (
          <UserAvatarImg url={userData.avatarImageUrl} size={"100%"} />
        ) : (
          <Skeleton variant="circular" width={48} height={48} />
        )}
      </Link>
      <div className="min-w-0">
        <Link
          to={`/user/${username}`}
          onClick={onNavigate}
          className="block font-bold truncate hover:underline"
        >
          u/{username}
        </Link>
        {userData && (
          <p className="text-xs text-gray-500">
            Joined {moment(userData.createdAt).format("MMM D, YYYY")}
          </p>
        )}
      </div>
    </div>

    {status === "loading" && (
      <div className="mt-3">
        <Skeleton height={20} />
        <Skeleton height={20} width="60%" />
      </div>
    )}

    {status === "error" && (
      <p className="mt-3 text-sm text-gray-500">
        Couldn't load this user's info.
      </p>
    )}

    {userData && (
      <>
        {userData.introduction && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">
            {userData.introduction}
          </p>
        )}
        <div className="flex mt-3 space-x-6 text-sm">
          <div>
            <p className="font-semibold flex items-center">
              {userData.karma ?? 0}
            </p>
            <p className="text-xs text-gray-500">Karma</p>
          </div>
        </div>
      </>
    )}

    <Link
      to={`/user/${username}`}
      onClick={onNavigate}
      className="block text-center mt-3 w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1.5"
    >
      View profile
    </Link>
  </div>
);

const UserHoverCard = ({ username, children }) => {
  if (!username) return children ?? "u/noName";

  return (
    <HoverCard
      href={`/user/${username}`}
      fetchData={() => fetchCached(`/api/users/${username}`)}
      renderPopupContent={({ data, status, close }) => (
        <UserInfoCardContent
          username={username}
          userData={data}
          status={status}
          onNavigate={close}
        />
      )}
    >
      {children ?? `u/${username}`}
    </HoverCard>
  );
};

export default UserHoverCard;
