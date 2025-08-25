import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { snsApi } from "../api/sns";
import { SNS_TYPES, SnsAccount } from "../models/SnsAccount";

// SNS 계정 정보 가져오기 async thunk
export const fetchSnsAccount = createAsyncThunk(
  "sns/fetchSnsAccount",
  async (snsType, { rejectWithValue }) => {
    try {
      const response = await snsApi.account.getAccountInfo(snsType);
      return {
        snsType,
        accountData: response.data?.result,
      };
    } catch (error) {
      return rejectWithValue({
        snsType,
        error: error.response?.status === 404 ? "not_found" : error.message,
        status: error.response?.status,
      });
    }
  }
);

// 모든 SNS 계정 정보 가져오기
export const fetchAllSnsAccounts = createAsyncThunk(
  "sns/fetchAllSnsAccounts",
  async (_, { rejectWithValue }) => {
    const platforms = SNS_TYPES.getSnsTypes();
    const results = {};

    for (const platform of platforms) {
      try {
        const response = await snsApi.account.getAccountInfo(platform);
        results[platform] = {
          status: "connected",
          accountInfo: SnsAccount.fromResponse(response.data?.result),
          loading: false,
          error: null,
        };
      } catch (error) {
        results[platform] = {
          status: error.response?.status === 404 ? "disconnected" : "error",
          accountInfo: null,
          loading: false,
          error: error.response?.status === 404 ? null : error.message,
        };
      }
    }

    return results;
  }
);

const initialState = {
  connections: {
    [SNS_TYPES.YOUTUBE]: {
      status: "disconnected", // 'disconnected', 'connecting', 'connected', 'error'
      accountInfo: null,
      loading: false,
      error: null,
    },
    [SNS_TYPES.INSTAGRAM]: {
      status: "disconnected",
      accountInfo: null,
      loading: false,
      error: null,
    },
    [SNS_TYPES.FACEBOOK]: {
      status: "disconnected",
      accountInfo: null,
      loading: false,
      error: null,
    },
  },
  loading: false,
  error: null,
};

const snsSlice = createSlice({
  name: "sns",
  initialState,
  reducers: {
    // 연결 상태 업데이트
    updateConnectionState: (state, action) => {
      const { platform, updates } = action.payload;
      if (state.connections[platform]) {
        state.connections[platform] = {
          ...state.connections[platform],
          ...updates,
        };
      }
    },

    // 특정 플랫폼 연결 해제
    disconnectPlatform: (state, action) => {
      const platform = action.payload;
      if (state.connections[platform]) {
        state.connections[platform] = {
          status: "disconnected",
          accountInfo: null,
          loading: false,
          error: null,
        };
      }
    },

    // 모든 연결 초기화
    clearAllConnections: (state) => {
      Object.keys(state.connections).forEach((platform) => {
        state.connections[platform] = {
          status: "disconnected",
          accountInfo: null,
          loading: false,
          error: null,
        };
      });
    },

    // 에러 클리어
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 단일 SNS 계정 정보 가져오기
      .addCase(fetchSnsAccount.pending, (state, action) => {
        const snsType = action.meta.arg;
        if (state.connections[snsType]) {
          state.connections[snsType].loading = true;
          state.connections[snsType].error = null;
        }
      })
      .addCase(fetchSnsAccount.fulfilled, (state, action) => {
        const { snsType, accountData } = action.payload;
        if (state.connections[snsType]) {
          state.connections[snsType] = {
            status: "connected",
            accountInfo: SnsAccount.fromResponse(accountData),
            loading: false,
            error: null,
          };
        }
      })
      .addCase(fetchSnsAccount.rejected, (state, action) => {
        const { snsType, error: errorMsg, status } = action.payload || {};
        const snsTypeFromMeta = action.meta.arg;
        const targetSnsType = snsType || snsTypeFromMeta;

        if (state.connections[targetSnsType]) {
          const isNotFound = status === 404 || errorMsg === "not_found";
          state.connections[targetSnsType] = {
            status: isNotFound ? "disconnected" : "error",
            accountInfo: null,
            loading: false,
            error: isNotFound ? null : errorMsg || action.error.message,
          };
        }
      })

      // 모든 SNS 계정 정보 가져오기
      .addCase(fetchAllSnsAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSnsAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = { ...state.connections, ...action.payload };
      })
      .addCase(fetchAllSnsAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  updateConnectionState,
  disconnectPlatform,
  clearAllConnections,
  clearError,
} = snsSlice.actions;

export default snsSlice.reducer;
