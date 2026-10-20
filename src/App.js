import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/Homepage";
import PostPage from "./pages/PostPage";
import { useEffect, useState } from "react";
import { setUser } from "./slices/appSlice";
import SubmitNewPostPage from "./pages/SubmitNewPostPage";
import SubredditPage from "./pages/SubredditPage";
import UserPage from "./pages/UserPage";
import SearchPage from "./pages/SearchPage";
import Header from "./components/Header";
import NavigationDrawer from "./components/NavigationDrawer";
import Axios from "./utils/axios";
import ScrollToTop from "./ScrollToTop";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const runUseEffectFunction = async () => {
      if (user) return;
      let result;
      try {
        result = await Axios.post("/api/auth/refresh");
      } catch (e) {
        setAuthInitialized(true);
        return;
      }
      const { accessToken, username } = result.data;

      const userResult = await Axios.get("/api/loggedInUser", {
        params: { username },
        headers: { Authorization: `bearer ${accessToken}` },
      });

      if (userResult.data)
        dispatch(setUser({ ...userResult.data, token: accessToken }));

      setAuthInitialized(true);
    };

    runUseEffectFunction();
  }, [user, dispatch]);
  return (
    <div className=" bg-gray-200">
      <Router>
        <ScrollToTop />
        <Header />
        <div className="w-full h-[var(--header-height)] hidden lg:block"></div>
        {authInitialized && (
          <div
            style={{
              position: "relative",
              display: "grid",
              alignItems: "start",
            }}
            className="grid-cols-[1fr] xl:grid-cols-[1fr_auto_1fr]"
          >
            <NavigationDrawer />

            <div
              style={{ justifySelf: "center" }}
              className="col-start-1 xl:col-start-2 w-full"
            >
              <Routes>
                <Route
                  path="/r/:subredditName/submit"
                  element={<SubmitNewPostPage />}
                />
                <Route
                  path="/r/:subredditName/comments/:postId/:postTitle"
                  element={<PostPage />}
                />
                <Route
                  path="/r/:subredditName/top"
                  element={<SubredditPage orderType={"top"} />}
                />
                <Route path="/r/:subredditName" element={<SubredditPage />} />
                <Route path="/top" element={<HomePage orderType={"top"} />} />
                <Route path="/user/:username" element={<UserPage />} />
                <Route path="/search/" element={<SearchPage />} />
                <Route path="/" element={<HomePage />} />
              </Routes>
            </div>
          </div>
        )}
      </Router>
    </div>
  );
};

export default App;
