import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import HomePage from "./pages/Homepage";
import PostPage from "./pages/PostPage";
import { useEffect } from "react";
import { setUser } from "./slices/appSlice";
import SubmitNewPostPage from "./pages/SubmitNewPostPage";
import SubredditPage from "./pages/SubredditPage";
import UserPage from "./pages/UserPage";
import SearchPage from "./pages/SearchPage";
import Header from "./components/Header";
import NavigationDrawer from "./components/NavigationDrawer";

const App = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInRedditAppUser"));
    if (user) store.dispatch(setUser(user));
  }, []);

  return (
    <div className=" bg-gray-200">
      <Router>
        <Provider store={store}>
          <Header />
          <div className="w-full h-[var(--header-height)] hidden sm:block"></div>
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
              className="col-start-1 xl:col-start-2"
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
        </Provider>
      </Router>
    </div>
  );
};

export default App;
