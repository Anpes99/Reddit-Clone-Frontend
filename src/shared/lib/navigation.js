// Lets code outside React components (e.g. the axios interceptor) navigate
// through the router. App.js registers the router's navigate function on mount.
let registeredNavigate = null;

export const registerNavigate = (navigate) => {
  registeredNavigate = navigate;
  return () => {
    if (registeredNavigate === navigate) registeredNavigate = null;
  };
};

export const navigateTo = (path) => {
  if (registeredNavigate) {
    registeredNavigate(path);
  } else {
    window.location.assign(path);
  }
};
