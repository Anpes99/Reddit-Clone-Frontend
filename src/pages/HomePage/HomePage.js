import PostFeed from "../../components/Feeds/PostFeed/PostFeed";
import TrendingFeed from "./components/TrendingFeed/TrendingFeed";

import { useDispatch } from "react-redux";
import { setHeaderDropDownVisible } from "../../app/slices/appSlice";

const HomePage = ({ orderType = "new" }) => {
  const dispatch = useDispatch();

  return (
    <>
      <div
        onClick={() => {
          dispatch(setHeaderDropDownVisible(false));
        }}
        className="flex"
      >
        <div className="flex-grow flex-shrink"></div>
        <main className="w-full xl:w-[1024px]  xl:max-w-full mx-auto md:p-5 pt-3">
          <TrendingFeed />
          <PostFeed orderType={orderType} />
        </main>
        <div className="flex-grow flex-shrink"></div>
      </div>
    </>
  );
};

export default HomePage;
