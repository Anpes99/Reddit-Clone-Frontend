import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoginVisible } from "../app/slices/appSlice";
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

        dispatch(setUser(response.data));
        dispatch(setLoginVisible(false));
      }
      return response;
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  return [signIn, success];
};

export default useSignIn;
