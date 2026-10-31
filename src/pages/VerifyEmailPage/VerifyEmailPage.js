import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  addGlobalNotification,
  setEmailVerificationModal,
  setLoginVisible,
} from "../../app/slices/appSlice";
import { useDispatch } from "react-redux";
import { WarningAmber } from "@mui/icons-material";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      console.log(token);
      if (!token) return;
      try {
        const response = await axios.post(
          window.location.origin + "/api/verify-email",
          { token },
        );
        console.log(response);
        if (response.status === 200) {
          navigate("/");
          dispatch(setEmailVerificationModal({ email: "", isVisible: false }));
          dispatch(setLoginVisible(true));
          dispatch(
            addGlobalNotification({
              type: "success",
              message: "Email succesfully verified",
            }),
          );
        }
      } catch (e) {
        setError(true);
      }
    };

    verifyEmail();
  }, []);

  return error ? (
    <div className="w-full mt-10 max-w-md mx-auto rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <WarningAmber size={28} strokeWidth={1.7} />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
        Link expired
      </h2>
      <p className="mt-3 text-sm leading-6 text-gray-500">
        This email verification link has expired. Please return to the login
        page and request a new verification email.
      </p>
    </div>
  ) : (
    <></>
  );
};
export default VerifyEmailPage;
