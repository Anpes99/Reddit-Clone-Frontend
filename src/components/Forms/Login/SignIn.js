import React, { useState } from "react";
import { Formik } from "formik";
import FormikTextInput from "../../Formik/FormikTextInput";
import * as yup from "yup";
import useSignIn from "../../../hooks/useSignIn";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

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

      dispatch(setLoginVisible(false));
      navigate("/");
    } catch (e) {
      if (e.response.status === 401) {
        setNewError("Incorrect username or password");
      }
      if (e.response.status === 429) {
        setNewError("Too many login attempts. Try again later");
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
