import { useState } from "react";
import { Formik } from "formik";
import FormikTextInput from "../../Formik/FormikTextInput";
import useSignIn from "../../../hooks/useSignIn";
import { useNavigate } from "react-router-dom";
import {
  setEmailVerificationModal,
  setSignUpVisible,
} from "../../../app/slices/appSlice";
import { useDispatch } from "react-redux";
import Axios from "../../../shared/lib/axios";
import Joi from "joi";

const initialValues = {
  username: "",
  password: "",
};

export const validationSchema = Joi.object({
  username: Joi.string()
    .min(2)
    .max(25)
    .pattern(/^[A-Za-z0-9_-]+$/)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 2 characters",
      "string.max": "Username must be at most 25 characters",
      "string.pattern.base":
        "Username may contain letters, numbers, underscores and hyphens only",
      "any.required": "Username is required",
    }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(4).max(128).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 4 characters",
    "string.max": "Password must be at most 128 characters",
    "any.required": "Password is required",
  }),
});

export const validateWithJoi = (schema) => (values) => {
  const { error } = schema.validate(values, {
    abortEarly: false,
  });

  if (!error) return {};

  return error.details.reduce((errors, detail) => {
    const field = detail.path.join(".");

    if (!errors[field]) {
      errors[field] = detail.message;
    }

    return errors;
  }, {});
};

export const SignUpContainer = ({ onSubmit, setSignUpVisible, newError }) => {
  return (
    <Formik
      validate={validateWithJoi(validationSchema)}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <div className="space-y-4">
          <FormikTextInput
            name="username"
            placeholder="Username"
            inputProps={{ maxLength: 25 }}
          />
          <FormikTextInput
            type="email"
            name="email"
            placeholder="Email"
            inputProps={{ maxLength: 254 }}
          />
          <FormikTextInput
            type="password"
            name="password"
            placeholder="Password"
            inputProps={{ minLength: 4, maxLength: 128 }}
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
  const [signIn] = useSignIn();

  const onSubmit = async (values) => {
    try {
      await Axios.post("/api/users", values);
      dispatch(setSignUpVisible(false));
      dispatch(
        setEmailVerificationModal({
          email: values.email,
          username: values.username,
          isVisible: true,
        }),
      );
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
