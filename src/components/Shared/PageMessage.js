import { Link } from "react-router";

export const pageMessageButtonClassName =
  "bg-blue-500 text-white rounded-full px-4 py-2 font-semibold text-sm hover:bg-blue-400";

const PageMessage = ({ code, title, message, action }) => {
  return (
    <div className="w-full xl:w-[1024px] xl:max-w-full max-w-screen-lg min-h-[calc(100dvh-var(--header-height))] bg-white flex flex-col items-center justify-center text-center px-4">
      {code && <p className="text-6xl font-bold text-gray-300">{code}</p>}
      <h1 className="mt-4 text-xl font-bold">{title}</h1>
      {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
      <div className="mt-6">
        {action ?? (
          <Link to="/" className={pageMessageButtonClassName}>
            Go home
          </Link>
        )}
      </div>
    </div>
  );
};

export default PageMessage;
