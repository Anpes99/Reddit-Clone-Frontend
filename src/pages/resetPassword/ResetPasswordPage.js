import { useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { addGlobalNotification } from "../../app/slices/appSlice";
import { useDispatch } from "react-redux";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!searchParams.get("token")) return;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const passwordResetToken = searchParams.get("token");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(window.location.origin + "/api/users/reset-password", {
        password,
        passwordResetToken,
      });
      navigate("/");
      dispatch(
        addGlobalNotification({
          type: "success",
          message: "Password succesfully changed",
        }),
      );
      return;
    } catch (e) {
      setError(
        "This password reset link is invalid or has expired. Please request a new one.",
      );
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/50 sm:p-10">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v6A2.25 2.25 0 0 1 17.25 21h-10.5A2.25 2.25 0 0 1 4.5 18.75v-6A2.25 2.25 0 0 1 6.75 10.5Z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Create a new password
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          Choose a strong password you haven't used before. Make sure you
          remember it!
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 text-xs font-semibold text-gray-500 hover:text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Use at least 8 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm new password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-3 text-xs font-semibold text-gray-500 hover:text-blue-600"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 active:scale-[0.99]"
          >
            Reset password
          </button>
        </form>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
