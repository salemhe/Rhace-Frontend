import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

export const logoutAsync = createAsyncThunk(
  "auth/logoutAsync",
  async (_, { dispatch }) => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout API call failed, clearing local state anyway");
    }

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("vendor_token");
    localStorage.removeItem("auth_token");

    // Clear Redux state
    dispatch(authSlice.actions.logout());
  }
);

const initialState = {
  user: null,
  vendor: null,
  admin: null,
  isAuthenticated: false,
  tokenExpiry: null,
  loading: false,
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
      state.tokenExpiry = action.payload?.expiresAt || null;
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
    logout: (state) => {
      state.user = null;
      state.vendor = null;
      state.admin = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        // Already handled in the thunk via dispatch(logout())
        state.loading = false;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUser, setVendor, setAdmin, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;