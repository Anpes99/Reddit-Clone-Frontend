import axios from "axios";
import { store } from "../../app/store";
import { addGlobalNotification, setUser } from "../../app/slices/appSlice";
import socket from "./socket";

const Axios = axios.create({
  baseURL: `${window.location.origin}`,
  withCredentials: true,
});

Axios.interceptors.request.use((config) => {
  const userData = store.getState().app.user;
  if (!userData) return config;
  const token = userData.token;

  config.headers.Authorization = `bearer ${token}`;

  return config;
});

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const userData = store.getState().app.user;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          window.location.origin + "/api/auth/refresh",
          {},
          { withCredentials: true },
        );

        const { accessToken } = response.data;

        store.dispatch(setUser({ ...userData, token: accessToken }));

        socket.auth = {
          token: accessToken,
        };
        // Reconnect with the new token
        socket.disconnect();
        socket.connect();

        return Axios(originalRequest);
      } catch (refreshError) {
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    if (error.response?.status === 429) {
      store.dispatch(
        addGlobalNotification({
          type: "error",
          message: "Too many requests. Please try again later.",
        }),
      );
    }

    return Promise.reject(error);
  },
);

export default Axios;
