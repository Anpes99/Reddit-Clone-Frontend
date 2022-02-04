import Header from "../components/Header";
import PostFeed from "../components/PostFeed";
import TrendingFeed from "../components/TrendingFeed";

import { useDispatch } from "react-redux";
import { setHeaderDropDownVisible } from "../slices/appSlice";

const HomePage = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Header />
      <main
        onClick={() => {
          dispatch(setHeaderDropDownVisible(false));
        }}
        className="max-w-screen-lg mx-auto md:p-5
    pt-3"
      >
        <TrendingFeed />
        <div>
          <PostFeed />
        </div>
      </main>
    </>
  );
};

export default HomePage;
