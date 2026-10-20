import { Formik, useFormikContext } from "formik";

import Axios from "../../utils/axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import ImageUpload from "../ImageUpload";
import axios from "axios";
import { Close } from "@mui/icons-material";

const initialValues = { subredditIconUrl: "" };

const AvatarOptions = ({ iconsToShow = 16 }) => {
  const { setFieldValue, values } = useFormikContext();
  const [seeds, setSeeds] = useState(
    Array(iconsToShow)
      .fill("reddit-subreddit")
      .map((text) => text + Math.random()),
  );
  const getNewSeeds = () => {
    const newSeeds = [];
    for (let i = 0; i < 16; i++) {
      newSeeds.push("reddit-subreddit" + String(Math.random()));
    }
    setSeeds(newSeeds);
  };

  const getIconUrl = (seed) =>
    `https://api.dicebear.com/10.x/icons/svg?seed=${encodeURIComponent(seed)}`;

  const SubredditIcon = ({ seed, size = 36 }) => (
    <img
      src={getIconUrl(seed)}
      alt=""
      width={size}
      height={size}
      style={{ borderRadius: "50%" }}
    />
  );
  const [message, setMessage] = useState("");
  const onChooseSubredditIcon = (chosenUrl) => {
    setFieldValue("subredditIconUrl", {
      url: chosenUrl,
      previewUrl: chosenUrl,
      source: "defaultOptions",
      file: null,
    });
    setMessage("");
  };

  const onUploadImage = async (file) => {
    setFieldValue("subredditIconUrl", {
      url: "",
      previewUrl: URL.createObjectURL(file),
      source: "uploaded",
      file: file,
    });
    setMessage("File chosen: " + file.name);
  };

  return (
    <div className="mr-3 mb-5 flex flex-col items-center">
      <p className="font-semibold mb-1">Choose subreddit icon:</p>
      <div className="grid grid-cols-4">
        {Array(16)
          .fill(null)
          .map((_, i) => {
            return (
              <button
                key={"subreddit_icon_option" + i}
                onClick={() => {
                  onChooseSubredditIcon(getIconUrl(seeds[i]));
                }}
                style={{
                  border:
                    values.subredditIconUrl.url === getIconUrl(seeds[i])
                      ? "solid blue 4px"
                      : "solid white 4px",
                  borderRadius: "50%",
                }}
              >
                <SubredditIcon seed={seeds[i]} size={"50px"} />
              </button>
            );
          })}
      </div>
      <button
        className="btn2 mt-3 border-gray-600"
        onClick={() => {
          getNewSeeds();
          setFieldValue("subredditIconUrl", "");
        }}
      >
        Refresh icons
      </button>
      <ImageUpload
        onUpload={onUploadImage}
        text="Upload your own"
        className="btn2 mt-2"
      />
      <p className="">{message}</p>
    </div>
  );
};

const EditSubredditIconModal = ({ isVisible, closeForm }) => {
  const [newError, setNewError] = useState(null);

  const currentSubreddit = useSelector((state) => state.app.currentSubreddit);
  const onSubmit = async (values) => {
    const uploadImageToS3 = async () => {
      const res = await Axios.get("/api/utils/s3Url");
      await axios.put(res.data.url, values.subredditIconUrl.file);
      const imageUrl = res.data.url.split("?")[0];
      return imageUrl;
    };

    try {
      const ímageUrl =
        values.subredditIconUrl.source === "uploaded"
          ? await uploadImageToS3()
          : values.subredditIconUrl.url;

      await Axios.patch(`api/subreddits/${currentSubreddit.id}/settings`, {
        subredditIconUrl: ímageUrl,
      });
      closeForm();
      window.location.href = "/r/" + currentSubreddit.name;
    } catch (e) {
      if (e.response.status === 409) {
        setNewError("A subreddit with this name already exists.");
      } else {
        setNewError("Something went wrong while creating new subreddit.");
      }
    }
  };

  const canSubmit = (values) => values.subredditIconUrl;

  return isVisible ? (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit, values }) => (
        <div className="flex fixed top-0 left-0 w-full h-full justify-center items-center z-[160] ">
          <div
            onClick={() => closeForm()}
            className="fixed top-0 left-0 w-full h-full bg-black opacity-70 z-[100] "
          ></div>
          <div className="relative z-[101] flex flex-col  bg-white  p-5 basis-[385px] rounded-xl max-w-full overflow-y-auto overscroll-contain max-h-[100dvh] h-min">
            <button
              className="absolute top-4 right-4"
              onClick={() => closeForm()}
            >
              <Close />
            </button>
            <AvatarOptions />
            <button
              disabled={!values.subredditIconUrl}
              onClick={handleSubmit}
              type="submit"
              className={`p-3 rounded-2xl bg-gray-200 ${!canSubmit(values) ? "text-gray-400" : ""}  font-semibold h-min self-end`}
            >
              Change icon
            </button>
          </div>
        </div>
      )}
    </Formik>
  ) : (
    <></>
  );
};

export default EditSubredditIconModal;
