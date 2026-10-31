import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setUser,
  setLoginVisible,
  setEmailVerificationModal,
} from "../app/slices/appSlice";
import axios from "axios";

const useSignIn = () => {
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();

  const signIn = async ({ username, password }) => {
    try {
      const response = await axios.post(
        window.location.origin + "/api/auth/login",
        {
          username,
          password,
        },
      );

      if (response.status === 200 && response.data.token) {
        setSuccess(true);
        const { email, ...userData } = response.data;
        dispatch(setUser(userData));

        dispatch(setLoginVisible(false));
      }
      return response;
    } catch (error) {
      if (
        error.response?.status === 403 &&
        error.response.data?.details?.email &&
        error.response.data?.code === "EMAIL_NOT_VERIFIED"
      ) {
        dispatch(setLoginVisible(false));
        dispatch(
          setEmailVerificationModal({
            email: error.response.data.details.email,
            username,
            isVisible: true,
          }),
        );
      }

      throw error;
    }
  };

  return [signIn, success];
};

export default useSignIn;
