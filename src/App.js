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

const App = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInRedditAppUser"));
    if (user) store.dispatch(setUser(user));
  }, []);

  return (
    <div className=" bg-gray-200">
      <Router>
        <Provider store={store}>
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
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Provider>
      </Router>
    </div>
  );
};

export default App;
