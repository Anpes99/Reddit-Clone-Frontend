import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  headerDropDownVisible: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    setHeaderDropDownVisible: (state, action) => {
      state.headerDropDownVisible = action.payload;
    },
  },
});

export const { addUser, setHeaderDropDownVisible } = appSlice.actions;

// Selectors - This is how we pull information from the Global store slice
//export const selectItems = (state) => state.basket.items;

export default appSlice.reducer;
