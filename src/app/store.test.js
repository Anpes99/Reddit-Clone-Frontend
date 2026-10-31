import socket from "../shared/lib/socket";
import { makeStore } from "./store";
import { setUser } from "./slices/appSlice";

const alice = { id: 1, username: "alice", ratedPosts: [] };

beforeEach(() => {
  socket.auth = {};
  socket.connect.mockClear();
  socket.disconnect.mockClear();
});

const expectReconnected = () => {
  expect(socket.disconnect).toHaveBeenCalledTimes(1);
  expect(socket.connect).toHaveBeenCalledTimes(1);
  // The socket must disconnect before connecting again with the new auth.
  expect(socket.disconnect.mock.invocationCallOrder[0]).toBeLessThan(
    socket.connect.mock.invocationCallOrder[0],
  );
};

describe("socket token sync", () => {
  it("connects the socket with the token on login", () => {
    const store = makeStore();

    store.dispatch(setUser({ ...alice, token: "access-1" }));

    expect(socket.auth).toEqual({ token: "access-1" });
    expectReconnected();
  });

  it("reconnects with the new token after a refresh", () => {
    const store = makeStore();
    store.dispatch(setUser({ ...alice, token: "access-1" }));
    socket.connect.mockClear();
    socket.disconnect.mockClear();

    store.dispatch(setUser({ ...alice, token: "access-2" }));

    expect(socket.auth).toEqual({ token: "access-2" });
    expectReconnected();
  });

  it("reconnects without a token on logout", () => {
    const store = makeStore();
    store.dispatch(setUser({ ...alice, token: "access-1" }));
    socket.connect.mockClear();
    socket.disconnect.mockClear();

    store.dispatch(setUser(null));

    expect(socket.auth).toEqual({});
    expectReconnected();
  });

  it("does not reconnect when the user changes but the token does not", () => {
    // setUser is also dispatched for votes, joined subreddits and so on.
    const store = makeStore();
    store.dispatch(setUser({ ...alice, token: "access-1" }));
    socket.connect.mockClear();
    socket.disconnect.mockClear();

    store.dispatch(
      setUser({
        ...alice,
        token: "access-1",
        ratedPosts: [{ id: 7, rating: 1 }],
      }),
    );

    expect(socket.auth).toEqual({ token: "access-1" });
    expect(socket.disconnect).not.toHaveBeenCalled();
    expect(socket.connect).not.toHaveBeenCalled();
  });

  it("does not reconnect for actions unrelated to the user", () => {
    const store = makeStore();

    store.dispatch({ type: "app/setLoginVisible", payload: true });

    expect(socket.connect).not.toHaveBeenCalled();
  });
});
