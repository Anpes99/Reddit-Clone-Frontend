import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  headerDropDownVisible: false,
  loginVisible: false,
  signUpVisible: false,
  currentSubreddit: null,
  navigationDrawerVisible: false,
  navigationDrawerOpenedFromHeader: false,
  globalNotifications: [],
  emailVerificationModal: { email: "anpesipp99@gmail.com", isVisible: false },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setHeaderDropDownVisible: (state, action) => {
      state.headerDropDownVisible = action.payload;
    },
    setLoginVisible: (state, action) => {
      state.loginVisible = action.payload;
    },
    setSignUpVisible: (state, action) => {
      state.signUpVisible = action.payload;
    },
    setEmailVerificationModal: (state, action) => {
      state.emailVerificationModal = action.payload;
    },
    setCurrentSubreddit: (state, action) => {
      state.currentSubreddit = action.payload;
    },
    setNavigationDrawerVisible: (state, action) => {
      state.navigationDrawerVisible = action.payload;
    },
    setNavigationDrawerOpenedFromHeader: (state, action) => {
      state.navigationDrawerOpenedFromHeader = action.payload;
    },
    addGlobalNotification: (state, action) => {
      if (
        state.globalNotifications.find(
          (notification) => notification.message === action.payload.message,
        )
      ) {
        return;
      }
      if (state.globalNotifications.length === 5) {
        state.globalNotifications.shift();
      }
      state.globalNotifications.push({ ...action.payload, id: nanoid() });
    },
    removeGlobalNotification: (state, action) => {
      state.globalNotifications = state.globalNotifications.filter(
        (notification) => notification.id !== action.payload.id,
      );
    },
  },
});

export const {
  setUser,
  setHeaderDropDownVisible,
  setLoginVisible,
  setSignUpVisible,
  setCurrentSubreddit,
  setNavigationDrawerVisible,
  setNavigationDrawerOpenedFromHeader,
  addGlobalNotification,
  removeGlobalNotification,
  setEmailVerificationModal,
} = appSlice.actions;

export default appSlice.reducer;
