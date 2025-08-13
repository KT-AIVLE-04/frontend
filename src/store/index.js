import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import storeReducer from './storeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    store: storeReducer,
  },
}) 