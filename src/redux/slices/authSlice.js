import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  vendor: null,
  admin: null,
  isAuthenticated: false,
  tokenExpiry: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.vendor = null;
      state.isAuthenticated = true;
      state.tokenExpiry = action.payload.expiresAt;
    },
    setVendor: (state, action) => {
      state.vendor = action.payload;
      state.user = null;
      state.admin = null;
      state.isAuthenticated = true;
      state.tokenExpiry = action.payload.expiresAt;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.user = null;
      state.vendor = null;
      state.isAuthenticated = true;
      state.tokenExpiry = action.payload.expiresAt;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("persist:root");
      state.user = null;
      state.vendor = null;
      state.admin = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;
    },
  },
});

export const { setUser, setVendor, setAdmin, logout } = authSlice.actions;
export default authSlice.reducer;
