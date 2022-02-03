import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import HomePage from "./pages/Homepage";
import PostPage from "./pages/PostPage";

const App = () => {
  return (
    <div className=" bg-gray-300">
      <Router>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/r/:subredditName/comments/:postId/:postTitle"
              element={<PostPage />}
            />
          </Routes>{" "}
        </Provider>
      </Router>
    </div>
  );
};

export default App;
