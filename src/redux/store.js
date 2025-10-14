import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import vendorReducer from "./slices/vendorSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // which slices to persist
};

const rootReducer = combineReducers({
  auth: authReducer,
  vendor: vendorReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required by redux-persist
    }),
});

export const persistor = persistStore(store);