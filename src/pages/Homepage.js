import Header from "../components/Header";
import PostFeed from "../components/PostFeed";
import TrendingFeed from "../components/TrendingFeed";

const HomePage = () => {
  return (
    <>
      <Header />
      <main
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
