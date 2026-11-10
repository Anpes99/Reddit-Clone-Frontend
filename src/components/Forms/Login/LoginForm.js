import { XIcon } from "@heroicons/react/solid";
import SignIn from "./SignIn";
import {
  setLoginVisible,
  setSignUpVisible,
} from "../../../app/slices/appSlice";
import { useDispatch } from "react-redux";

function LoginForm() {
  const dispatch = useDispatch();

  return (
    <div className="h-full bg-black/60 w-full flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="bg-white shadow rounded flex flex-col items-center w-full max-w-md p-10 pt-[4rem] relative overflow-y-scroll overscroll-contain ">
          <XIcon
            className="h-10 w-10 absolute top-5 right-5 cursor-pointer"
            onClick={() => {
              dispatch(setLoginVisible(false));
            }}
          />
          <p
            tabIndex={0}
            role="heading"
            aria-label="Login to your account"
            className="text-2xl font-extrabold leading-6 text-gray-800"
          >
            Login to your account
          </p>

          <p className="text-sm mt-4 font-medium leading-none text-gray-500">
            Dont have account?{" "}
            <span
              onClick={() => {
                dispatch(setSignUpVisible(true));
                dispatch(setLoginVisible(false));
              }}
              tabIndex={0}
              role="link"
              aria-label="Sign up here"
              className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer"
            >
              {" "}
              Sign up here
            </span>
          </p>

          <div className="mt-8 w-full max-w-xs">
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
