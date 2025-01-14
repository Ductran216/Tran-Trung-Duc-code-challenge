import { isRouteErrorResponse, useRouteError } from "react-router-dom";

// Just a simple error page
const ErrorPage = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return (
        <div id="error-page">
          <h1>UnAuthentication</h1>
          <p>You don't have a permission.</p>
        </div>
      );
    }
    if (error.status === 404) {
      return (
        <div id="error-page">
          <h1>Not found</h1>
        </div>
      );
    }
    return (
      <div id="error-page">
        <h1>Oops! {error.status}</h1>
        <p>{error.statusText}</p>
        {error.data?.message && (
          <p>
            <i>{error.data.message}</i>
          </p>
        )}
      </div>
    );
  }
  if (error instanceof Error) {
    return (
      <div id="error-page">
        <h1>Oops! Unexpected Error</h1>
        <p>Something went wrong.</p>
        <p>
          <i>{error.message}</i>
        </p>
      </div>
    );
  }
  return <>Error</>;
};
export default ErrorPage;
