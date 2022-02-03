import axios from "axios";
import { useEffect, useState } from "react";
import TrendingFeedItem from "./TrendingFeedItem";

const TrendingFeed = (props) => {
  const [newsArticles, setNewsArticles] = useState(null);
  useEffect(() => {
    axios
      .get(`/api/news`)
      .then((res) => {
        console.log(res);
        setNewsArticles(res.data.articles);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className="w-full">
      <p className="pl-4 font-medium text-gray-700">Trending today</p>
      <div className="grid grid-cols-4 md:grid-cols-3 gap-3 py-4 lg:grid-cols-4">
        <div className="  col-span-4 sm:col-span-2 md:col-auto">
          <TrendingFeedItem data={newsArticles ? newsArticles[0] : null} />
        </div>
        <div className=" hidden sm:block col-span-2 md:col-auto">
          <TrendingFeedItem data={newsArticles ? newsArticles[1] : null} />
        </div>
        <div className="  hidden md:block">
          <TrendingFeedItem data={newsArticles ? newsArticles[2] : null} />
        </div>
        <div className=" hidden lg:inline-block ">
          <TrendingFeedItem data={newsArticles ? newsArticles[3] : null} />
        </div>
      </div>
    </div>
  );
};

export default TrendingFeed;
