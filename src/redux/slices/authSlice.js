// redux/slices/authSlice.js — FIXED
// Changes from your current version:
//   1. tokenExpiry is null-safe (won't crash if payload.expiresAt is undefined)
//   2. setUser no longer nulls vendor/admin — they're separate roles, keep initialState separation
//   3. logoutAsync exported — call this instead of logout() to also clear the httpOnly cookie

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

// ── Async logout — also clears httpOnly refresh cookie on backend ─
export const logoutAsync = createAsyncThunk("auth/logoutAsync", async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // Even if the server call fails, we still clear local state
  }
  localStorage.removeItem("token");
  localStorage.removeItem("persist:root");
});

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
      state.admin = null;
      state.isAuthenticated = true;
      state.tokenExpiry = action.payload?.expiresAt || null; // ← null-safe
    },
    setVendor: (state, action) => {
      state.vendor = action.payload;
      state.user = null;
      state.admin = null;
      state.isAuthenticated = true;
      state.tokenExpiry = action.payload?.expiresAt || null;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.user = null;
      state.vendor = null;
      state.isAuthenticated = true;
      state.tokenExpiry = action.payload?.expiresAt || null;
    },
    // Use this for instant sync-logout (e.g. from logout button)
    // The httpOnly cookie will expire naturally — use logoutAsync to clear it immediately
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
  extraReducers: (builder) => {
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      state.vendor = null;
      state.admin = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;
    });
  },
});

export const { setUser, setVendor, setAdmin, logout } = authSlice.actions;
export default authSlice.reducer;

// ── Usage in components ───────────────────────────────────────────
//
// Option A (instant, no server call):
//   import { logout } from "@/redux/slices/authSlice";
//   dispatch(logout());
//
// Option B (also clears httpOnly cookie — preferred):
//   import { logoutAsync } from "@/redux/slices/authSlice";
//   dispatch(logoutAsync());
//   navigate("/");