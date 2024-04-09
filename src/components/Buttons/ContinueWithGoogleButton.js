import GoogleIcon from "../../icons/GoogleIcon";

const ContinueWithGoogleButton = () => (
  <button
    aria-label="Continue with google"
    role="button"
    className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center  mt-10"
  >
    <GoogleIcon />
    <p className="text-base font-medium ml-4 text-gray-700">
      Continue with Google
    </p>
  </button>
);

export default ContinueWithGoogleButton;
