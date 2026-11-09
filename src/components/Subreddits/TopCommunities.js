import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import JoinSubredditButton from "../Buttons/JoinSubredditButton";
import Axios from "../../shared/lib/axios";
import { useNavigate } from "react-router";
import DefaultSubredditIcon from "../../assets/icons/DefaultSubredditIcon";
import { HorizontalRule } from "@mui/icons-material";

const TopCommunities = () => {
  const [subreddits, setSubreddits] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const runUseEffectFunction = async () => {
      try {
        const res = await Axios.get(
          "/api/subreddits/leaderboards/top-subreddits",
        );
        setSubreddits(res.data);
      } catch (e) {
        setLoadFailed(true);
      }
    };
    runUseEffectFunction();
  }, []);

  const SkeletonRow = () => (
    <div className="border-b flex justify-between space-x-3 pr-3 items-center py-3 animate-pulse">
      <div className="flex items-center space-x-3 ml-5">
        <div className="w-3 h-4 bg-gray-200 rounded" />
        <div className="w-6 h-4 bg-gray-200 rounded" />
        <div className="h-8 w-8 rounded-full bg-gray-200" />
      </div>
      <div className="h-3 w-1/2 max-w-[100px] bg-gray-200 rounded" />
      <div className="h-7 w-16 rounded-full bg-gray-200" />
    </div>
  );

  const RankChangedIcon = ({ subreddit }) => {
    if (subreddit.rankChange < 0) {
      return <ChevronDownIcon className="h-6 text-red-400" />;
    } else if (subreddit.rankChange > 0) {
      return <ChevronUpIcon className="h-6 text-green-400" />;
    }

    return <HorizontalRule className="text-gray-450" />;
  };

  return (
    <div className=" bg-white rounded-t-sm relative border border-gray-300 min-w-[330px]">
      <div className=" h-20 bg-blue-600 rounded-t-sm flex items-end p-1 pl-4">
        <h3 className="text-white z-[11] font-semibold text-lg">
          Top Communities
        </h3>
        <div className="absolute top-0 left-0 z-10 h-20 w-full bg-gradient-to-t from-black to-white opacity-50 rounded-t-sm"></div>
      </div>
      <div>
        {loadFailed && (
          <p className="text-sm text-gray-500 text-center py-6">
            Couldn't load top communities.
          </p>
        )}
        {!loadFailed &&
          subreddits === null &&
          Array.from({ length: 10 }).map((_, i) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <SkeletonRow key={"skeleton-top-community-" + i} />
          ))}
        {subreddits?.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">
            No communities yet.
          </p>
        )}
        {subreddits?.slice(0, 10).map((subreddit, i) => {
          return (
            <div
              key={subreddit.name}
              className=" border-b flex justify-between space-x-3 pr-3 items-center py-3   font-semibold text-lg text-black"
            >
              <div className="flex items-center space-x-3 ml-5 ">
                <p className="w-3">{i + 1}</p>

                <RankChangedIcon subreddit={subreddit} />
                <div
                  onClick={() => {
                    navigate(`/r/${subreddit.name}`);
                  }}
                  className="rounded-full flex justify-center items-center overflow-hidden h-8 w-8 cursor-pointer"
                >
                  {subreddit.iconUrl ? (
                    <img src={subreddit.iconUrl} />
                  ) : (
                    <DefaultSubredditIcon />
                  )}
                </div>
              </div>
              <p
                onClick={() => {
                  navigate(`/r/${subreddit.name}`);
                }}
                className="text-xs w-1/2 truncate cursor-pointer max-w-[100px] overflow-hidden"
              >
                r/{subreddit.name}
              </p>
              <JoinSubredditButton subreddit={subreddit} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopCommunities;
