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
      state.isAuthenticated = true;
    },
    setVendor: (state, action) => {
      state.vendor = action.payload;
      state.user = null; // clear user if vendor logs in
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem("token")
      console.log("Logging out!")
      state.user = null;
      state.vendor = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setVendor, logout } = authSlice.actions;
export default authSlice.reducer;
