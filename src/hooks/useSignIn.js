import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoginVisible } from "../slices/appSlice";

const useSignIn = () => {
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();

  const signIn = async ({ username, password }) => {
    try {
      const response = await axios.post("/api/login", {
        username,
        password,
      });

      console.log(response);
      if (response.status === 200 && response.data.token) {
        console.log("here1");
        console.log(response);
        setSuccess(true);
        localStorage.setItem(
          "loggedInRedditAppUser",
          JSON.stringify(response.data)
        );
        dispatch(setUser(response.data));
        dispatch(setLoginVisible(false));
        console.log("here1");
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
