import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Header from "../components/Header";
import PostFeed from "../components/PostFeed";
import f1 from "../fake data/f1.png";
import { setCurrentSubreddit } from "../slices/appSlice";
import { useDispatch } from "react-redux";

import JoinSubredditButton from "../components/Buttons/JoinSubredditButton";

const SubredditPage = ({ orderType = "new" }) => {
  const dispatch = useDispatch();
  const subredditName = useParams().subredditName;

  const [subredditId, setSubredditId] = useState(null);
  useEffect(async () => {
    const res = await axios.get("/api/subreddits", {
      params: { name: subredditName },
    });
    setSubredditId(res.data[0].id);
    dispatch(setCurrentSubreddit(res.data[0]));
  }, [subredditName]);

  return (
    <div className="bg-gray-200 min-h-screen">
      <Header />
      <div>
        <div className="bg-blue-500 h-20"></div>
        <div className="bg-white h-[6rem]">
          <div className="max-w-screen-lg m-auto flex space-x-4">
            <div className="rounded-full h-20 w-20 overflow-hidden border-4 border-white -translate-y-5">
              <img src={f1} alt="" />
            </div>
            <div className="flex flex-col items-start space-y-1 py-2">
              <h2 className="font-bold text-lg">{subredditName}</h2>
              <p className="font-semibold text-xs text-gray-400">
                r/{subredditName}
              </p>
            </div>

            <JoinSubredditButton
              subreddit={{ name: subredditName, id: subredditId }}
            />
          </div>
        </div>
      </div>
      <main className="max-w-screen-lg m-auto">
        {subredditId && (
          <div>
            <PostFeed orderType={orderType} subredditId={subredditId} />
          </div>
        )}
      </main>
    </div>
  );
};

export default SubredditPage;
