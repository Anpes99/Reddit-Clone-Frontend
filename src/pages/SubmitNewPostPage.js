import { useEffect } from "react";
import Header from "../components/Header";
import "react-dropzone-uploader/dist/styles.css";
import axios from "axios";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setCurrentSubreddit } from "../slices/appSlice";
import SubredditInfo from "../components/SubredditInfo";
import NewPostForm from "../components/Forms/NewPostForm";

const SubmitNewPostPage = () => {
  const subredditName = useParams().subredditName;
  const dispatch = useDispatch();

  useEffect(async () => {
    const res = await axios.get("/api/subreddits", {
      params: { name: subredditName },
    });

    dispatch(setCurrentSubreddit(res.data[0]));
  }, []);

  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto min-h-screen ">
        <div className="flex mt-10 md:space-x-5">
          <section className="flex-grow flex flex-col ">
            <div className="pb-3 pl-3 border-b border-gray-100 font-semibold text-gray-700 mb-5 text-lg">
              Create a post
            </div>

            <NewPostForm />
          </section>

          <section>
            <section className="hidden md:flex flex-col items-center bg-white  rounded-lg mt-10">
              <div className="flex flex-col border rounded-sm pt-5 text-gray-800 border border-gray-300">
                <SubredditInfo />
              </div>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SubmitNewPostPage;
