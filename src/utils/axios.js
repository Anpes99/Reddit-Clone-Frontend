import axios from "axios";

const Axios = axios.create({
  baseURL: `${window.location.origin}`,
});

Axios.interceptors.request.use((config) => {
  const userData = JSON.parse(localStorage.getItem("loggedInRedditAppUser"));
  if (!userData) return config;
  const token = userData.token;
  const requestUrl = new URL(
    config.url,
    config.baseURL || window.location.origin,
  );

  if (token && requestUrl.origin === window.location.origin) {
    config.headers.Authorization = `bearer ${token}`;
  }

  return config;
});

export default Axios;
