import { TextareaAutosize } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import TopCommunities from "../components/TopCommunities";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import axios from "axios";
import {
  Navigate,
  useNavigate,
  useNavigationType,
  useParams,
} from "react-router";
import f1 from "../fake data/f1.png";
import { useDispatch } from "react-redux";
import { setCurrentSubreddit } from "../slices/appSlice";
import SubredditInfo from "../components/SubredditInfo";

const NewPostForm = ({}) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [currentWindow, setCurrentWindow] = useState(1);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const subredditName = useParams().subredditName;
  const user = useSelector((state) => state.app.user);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);
    if (status === "done") {
      setImg(file);
      setLoading(false);
    } else if (
      [
        "uploading",
        "preparing",
        "getting_upload_params",
        "headers_received",
      ].includes(status)
    ) {
      setLoading(true);
    } else if (status === "removed") {
      setImg(null);
    }
  };

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = async () => {
    let imageUrl = null;

    const newPost = {
      text,
      title,
      subredditName,
    };

    try {
      if (img) {
        const res = await axios.get("/api/utils/s3Url", {
          // get aws s3 put url // expires in 1min
          headers: {
            Authorization: `bearer ${user.token}`,
          },
        });
        console.log(res);

        await axios.put(res.data.url, img); //  put request to save img in aws s3 storage

        imageUrl = res.data.url.split("?")[0];
        newPost.imageUrl = imageUrl;
      }

      const response = await axios.post("/api/posts", newPost, {
        headers: {
          Authorization: `bearer ${user.token}`,
        },
      });
      if (response.status === 201) {
        console.log("new post created");
        setMessage("New Post Created");
        setText("");
        setTitle("");
        setImg(null);
        setTimeout(() => {
          setMessage(null);
          setError(null);
          navigate("/");
        }, 2000);
      }
    } catch (e) {
      console.log(e);
      setMessage("Failed to submit post");
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 10000);
    }
  };

  return (
    <div className="flex flex-col space-y-3 bg-white min-h-[30rem] rounded-lg ">
      <div className="min-h-[20rem] flex flex-col ">
        {" "}
        <div className="bg-white h-10 w-full flex rounded-t-lg">
          <div
            onClick={() => setCurrentWindow(1)}
            className={`flex-grow ${
              currentWindow === 1
                ? "border-b-blue-500 text-blue-500   border-b-2"
                : ""
            } border  font-bold text-gray-400 items-center flex justify-center cursor-pointer rounded-tl-lg`}
          >
            Post
          </div>
          <div
            onClick={() => setCurrentWindow(2)}
            className={`flex-grow ${
              currentWindow === 2
                ? "border-b-blue-500 text-blue-500 border-b-2 "
                : ""
            } border  text-center font-bold text-gray-400 items-center flex justify-center cursor-pointer rounded-tr-lg`}
          >
            Image
          </div>
        </div>
        {currentWindow === 1 && (
          <div className=" p-1">
            <input
              placeholder="Title"
              type="text"
              className="mb-2 mt-0.5 p-1.5 pl-3 border w-full"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
              id="newPostTitle"
            />

            <TextareaAutosize
              placeholder="Text"
              value={text}
              disabled={user ? false : true}
              onChange={(event) => {
                setText(event.target.value);
              }}
              className="w-full pl-3 pt-1.5 border m-0 min-h-[10rem]"
            />
          </div>
        )}
        {
          <div className={`p-1 ${currentWindow === 2 ? "" : "hidden"}`}>
            <Dropzone
              accept="image/*"
              maxFiles={1}
              getUploadParams={getUploadParams}
              onChangeStatus={handleChangeStatus}
              accept="image/*"
              inputContent={(files, extra) =>
                extra.reject
                  ? "Image files only"
                  : "Drag and drop images or click to upload"
              }
              styles={{
                dropzoneReject: { borderColor: "red", backgroundColor: "#DAA" },
                inputLabel: (files, extra) =>
                  extra.reject ? { color: "red" } : {},
              }}
            />
          </div>
        }
        <p
          className={`m-1 ${
            error ? "text-red-600" : "text-green-600"
          } font-medium text-medium`}
        >
          {message}
        </p>
      </div>
      <div className="px-1 pb-5 pt-3 flex justify-end border-t ">
        <button
          id="newPostSubmit"
          disabled={loading || text === "" || title === ""}
          onClick={user ? () => handleSubmit() : null}
          className={`py-2 px-6 rounded-2xl font-semibold bg-blue-500 text-white  ${
            loading || text === "" || title === ""
              ? "bg-gray-300 text-gray-200"
              : ""
          }`}
        >
          Post
        </button>
      </div>
    </div>
  );
};

const SubmitNewPostPage = () => {
  const user = useSelector((state) => state.app.user);
  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);
  const subredditName = useParams().subredditName;
  const dispatch = useDispatch();

  useEffect(async () => {
    const res = await axios.get("/api/subreddits?name=" + subredditName, {
      name: subredditName,
    });

    console.log(res);
    dispatch(setCurrentSubreddit(res.data[0]));
  }, []);

  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto min-h-screen ">
        <div className="flex mt-10 md:space-x-5">
          {/**  NEW POST SECTION   ////////////////////////////////////////////////////////////////////////////////// */}

          <section className="flex-grow flex flex-col ">
            <div className="pb-3 pl-3 border-b border-gray-100 font-semibold text-gray-700 mb-5 text-lg">
              Create a post
            </div>

            <NewPostForm />
          </section>

          {/**   SIDEBAR SECTION RIGHT SIDE ////////////////////////////////////////////////////////////////////////////////// */}
          <section>
            {/**   SUBREDDIT INFO SECTION ////////////////////////////////////////////////////////////////////////////////// */}

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
