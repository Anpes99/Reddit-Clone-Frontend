import React, { useState } from "react";
import { Formik } from "formik";
import FormikTextInput from "./FormikTextInput";
import * as yup from "yup";
import useSignIn from "../../hooks/useSignIn";

import { setLoginVisible, setSignUpVisible } from "../../slices/appSlice";
import { useDispatch } from "react-redux";

const initialValues = {
  username: "",
  password: "",
};

const validationSchema = yup.object().shape({
  username: yup.string().min(2).required("Username is required"),
  password: yup.string().min(4).required("Password is required"),
});

export const SignInContainer = ({ onSubmit, setSignUpVisible, newError }) => {
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <div className="space-y-4">
          <FormikTextInput name="username" placeholder="Username" />

          <FormikTextInput name="password" placeholder="Password" />

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

  const onSubmit = async (values) => {
    const { username, password } = values;
    try {
      await signIn({ username, password });

      dispatch(setLoginVisible(false));
      window.location.href = "/";
    } catch (e) {
      if (e.response.status === 401) {
        setNewError("Incorrect username or password");
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
