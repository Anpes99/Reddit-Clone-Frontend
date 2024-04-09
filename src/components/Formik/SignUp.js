import React, { useContext, useState } from "react";
import { Formik } from "formik";
import FormikTextInput from "./FormikTextInput";
import * as yup from "yup";
import useSignIn from "../../hooks/useSignIn";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { setLoginVisible, setSignUpVisible } from "../../slices/appSlice";
import { useDispatch } from "react-redux";

const initialValues = {
  username: "",
  password: "",
};

const validationSchema = yup.object().shape({
  username: yup.string().min(2).required("Username is required"),
  password: yup.string().min(4).required("Password is required"),
  // email: yup.string().required("Email is required"),
  //name: yup.string().required("Name is required"),
});

export const SignUpContainer = ({ onSubmit, setSignUpVisible, newError }) => {
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <div className="space-y-4">
          <FormikTextInput name="username" placeholder="Username" />

          <FormikTextInput
            type="password"
            name="password"
            placeholder="Password"
          />

          {newError && <p className="text-red-600">{newError}</p>}

          <button
            type="submit"
            onClick={handleSubmit}
            role="button"
            aria-label="create my account"
            className="focus:ring-2 focus:ring-offset-2 focus:bg-blue-500 text-sm font-semibold leading-none text-white focus:outline-none bg-blue-500 border rounded hover:bg-blue-400 py-4 w-full transition-all"
          >
            Sign Up
          </button>
        </div>
      )}
    </Formik>
  );
};

//type props = Array<{signIn:({ username, password }:Credentials)=>Promise<AxiosResponse<any, any>>, success?:boolean, error?: unknown|null}>
const SignUp = () => {
  const navigate = useNavigate();
  const [newError, setNewError] = useState(null);
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      const response = await axios.post("api/users", values);
      dispatch(setSignUpVisible(false));
      navigate("/");
    } catch (e) {
      if (e.response.data.error === "username already taken")
        setNewError("This username is already taken.");
    }
  };

  return (
    <SignUpContainer
      newError={newError}
      setSignUpVisible={setSignUpVisible}
      onSubmit={onSubmit}
    />
  );
};

export default SignUp;
