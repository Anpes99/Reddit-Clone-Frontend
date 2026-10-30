import { Close } from "@mui/icons-material";
import { Formik, useFormikContext } from "formik";
import FormikTextInput from "../Formik/FormikTextInput";
import * as yup from "yup";
import Axios from "../../shared/lib/axios";
import { useState } from "react";
import { InputAdornment } from "@mui/material";
import DefaultSubredditIcon from "../../assets/icons/DefaultSubredditIcon";
import ImageUpload from "../Shared/ImageUpload";
import { uploadImageToS3 } from "../../shared/utils/utils";
const initialValues = {
  communityName: "",
  description: "",
};

const validationSchema = yup.object().shape({
  communityName: yup
    .string()
    .min(2)
    .max(21)
    .required("Community name is required"),
  description: yup.string().min(1).max(500).required("Description is required"),
});

const AvatarOptions = () => {
  const { setFieldValue } = useFormikContext();
  const [seeds, setSeeds] = useState(
    Array(8)
      .fill("reddit-subreddit")
      .map((text) => text + Math.random()),
  );
  const getNewSeeds = () => {
    const newSeeds = [];
    for (let i = 0; i < 8; i++) {
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
      <div className="grid grid-cols-4 gap-1">
        {Array(8)
          .fill(null)
          .map((_, i) => {
            return (
              <button
                key={"subreddit_icon_option" + i}
                onClick={() => {
                  onChooseSubredditIcon(getIconUrl(seeds[i]));
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

const CreateCommunityForm = ({ isVisible, closeForm }) => {
  const [newError, setNewError] = useState(null);

  const onSubmit = async (values) => {
    const { communityName } = values;
    try {
      const ímageUrl =
        values.subredditIconUrl.source === "uploaded"
          ? await uploadImageToS3(values.subredditIconUrl.file)
          : values.subredditIconUrl.url;

      await Axios.post("/api/subreddits", {
        ...values,
        subredditIconUrl: ímageUrl,
      });
      closeForm();
      window.location.href = "/r/" + communityName;
    } catch (e) {
      if (e.response.status === 409) {
        setNewError("A subreddit with this name already exists.");
      } else {
        setNewError("Something went wrong while creating new subreddit.");
      }
    }
  };

  const canSubmit = (values) =>
    values.communityName?.length > 2 && values.description.length;

  return isVisible ? (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, values }) => (
        <div className="flex fixed top-0 left-0 w-full h-full justify-center items-center z-[160] ">
          <div
            onClick={() => closeForm()}
            className="fixed top-0 left-0 w-full h-full bg-black opacity-70 z-[100] "
          ></div>
          <div className="z-[101]  bg-white  p-5 basis-[385px] md:basis-[768px] rounded-xl max-w-full overflow-y-auto overscroll-contain max-h-[100dvh] h-min">
            <div className="flex justify-between mb-10">
              <div>
                <p className="font-semibold text-xl">
                  Tell us about your community
                </p>
                <p className="text-sm text-gray-700">
                  A name and description help people understand what your
                  community is all about.
                </p>
              </div>
              <div>
                <Close
                  className="cursor-pointer"
                  onClick={() => {
                    closeForm();
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full">
              <div className="flex flex-col max-w-full flex-grow">
                <FormikTextInput
                  name="communityName"
                  placeholder="Community name"
                  className="bg-gray-200 w-full "
                  inputProps={{
                    maxLength: 21,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0.2 }}>
                        r/
                      </InputAdornment>
                    ),
                  }}
                  containerStyle={{ marginBottom: "20px", width: "100%" }}
                  required
                />

                <FormikTextInput
                  name="description"
                  placeholder="Description"
                  className="bg-gray-200 p-4  resize-none w-full"
                  inputProps={{ maxLength: 500 }}
                  required
                  multiline
                  containerStyle={{ width: "100%" }}
                  rows={7}
                />
              </div>
              <div className="min-h-40 basis-[300px] order-first md:order-last shadow-md md:ml-5 mb-7 md:mb-0 rounded-2xl overflow-hidden">
                <div className="bg-gray-200 w-full h-[92px]"></div>
                <div className="flex flex-col p-4">
                  <div className="flex items-center">
                    <div className="rounded-full flex justify-center items-center overflow-hidden h-[3rem] w-[3rem] mr-3">
                      {values.subredditIconUrl?.previewUrl ? (
                        <img src={values.subredditIconUrl.previewUrl} />
                      ) : (
                        <DefaultSubredditIcon />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">
                        r/{values.communityName || "communityname"}
                      </p>
                      <p className="text-xs text-gray-500">
                        1 member · 1 online
                      </p>
                    </div>
                  </div>
                  <p className="text-sm max-w-full whitespace-normal break-words mt-3">
                    {values.description || "Community description"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between mt-12 ">
              <AvatarOptions />
              <button
                disabled={!canSubmit(values)}
                type="submit"
                onClick={handleSubmit}
                className={`p-3 rounded-2xl bg-gray-200 ${!canSubmit(values) ? "text-gray-400" : ""}  font-semibold h-min md:self-end`}
              >
                Create community
              </button>
            </div>
            <p className={newError ? "text-red-600" : "opacity-0"}>
              {newError || "error placeholder"}
            </p>
          </div>
        </div>
      )}
    </Formik>
  ) : (
    <></>
  );
};

export default CreateCommunityForm;
