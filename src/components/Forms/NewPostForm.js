import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { TextareaAutosize } from "@mui/material";
import Dropzone from "react-dropzone-uploader";

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

export default NewPostForm;
