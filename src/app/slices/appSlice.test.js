import appReducer, {
  addGlobalNotification,
  removeGlobalNotification,
  setUser,
} from "./appSlice";

const initialState = appReducer(undefined, { type: "@@INIT" });

describe("appSlice", () => {
  it("starts logged out with no notifications", () => {
    expect(initialState.user).toBeNull();
    expect(initialState.globalNotifications).toEqual([]);
  });

  it("stores the logged-in user", () => {
    const state = appReducer(initialState, setUser({ username: "test_user1" }));

    expect(state.user).toEqual({ username: "test_user1" });
  });

  it("gives each notification an id", () => {
    const state = appReducer(
      initialState,
      addGlobalNotification({ type: "error", message: "Oops" }),
    );

    expect(state.globalNotifications).toEqual([
      { type: "error", message: "Oops", id: expect.any(String) },
    ]);
  });

  it("ignores a notification with the same message as a visible one", () => {
    let state = appReducer(
      initialState,
      addGlobalNotification({ type: "error", message: "Oops" }),
    );
    state = appReducer(
      state,
      addGlobalNotification({ type: "error", message: "Oops" }),
    );

    expect(state.globalNotifications).toHaveLength(1);
  });

  it("keeps at most five notifications, dropping the oldest", () => {
    let state = initialState;
    for (let i = 1; i <= 6; i++) {
      state = appReducer(
        state,
        addGlobalNotification({ type: "info", message: `Message ${i}` }),
      );
    }

    expect(state.globalNotifications.map((n) => n.message)).toEqual([
      "Message 2",
      "Message 3",
      "Message 4",
      "Message 5",
      "Message 6",
    ]);
  });

  it("removes a notification by id", () => {
    let state = appReducer(
      initialState,
      addGlobalNotification({ type: "info", message: "First" }),
    );
    state = appReducer(
      state,
      addGlobalNotification({ type: "info", message: "Second" }),
    );
    const [first] = state.globalNotifications;

    state = appReducer(state, removeGlobalNotification({ id: first.id }));

    expect(state.globalNotifications.map((n) => n.message)).toEqual(["Second"]);
  });
});
