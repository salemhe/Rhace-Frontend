import api from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk to fetch room types for a given hotelId
export const fetchRoomTypes = createAsyncThunk(
  "vendor/fetchRoomTypes",
  async (hotelId, { rejectWithValue }) => {
    if (!hotelId) return rejectWithValue("Missing hotelId");
    try {
      const res = await api.get(`/hotels/${hotelId}/roomtypes`);
      // axios responses expose the payload on `data`
      return res.data;
    } catch (err) {
      // prefer server-provided message when available
      const message = err?.response?.data?.message || err?.response?.data || err.message || "Network error";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  type: null,
  details: {
    id: "",
    email: ""
  },
  roomTypes: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setVendorType: (state, action) => {
      state.type = action.payload;
    },
    setVendorDetails: (state, action) => {
      state.details = { ...state.details, ...action.payload };
    },
    resetVendor: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomTypes.pending, (state) => {
        state.roomTypes.status = "loading";
        state.roomTypes.error = null;
      })
      .addCase(fetchRoomTypes.fulfilled, (state, action) => {
        state.roomTypes.status = "succeeded";
        // store items directly; action.payload expected to be an array
        state.roomTypes.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRoomTypes.rejected, (state, action) => {
        state.roomTypes.status = "failed";
        state.roomTypes.error = action.payload || action.error.message;
      });
  },
});

export const { setVendorType, setVendorDetails, resetVendor } = vendorSlice.actions;
export const selectVendorDetails = (state) => state.vendor.details;
export const selectRoomTypes = (state) => state.vendor.roomTypes;
export default vendorSlice.reducer;
