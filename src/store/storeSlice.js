import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { storeApi } from '../api/store';

// 매장 정보 가져오기 async thunk
export const fetchStoreById = createAsyncThunk(
  'store/fetchStoreById',
  async (storeId) => {
    const response = await storeApi.getStore(storeId);
    return response.data?.result;
  }
);

const initialState = {
  selectedStore: null,
  loading: false,
  error: null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    clearSelectedStore: (state) => {
      state.selectedStore = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStore = action.payload;
        state.error = null;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedStore } = storeSlice.actions;
export default storeSlice.reducer; 