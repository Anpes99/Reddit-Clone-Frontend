import { Formik } from "formik";

import Axios from "../../../shared/lib/axios";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import axios from "axios";
import ImageUpload from "../../../components/Shared/ImageUpload";
import { useSelector } from "react-redux";

const initialValues = { userAvatarImageUrl: "" };

function getRegion(url) {
  try {
    const hostname = new URL(url).hostname;

    const match = hostname.match(
      /^s3[.-]([a-z0-9-]+)\.amazonaws\.com(?:\.cn)?$/,
    );

    if (match) return match[1];

    return null;
  } catch {
    return null;
  }
}

const EditUserPageBackgroundModal = ({ isVisible, closeForm }) => {
  const [newError, setNewError] = useState(null);
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.app.user);
  const uploadImageToS3 = async ({ values }) => {
    const res = await Axios.get("/api/utils/s3Url");
    const s3Data = res.data.url;

    const formData = new FormData();

    Object.entries(s3Data.fields || {}).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (!s3Data.fields?.key) {
      formData.append("key", s3Data.key);
    }

    formData.append("file", values.profilePageBackgroundImageUrl.file);

    await axios.post(s3Data.url, formData);

    const region = getRegion(s3Data.url);

    if (!region) {
      throw new Error("Could not determine S3 region");
    }

    return `https://${s3Data.fields.bucket}.s3.${region}.amazonaws.com/${s3Data.key}`;
  };

  const [loading, setLoading] = useState(false);
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const imageUrl = await uploadImageToS3({ values });
      await Axios.patch(`api/loggedInUser`, {
        profilePageBackgroundImageUrl: imageUrl,
      });
      setLoading(false);
      closeForm();
      window.location.reload();
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  const onUploadImage = async ({ file, setFieldValue }) => {
    setFieldValue("profilePageBackgroundImageUrl", {
      previewUrl: URL.createObjectURL(file),
      source: "uploaded",
      file: file,
    });
    setMessage("File chosen: " + file.name);
  };
  const canSubmit = (values) =>
    values.profilePageBackgroundImageUrl?.file && !loading;

  return isVisible ? (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit, values, setFieldValue }) => (
        <div className="flex fixed top-0 left-0 w-full h-full justify-center items-center z-[160] ">
          <div
            onClick={() => closeForm()}
            className="fixed top-0 left-0 w-full h-full bg-black opacity-70 z-[100] "
          ></div>
          <div className=" z-[101] flex flex-col items-center bg-white  p-5 basis-[385px] rounded-xl max-w-full overflow-y-auto overscroll-contain max-h-[100dvh] h-min">
            <button className=" self-end" onClick={() => closeForm()}>
              <Close />
            </button>
            <div
              style={{
                backgroundImage: values.profilePageBackgroundImageUrl
                  ?.previewUrl
                  ? `url(${values.profilePageBackgroundImageUrl?.previewUrl})`
                  : `url(${user.profilePageBackgroundImageUrl || `https://api.dicebear.com/10.x/landscape/svg?orbProbability=0&seed=${user.username}`})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                height: "300px",
                width: "300px",
                alignSelf: "center",
                marginTop: "15px",
              }}
            />
            <ImageUpload
              onUpload={(file) => onUploadImage({ file, setFieldValue })}
              text="Upload background image"
              className="btn2 mt-5 w-max"
            />
            <p className="">{message}</p>
            <button
              disabled={!canSubmit(values)}
              onClick={handleSubmit}
              type="submit"
              className={`p-3 rounded-2xl mt-10 bg-gray-200 ${!canSubmit(values) ? "text-gray-400" : ""}  font-semibold h-min self-end`}
            >
              Change background
            </button>
          </div>
        </div>
      )}
    </Formik>
  ) : (
    <></>
  );
};

export default EditUserPageBackgroundModal;
