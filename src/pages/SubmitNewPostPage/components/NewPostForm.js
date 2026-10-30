import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { TextareaAutosize } from "@mui/material";
import Dropzone, { Preview } from "react-dropzone-uploader";
import Axios from "../../../shared/lib/axios";
import { uploadImageToS3 } from "../../../shared/utils/utils";

const ImagePreview = (props) => <Preview {...props} isUpload />;

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

  const handleSubmit = async () => {
    setLoading(true);

    const newPost = {
      text,
      title,
      subredditName,
    };

    try {
      if (img) {
        newPost.imageUrl = await uploadImageToS3(img);
      }

      const response = await Axios.post("/api/posts", newPost);
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
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
      setMessage("Failed to submit post");
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 10000);
    }
  };

  const submitDisabled = loading || text === "" || title === "";

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
              maxLength={300}
            />

            <TextareaAutosize
              placeholder="Text"
              value={text}
              disabled={user ? false : true}
              onChange={(event) => {
                setText(event.target.value);
              }}
              className="w-full pl-3 pt-1.5 border m-0 min-h-[10rem]"
              maxLength={40000}
            />
          </div>
        )}
        {
          <div
            className={`p-1 ${currentWindow === 2 ? "" : "hidden"} md:min-w-[435px]`}
          >
            <Dropzone
              accept="image/*"
              maxFiles={1}
              onChangeStatus={handleChangeStatus}
              PreviewComponent={ImagePreview}
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
          disabled={submitDisabled}
          onClick={user ? () => handleSubmit() : null}
          className={`py-2 px-6 rounded-2xl font-semibold bg-blue-500 text-white  ${
            submitDisabled ? "bg-gray-300 text-gray-200" : ""
          }`}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default NewPostForm;
