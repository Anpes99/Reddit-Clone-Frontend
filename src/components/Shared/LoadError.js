import PageMessage, { pageMessageButtonClassName } from "./PageMessage";

const LoadError = ({
  title = "Something went wrong",
  message = "We couldn't load this page. Please try again.",
  onRetry,
}) => (
  <PageMessage
    title={title}
    message={message}
    action={
      <button onClick={onRetry} className={pageMessageButtonClassName}>
        Try again
      </button>
    }
  />
);

export default LoadError;
