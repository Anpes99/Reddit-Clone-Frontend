import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "../pages/HomePage/HomePage";
import PostPage from "../pages/Postpage/PostPage";
import { useEffect, useRef, useState } from "react";
import { setUser } from "./slices/appSlice";
import SubmitNewPostPage from "../pages/SubmitNewPostPage/SubmitNewPostPage";
import SubredditPage from "../pages/SubredditPage/SubredditPage";
import UserPage from "../pages/UserPage/UserPage";
import SearchPage from "../pages/SearchPage/SearchPage";
import Header from "../components/Navigation/Header/Header";
import NavigationDrawer from "../components/Navigation/NavigationDrawer/NavigationDrawer";
import Axios from "../shared/lib/axios";
import { useLocation } from "react-router-dom";
import VerifyEmailPage from "../pages/VerifyEmailPage/VerifyEmailPage";
import ResetPasswordPage from "../pages/resetPassword/ResetPasswordPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  const [authInitialized, setAuthInitialized] = useState(false);

  const refreshLoading = useRef();

  useEffect(() => {
    const runUseEffectFunction = async () => {
      if (refreshLoading.current) return;
      if (user) return;
      let result;
      try {
        refreshLoading.current = true;
        result = await Axios.post("/api/auth/refresh");
      } catch (e) {
        refreshLoading.current = false;
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
      refreshLoading.current = false;
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
            className="grid-cols-[0_minmax(0,1fr)] xl:grid-cols-[1fr_auto_1fr]"
          >
            <NavigationDrawer />

            <div
              style={{ justifySelf: "center" }}
              className="col-start-2 min-w-0 w-full"
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
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
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
