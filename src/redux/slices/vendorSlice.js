import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: null,
  details: {
    id: "",
    email: ""
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
});

export const { setVendorType, setVendorDetails, resetVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
