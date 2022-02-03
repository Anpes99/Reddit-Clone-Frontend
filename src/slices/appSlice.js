import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state = action.payload;
    },
  },
});

export const { addUser } = appSlice.actions;

// Selectors - This is how we pull information from the Global store slice
//export const selectItems = (state) => state.basket.items;

export default appSlice.reducer;
