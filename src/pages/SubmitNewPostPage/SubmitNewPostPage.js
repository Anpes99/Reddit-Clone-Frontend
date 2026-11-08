import "react-dropzone-uploader/dist/styles.css";
import SubredditInfo from "../SubredditPage/components/SubredditInfo";
import NewPostForm from "./components/NewPostForm";

const SubmitNewPostPage = () => {
  return (
    <main className="max-w-screen-lg mx-auto  ">
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
  );
};

export default SubmitNewPostPage;
