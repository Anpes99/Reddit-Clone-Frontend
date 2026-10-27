import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setForgottenPasswordModalVisible,
  setLoginVisible,
} from "../../../app/slices/appSlice";
import axios from "axios";

const ForgottenPasswordModal = ({}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const isVisible = useSelector(
    (state) => state.app.forgottenPasswordModalVisible,
  );
  if (!isVisible) return;

  const onClose = () => {
    dispatch(setForgottenPasswordModalVisible(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post(
        window.location.origin + "/api/users/forgotten-password",
        {
          email,
        },
      );

      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setStatus("idle");
    onClose?.();
    dispatch(setForgottenPasswordModalVisible(false));
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center
        justify-center bg-slate-950/50 p-4
       bg-black/60 "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-title"
        className="relative w-full max-w-md 
          border border-slate-100 bg-white p-7 shadow-2xl
          sm:p-9 animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute right-5 top-5 rounded-lg
            p-2 text-slate-400 transition hover:bg-slate-100
            hover:text-slate-700"
        >
          ✕
        </button>

        <div
          className="mb-6 flex h-12 w-12 items-center
          justify-center rounded-xl bg-blue-50
          text-blue-600"
        >
          {status === "success" ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          )}
        </div>

        {status === "success" ? (
          <div className="space-y-3">
            <h2
              id="forgot-title"
              className="text-2xl
              font-bold tracking-tight text-slate-900"
            >
              Check your inbox
            </h2>
            <p className="text-sm leading-6 text-slate-500">
              If an account exists for {email}, you'll receive password reset
              instructions shortly.
            </p>
            <button
              onClick={() => {
                dispatch(setLoginVisible(true));
                handleClose();
              }}
              className="w-full rounded-xl bg-blue-600
                px-4 py-3 font-semibold text-white
                transition hover:bg-blue-700
                focus:outline-none focus:ring-4
                focus:ring-blue-100"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            <h2
              id="forgot-title"
              className="text-2xl
              font-bold tracking-tight text-slate-900"
            >
              Forgot password?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-2 block text-sm font-medium
                    text-slate-700"
                >
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={!!error}
                  aria-describedby={error ? "reset-error" : undefined}
                  className="w-full rounded-xl border border-slate-200
                    bg-white px-4 py-3 text-sm text-slate-900
                    outline-none transition placeholder:text-slate-400
                    focus:border-blue-500 focus:ring-4
                    focus:ring-blue-500/10"
                />
                {error && (
                  <p
                    id="reset-error"
                    role="alert"
                    className="mt-2 text-sm text-red-600"
                  >
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600
                  px-4 py-3 text-sm font-semibold text-white
                  shadow-lg shadow-blue-600/20 transition
                  hover:bg-blue-700 active:scale-[0.99]
                  focus:outline-none focus:ring-4
                  focus:ring-blue-500/20"
              >
                Send reset link
              </button>
            </form>

            <button
              onClick={() => {
                dispatch(setLoginVisible(true));
                handleClose();
              }}
              className="mt-6 flex w-full items-center
                justify-center gap-2 text-sm font-medium
                text-slate-500 transition hover:text-slate-900"
            >
              <span aria-hidden="true">←</span>
              Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgottenPasswordModal;
