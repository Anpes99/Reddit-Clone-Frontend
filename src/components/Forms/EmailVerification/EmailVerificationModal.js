import { XIcon } from "@heroicons/react/solid";
import {
  setEmailVerificationModal,
  setLoginVisible,
} from "../../../app/slices/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle, Mail } from "@mui/icons-material";
import axios from "axios";
import { useState } from "react";

const EmailVerificationModal = ({ onChangeEmail }) => {
  const dispatch = useDispatch();
  const emailVerificationModalState = useSelector(
    (state) => state.app.emailVerificationModal,
  );
  const [emailResent, setEmailResent] = useState(false);
  const [sendEmailAgainCountdown, setSendEmailAgainCountdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailAlreadyVerified, setEmailAlreadyVerified] = useState(false);

  const onResend = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        window.location.origin + "/api/verify-email/resend",
        {
          username: emailVerificationModalState.username,
        },
      );
      if (response.data.status === "EMAIL_ALREADY_VERIFIED") {
        setEmailAlreadyVerified(true);
        return;
      }
      if (response.status === 200) {
        setEmailResent(true);
        setSendEmailAgainCountdown(30);
        const interval = setInterval(() => {
          setSendEmailAgainCountdown((curCount) => curCount - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(interval);
          setEmailResent(false);
          setSendEmailAgainCountdown(null);
        }, 30000);
      }
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="verification-title"
        className="relative w-full max-w-md  bg-white p-8 shadow-2xl"
      >
        <button
          onClick={() => {
            dispatch(
              setEmailVerificationModal({
                email: "",
                username: "",
                isVisible: false,
              }),
            );
          }}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <XIcon className="h-8 w-8" />
        </button>

        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
            emailAlreadyVerified ? "bg-green-50" : "bg-blue-50"
          }`}
        >
          {emailAlreadyVerified ? (
            <CheckCircle className="h-8 w-8 text-green-600" />
          ) : (
            <Mail className="h-8 w-8 text-blue-500" />
          )}
        </div>

        <h2
          id="verification-title"
          className="text-center text-2xl font-bold tracking-tight text-gray-900"
        >
          {emailAlreadyVerified ? "Email already verified" : "Check your email"}
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-gray-500">
          {emailAlreadyVerified
            ? "Your email address has already been verified."
            : "We've sent a verification link to"}
        </p>

        <p className="text-center font-semibold text-gray-900">
          {emailVerificationModalState.email}
        </p>

        <p className="mt-4 text-center text-sm leading-6 text-gray-500">
          {emailAlreadyVerified
            ? "You're all set! You can continue to your account."
            : "Click the link in your inbox to verify your email address and finish creating your account."}
        </p>

        {emailAlreadyVerified ? (
          <button
            onClick={() => {
              dispatch(
                setEmailVerificationModal({
                  email: "",
                  username: "",
                  isVisible: false,
                }),
              );
              dispatch(setLoginVisible(true));
            }}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Continue
          </button>
        ) : (
          <button
            disabled={loading || emailResent}
            onClick={onResend}
            className="mt-4 w-full border border-gray-400 py-3 text-sm font-medium text-blue-600 hover:bg-gray-100 hover:text-blue-700 disabled:bg-gray-200"
          >
            {emailResent
              ? `Verification email sent. You can resend it in ${sendEmailAgainCountdown} seconds.`
              : loading
                ? "Sending..."
                : "Resend verification email"}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationModal;
