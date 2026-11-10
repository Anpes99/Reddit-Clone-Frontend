import { XIcon } from "@heroicons/react/solid";
import SignUp from "./SignUp";
import {
  setLoginVisible,
  setSignUpVisible,
} from "../../../app/slices/appSlice";
import { useDispatch } from "react-redux";

function SignUpForm() {
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => dispatch(setSignUpVisible(false))}
      className="h-full bg-black/60 w-full"
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white shadow rounded flex flex-col items-center w-full max-w-md p-10 pt-[4rem]  relative overflow-y-scroll overscroll-contain"
        >
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

          <div className="mt-8 w-full max-w-xs">
            <SignUp />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
