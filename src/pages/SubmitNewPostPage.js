import { useEffect } from "react";
import Header from "../components/Header";
import "react-dropzone-uploader/dist/styles.css";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setCurrentSubreddit } from "../slices/appSlice";
import SubredditInfo from "../components/SubredditInfo";
import NewPostForm from "../components/Forms/NewPostForm";
import Axios from "../utils/axios";

const SubmitNewPostPage = () => {
  const subredditName = useParams().subredditName;
  const dispatch = useDispatch();

  useEffect(async () => {
    const res = await Axios.get("/api/subreddits/" + subredditName);

    dispatch(setCurrentSubreddit(res.data));
  }, []);

  return (
    <div>
      <main className="max-w-screen-lg mx-auto min-h-[100dvh] ">
        <div className="flex mt-10 md:space-x-5">
          <section className="flex-grow flex flex-col ">
            <div className="pb-3 pl-3 border-b border-gray-100 font-semibold text-gray-700 mb-5 text-lg">
              Create a post
            </div>

            <NewPostForm />
          </section>

          <section>
            <section className="hidden md:flex flex-col items-center bg-white  rounded-lg mt-10">
              <div className="flex flex-col border rounded-sm pt-5 text-gray-800 border-gray-300">
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
