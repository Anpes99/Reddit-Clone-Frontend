import PageMessage from "./PageMessage";

const NotFound = ({
  title = "Page not found",
  message = "The page you're looking for doesn't exist or has been removed.",
}) => <PageMessage code="404" title={title} message={message} />;

export default NotFound;
