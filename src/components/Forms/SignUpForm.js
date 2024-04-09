import React from "react";
import { XIcon } from "@heroicons/react/solid";
import SignUp from "../Formik/SignUp";
import { setLoginVisible, setSignUpVisible } from "../../slices/appSlice";
import { useDispatch } from "react-redux";
import ContinueWithGoogleButton from "../Buttons/ContinueWithGoogleButton";

function SignUpForm() {
  const dispatch = useDispatch();

  return (
    <div className="h-full bg-black/60 w-full">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="bg-white shadow rounded lg:w-1/3 flex flex-col items-center  md:w-1/2 w-full p-10 pt-[4rem]  relative ">
          <XIcon
            className="h-10 w-10 absolute top-5 right-5 cursor-pointer"
            onClick={() => {
              dispatch(setSignUpVisible(false));
            }}
          />
          <p
            tabIndex={0}
            role="heading"
            aria-label="Login to your account"
            className="text-2xl font-extrabold leading-6 text-gray-800"
          >
            Create a New Account
          </p>

          <p className="text-sm mt-4 font-medium leading-none text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => {
                dispatch(setSignUpVisible(false));

                dispatch(setLoginVisible(true));
              }}
              tabIndex={0}
              role="link"
              aria-label="Sign up here"
              className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer"
            >
              {" "}
              Sign In
            </span>
          </p>

          <ContinueWithGoogleButton />
          <div className="w-full flex items-center justify-between py-5">
            <hr className="w-full bg-gray-400" />
            <p className="text-base font-medium leading-4 px-2.5 text-gray-400">
              OR
            </p>
            <hr className="w-full bg-gray-400  " />
          </div>

          <div className="mt-8">
            <SignUp />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
