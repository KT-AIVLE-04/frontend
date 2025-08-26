import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import storeReducer from "./storeSlice";
import snsReducer from "./snsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    store: storeReducer,
    sns: snsReducer,
  },
});
