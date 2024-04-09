import { ChevronUpIcon } from "@heroicons/react/solid";
import f1 from "../fake data/f1.png";
import { useEffect, useState } from "react";
import axios from "axios";
import JoinSubredditButton from "./Buttons/JoinSubredditButton";

const TopCommunities = () => {
  const [subreddits, setSubreddits] = useState(null);

  useEffect(async () => {
    const res = await axios.get("/api/subreddits");

    console.log(res);
    setSubreddits(res.data);
  }, []);

  return (
    <div className=" bg-white rounded-t-sm relative border border-gray-300">
      <div className=" h-20 bg-blue-600 rounded-t-sm flex items-end p-1 pl-4">
        <h3 className="text-white z-20 font-semibold text-lg">
          Top Communities
        </h3>
        <div className="absolute top-0 left-0 z-10 h-20 w-full bg-gradient-to-t from-black to-white opacity-50 rounded-t-sm"></div>
      </div>
      <div>
        {subreddits?.map((subreddit, i) => {
          return (
            <div
              key={subreddit.name}
              className=" border-b flex justify-between space-x-3 pr-3 items-center py-3   font-semibold text-lg text-black"
            >
              <div className="flex items-center space-x-3 ml-5 ">
                <p className="w-3">1</p>
                <ChevronUpIcon className="h-6 text-green-400" />
                <div
                  onClick={() =>
                    (window.location.href = `/r/${subreddit.name}`)
                  }
                  className="rounded-full overflow-hidden h-8 w-8 cursor-pointer"
                >
                  <img src={f1} />
                </div>
              </div>
              <p
                onClick={() => (window.location.href = `/r/${subreddit.name}`)}
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
