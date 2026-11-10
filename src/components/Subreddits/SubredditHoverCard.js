import { Link } from "react-router";
import { Skeleton } from "@mui/material";
import moment from "moment";
import HoverCard, { createCachedFetcher } from "../Shared/HoverCard";
import DefaultSubredditIcon from "../../assets/icons/DefaultSubredditIcon";
import JoinSubredditButton from "../Buttons/JoinSubredditButton";

const fetchCached = createCachedFetcher();

const SubredditInfoCardContent = ({
  subredditName,
  subredditData,
  status,
  onNavigate,
}) => (
  <div className="w-72">
    <div
      className="h-12 bg-blue-400"
      style={
        subredditData?.subredditPageBackgroundImageUrl
          ? {
              backgroundImage: `url(${subredditData.subredditPageBackgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    />
    <div className="px-3 pb-3">
      <div className="flex items-end space-x-2 -mt-5">
        <Link
          to={`/r/${subredditName}`}
          onClick={onNavigate}
          aria-label={`View r/${subredditName}`}
          className="h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-white bg-white flex items-center justify-center cursor-pointer"
        >
          {status === "loading" ? (
            <Skeleton variant="circular" width={48} height={48} />
          ) : subredditData?.iconUrl ? (
            <img src={subredditData.iconUrl} alt="" className="h-full w-full" />
          ) : (
            <DefaultSubredditIcon />
          )}
        </Link>
        <Link
          to={`/r/${subredditName}`}
          onClick={onNavigate}
          className="font-bold truncate pb-0.5 cursor-pointer hover:underline"
        >
          r/{subredditName}
        </Link>
      </div>

      {status === "loading" && (
        <div className="mt-3">
          <Skeleton height={20} />
          <Skeleton height={20} width="60%" />
        </div>
      )}

      {status === "error" && (
        <p className="mt-3 text-sm text-gray-500">
          Couldn't load this community's info.
        </p>
      )}

      {subredditData && (
        <>
          {subredditData.description && (
            <p className="mt-2 text-sm text-gray-700 line-clamp-3">
              {subredditData.description}
            </p>
          )}
          <div className="flex mt-3 space-x-6 text-sm">
            <div>
              <p className="font-semibold flex items-center">
                {subredditData.memberCount ?? 0}
              </p>
              <p className="text-xs text-gray-500">Members</p>
            </div>
            <div>
              <p className="font-semibold flex items-center">
                {moment(subredditData.createdAt).format("MMM D, YYYY")}
              </p>
              <p className="text-xs text-gray-500">Created</p>
            </div>
          </div>
        </>
      )}

      <div className="flex mt-3 space-x-2">
        <Link
          to={`/r/${subredditName}`}
          onClick={onNavigate}
          className="block text-center flex-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1.5"
        >
          View community
        </Link>
        {subredditData && <JoinSubredditButton subreddit={subredditData} />}
      </div>
    </div>
  </div>
);

const SubredditHoverCard = ({ subredditName, children }) => {
  if (!subredditName) return children;

  return (
    <HoverCard
      href={`/r/${subredditName}`}
      fetchData={() => fetchCached(`/api/subreddits/${subredditName}`)}
      renderPopupContent={({ data, status, close }) => (
        <SubredditInfoCardContent
          subredditName={subredditName}
          subredditData={data}
          status={status}
          onNavigate={close}
        />
      )}
    >
      {children}
    </HoverCard>
  );
};

export default SubredditHoverCard;
