import React, { useState } from "react";
import { Formik } from "formik";
import FormikTextInput from "../../Formik/FormikTextInput";
import * as yup from "yup";
import useSignIn from "../../../hooks/useSignIn";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  setForgottenPasswordModalVisible,
  setLoginVisible,
} from "../../../app/slices/appSlice";

const initialValues = {
  username: "",
  password: "",
};

const validationSchema = yup.object().shape({
  username: yup.string().min(2).required("Username is required"),
  password: yup.string().min(4).required("Password is required"),
});

export const SignInContainer = ({ onSubmit, setSignUpVisible, newError }) => {
  const dispatch = useDispatch();
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <div className="space-y-4 flex flex-col items-center">
          <FormikTextInput
            name="username"
            placeholder="Username"
            inputProps={{ maxLength: 25 }}
          />

          <FormikTextInput
            name="password"
            type={"password"}
            placeholder="Password"
            inputProps={{ maxLength: 128 }}
          />

          {newError && <p className="text-red-600">{newError}</p>}

          <button
            type="submit"
            onClick={handleSubmit}
            role="button"
            aria-label="create my account"
            className="focus:ring-2 focus:ring-offset-2 focus:bg-blue-500 text-sm font-semibold leading-none text-white focus:outline-none bg-blue-500 border rounded hover:bg-blue-400 py-4 w-full transition-all"
          >
            Log In
          </button>
          <button
            onClick={() => {
              dispatch(setLoginVisible(false));
              dispatch(setForgottenPasswordModalVisible(true));
            }}
          >
            Forgot password?
          </button>
        </div>
      )}
    </Formik>
  );
};
//type props = Array<{signIn:({ username, password }:Credentials)=>Promise<AxiosResponse<any, any>>, success?:boolean, error?: unknown|null}>
const SignIn = ({ setSignUpVisible, setLoginVisible }) => {
  const dispatch = useDispatch();
  const [signIn] = useSignIn();
  const [newError, setNewError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;
    try {
      await signIn({ username, password });
    } catch (e) {
      const status = e.response?.status;
      if (status === 401) {
        setNewError("Incorrect username or password");
      } else if (status === 429) {
        setNewError("Too many login attempts. Try again later");
      } else if (status !== 403) {
        setNewError("Something went wrong. Please try again");
      }
    }
  };

  return (
    <SignInContainer
      onSubmit={onSubmit}
      newError={newError}
      setNewError={setNewError}
    />
  );
};

export default SignIn;
