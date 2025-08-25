import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { snsApi } from "../api/sns";
import { getEnabledSnsTypeIds, getEnabledSnsTypes } from "../const/snsTypes";
import { SnsAccount } from "../models/SnsAccount";

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
  async (storeId, { rejectWithValue }) => {
    console.log('fetchAllSnsAccounts 시작, storeId:', storeId);
    
    const platforms = getEnabledSnsTypeIds();
    console.log('사용 가능한 플랫폼 목록:', platforms);
    
    const results = {};

    for (const platform of platforms) {
      console.log(`${platform} API 호출 시작`);
      try {
        const response = await snsApi.account.getAccountInfo(platform);
        console.log(`${platform} API 호출 성공:`, response);
        results[platform] = {
          status: "connected",
          accountInfo: SnsAccount.fromResponse(response.data?.result),
          loading: false,
          error: null,
        };
      } catch (error) {
        console.log(`${platform} API 호출 실패:`, error);
        results[platform] = {
          status: error.response?.status === 404 ? "disconnected" : "error",
          accountInfo: null,
          loading: false,
          error: error.response?.status === 404 ? null : error.message,
        };
      }
    }

    console.log('fetchAllSnsAccounts 완료, 결과:', results);
    return results;
  }
);

// 사용 가능한 SNS_TYPES를 활용해서 동적으로 초기 상태 생성
const createInitialConnections = () => {
  const connections = {};
  getEnabledSnsTypes().forEach(platform => {
    connections[platform.id] = {
      status: "disconnected", // 'disconnected', 'connecting', 'connected', 'error'
      accountInfo: null,
      loading: false,
      error: null,
    };
  });
  return connections;
};

const initialState = {
  connections: createInitialConnections(),
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
