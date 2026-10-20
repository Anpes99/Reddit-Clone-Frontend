import { Formik, useFormikContext } from "formik";

import Axios from "../../utils/axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import UserAvatarImg from "../UserAvatarImg";
import { Close } from "@mui/icons-material";

const initialValues = { userAvatarImageUrl: "" };

const AvatarOptions = ({ iconsToShow = 16 }) => {
  const { setFieldValue, values } = useFormikContext();
  const [seeds, setSeeds] = useState(
    Array(iconsToShow)
      .fill("reddit-user")
      .map((text) => text + Math.random()),
  );
  const getNewSeeds = () => {
    const newSeeds = [];
    for (let i = 0; i < 16; i++) {
      newSeeds.push("reddit-user" + String(Math.random()));
    }
    setSeeds(newSeeds);
  };

  const getImageUrl = (seed) =>
    `https://api.dicebear.com/10.x/voxel-art/svg?scale=1.25&seed=${encodeURIComponent(seed)}`;

  const onChooseUserAvatarImage = (chosenUrl) => {
    setFieldValue("userAvatarImageUrl", chosenUrl);
  };

  return (
    <div className="mr-3 mb-5 flex flex-col items-center">
      <p className="font-semibold mb-1">Choose user avatar:</p>
      <div className="grid grid-cols-4">
        {Array(16)
          .fill(null)
          .map((_, i) => {
            return (
              <button
                key={"user_avatar_image_option" + i}
                onClick={() => {
                  onChooseUserAvatarImage(getImageUrl(seeds[i]));
                }}
                style={{
                  border:
                    values.userAvatarImageUrl === getImageUrl(seeds[i])
                      ? "solid blue 4px"
                      : "solid white 4px",
                  borderRadius: "50%",
                }}
              >
                <UserAvatarImg url={getImageUrl(seeds[i])} size={"50px"} />
              </button>
            );
          })}
      </div>

      <button
        className="btn2 mt-3 border-gray-600"
        onClick={() => {
          getNewSeeds();
          setFieldValue("userAvatarImageUrl", "");
        }}
      >
        Refresh avatars
      </button>
    </div>
  );
};

const EditUserAvatarImageModal = ({ isVisible, closeForm }) => {
  const [newError, setNewError] = useState(null);

  const onSubmit = async (values) => {
    try {
      await Axios.patch(`api/loggedInUser`, values);
      closeForm();
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const canSubmit = (values) => values.userAvatarImageUrl?.length;

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
              disabled={!values.userAvatarImageUrl?.length}
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

export default EditUserAvatarImageModal;
