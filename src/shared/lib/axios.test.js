import axios from "axios";
import Axios from "./axios";
import socket from "./socket";
import { store } from "../../app/store";
import { setUser } from "../../app/slices/appSlice";

// Sends every request made through the Axios instance to this mock instead of
// the network. It returns the next queued response for the request's URL.
const adapter = jest.fn();
Axios.defaults.adapter = adapter;

const respond = (config, status, data = {}) => {
  const response = { status, data, headers: {}, config, statusText: "" };
  if (status >= 400) {
    const error = new Error(`Request failed with status code ${status}`);
    error.config = config;
    error.response = response;
    return Promise.reject(error);
  }
  return Promise.resolve(response);
};

const originalLocation = window.location;

beforeAll(() => {
  delete window.location;
  window.location = { origin: "http://localhost", href: "http://localhost/" };
});

afterAll(() => {
  window.location = originalLocation;
});

beforeEach(() => {
  adapter.mockReset();
  jest.restoreAllMocks();
  socket.connect.mockClear();
  socket.disconnect.mockClear();
  socket.auth = {};
  store.dispatch(setUser(null));
  window.location.href = "http://localhost/";
});

describe("request interceptor", () => {
  it("sends the logged-in user's access token", async () => {
    store.dispatch(setUser({ username: "test_user1", token: "access-1" }));
    adapter.mockImplementation((config) => respond(config, 200));

    await Axios.get("/api/posts/1");

    expect(adapter.mock.calls[0][0].headers.Authorization).toBe(
      "bearer access-1",
    );
  });

  it("sends no Authorization header when logged out", async () => {
    adapter.mockImplementation((config) => respond(config, 200));

    await Axios.get("/api/posts/1");

    expect(adapter.mock.calls[0][0].headers.Authorization).toBeUndefined();
  });
});

describe("response interceptor", () => {
  it("refreshes an expired access token and retries the request", async () => {
    store.dispatch(setUser({ username: "test_user1", token: "expired" }));
    adapter
      .mockImplementationOnce((config) => respond(config, 401))
      .mockImplementationOnce((config) =>
        respond(config, 200, { post: { id: 1 } }),
      );
    const refresh = jest
      .spyOn(axios, "post")
      .mockResolvedValue({ data: { accessToken: "access-2" } });

    const response = await Axios.get("/api/posts/1");

    expect(refresh).toHaveBeenCalledWith(
      "http://localhost/api/auth/refresh",
      {},
      { withCredentials: true },
    );
    expect(response.data).toEqual({ post: { id: 1 } });
    expect(adapter).toHaveBeenCalledTimes(2);
    expect(adapter.mock.calls[1][0].headers.Authorization).toBe(
      "bearer access-2",
    );
    expect(store.getState().app.user).toEqual({
      username: "test_user1",
      token: "access-2",
    });
  });

  it("reconnects the socket with the refreshed token", async () => {
    store.dispatch(setUser({ username: "test_user1", token: "expired" }));
    adapter
      .mockImplementationOnce((config) => respond(config, 401))
      .mockImplementationOnce((config) => respond(config, 200));
    jest
      .spyOn(axios, "post")
      .mockResolvedValue({ data: { accessToken: "access-2" } });

    await Axios.get("/api/posts/1");

    expect(socket.auth).toEqual({ token: "access-2" });
    expect(socket.disconnect).toHaveBeenCalled();
    expect(socket.connect).toHaveBeenCalled();
  });

  it("retries a request only once", async () => {
    store.dispatch(setUser({ username: "test_user1", token: "expired" }));
    adapter.mockImplementation((config) => respond(config, 401));
    jest
      .spyOn(axios, "post")
      .mockResolvedValue({ data: { accessToken: "access-2" } });

    await expect(Axios.get("/api/posts/1")).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(adapter).toHaveBeenCalledTimes(2);
  });

  it("sends the user to the front page when the refresh fails", async () => {
    store.dispatch(setUser({ username: "test_user1", token: "expired" }));
    adapter.mockImplementation((config) => respond(config, 401));
    const refreshError = new Error("refresh token revoked");
    jest.spyOn(axios, "post").mockRejectedValue(refreshError);

    await expect(Axios.get("/api/posts/1")).rejects.toBe(refreshError);
    expect(window.location.href).toBe("/");
  });

  it("does not try to refresh when the refresh request itself fails", async () => {
    adapter.mockImplementation((config) => respond(config, 401));
    const refresh = jest.spyOn(axios, "post");

    await expect(Axios.post("/api/auth/refresh")).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(refresh).not.toHaveBeenCalled();
  });

  it("shows a notification when the user is rate limited", async () => {
    adapter.mockImplementation((config) => respond(config, 429));

    await expect(Axios.get("/api/posts/1")).rejects.toMatchObject({
      response: { status: 429 },
    });
    expect(store.getState().app.globalNotifications).toEqual([
      expect.objectContaining({
        type: "error",
        message: "Too many requests. Please try again later.",
      }),
    ]);
  });
});
