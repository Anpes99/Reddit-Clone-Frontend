import axios from "axios";
import { useEffect, useState } from "react";
import TrendingFeedItem from "./TrendingFeedItem";

const TrendingFeed = (props) => {
  const [newsArticles, setNewsArticles] = useState(null);
  useEffect(() => {
    axios
      .get(`/api/news`)
      .then((res) => {
        setNewsArticles(res.data.articles);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className="w-full px-1">
      <p className=" font-medium text-gray-700">Trending today</p>
      <div className="grid grid-cols-4 sm:grid-cols-3 gap-3 py-4 md:grid-cols-4">
        <div className="  col-span-2 sm:col-auto">
          <TrendingFeedItem data={newsArticles ? newsArticles[0] : null} />
        </div>
        <div className=" col-span-2 sm:col-auto">
          <TrendingFeedItem data={newsArticles ? newsArticles[1] : null} />
        </div>
        <div className="  hidden sm:block">
          <TrendingFeedItem data={newsArticles ? newsArticles[2] : null} />
        </div>
        <div className=" hidden md:inline-block ">
          <TrendingFeedItem data={newsArticles ? newsArticles[3] : null} />
        </div>
      </div>
    </div>
  );
};

export default TrendingFeed;
