import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import socket from "../shared/lib/socket";

const listenerMiddleware = createListenerMiddleware();

// Reconnect the socket whenever the access token changes (login, refresh,
// logout), so it is always authenticated as the current user.
listenerMiddleware.startListening({
  predicate: (action, currentState, previousState) =>
    currentState.app.user?.token !== previousState.app.user?.token,
  effect: (action, { getState }) => {
    const token = getState().app.user?.token;
    socket.auth = token ? { token } : {};
    socket.disconnect();
    socket.connect();
  },
});

// Tests use makeStore to get a store with the same middleware as the app.
export const makeStore = (preloadedState) =>
  configureStore({
    reducer: {
      app: appReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  });

export const store = makeStore();
