import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  headerDropDownVisible: false,
  loginVisible: false,
  signUpVisible: false,
  currentSubreddit: null,
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
    setCurrentSubreddit: (state, action) => {
      state.currentSubreddit = action.payload;
    },
  },
});

export const {
  setUser,
  setHeaderDropDownVisible,
  setLoginVisible,
  setSignUpVisible,
  setCurrentSubreddit,
} = appSlice.actions;

// Selectors - This is how we pull information from the Global store slice
//export const selectItems = (state) => state.basket.items;

export default appSlice.reducer;
