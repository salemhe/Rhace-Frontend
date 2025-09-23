import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  vendor: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.vendor = null; // clear vendor if user logs in
    },
    setVendor: (state, action) => {
      state.vendor = action.payload;
      state.user = null; // clear user if vendor logs in
    },
    logout: (state) => {
      localStorage.removeItem("token")
      state.user = null;
      state.vendor = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setVendor, logout } = authSlice.actions;
export default authSlice.reducer;
