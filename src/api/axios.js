import axios from "axios";
import { store } from "../store";
import { logout, updateToken } from "../store/authSlice";
import { authApi } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CORS 에러 해결
});

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
// 대기 중인 요청들을 저장하는 배열
let failedQueue = [];

const processQueue = (error, accessToken = null) => {
  failedQueue.forEach(({ reject }) => {
    reject(error);
  });
  failedQueue.forEach(({ resolve }) => {
    resolve(accessToken);
  });
  failedQueue = [];
};

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // storeId가 true인 경우 X-STORE-ID 헤더 자동 추가
    if (config.storeId === true) {
      const selectedStore = store.getState().store.selectedStore;
      if (selectedStore?.id) {
        console.log("currentStoreId", selectedStore.id);
        config.headers["X-STORE-ID"] = selectedStore.id;
      }
      delete config.storeId; // 헤더 추가 후 제거
    }

    // FormData인 경우 Content-Type 헤더 제거
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    // 성공 응답 로그
    console.log(
      `✅ API Success ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`
    );
    console.log("Response:", response.data);

    //set cookie
    console.log("response", response.headers);
    const cookie = response.headers["set-cookie"];
    console.log("cookie", cookie);
    if (cookie) {
      document.cookie = cookie;
    }

    return response;
  },
  async (error) => {
    // 에러 응답 로그
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();

    console.log(`❌ API Error%c ${method} ${url}`);
    console.log(`Status: ${status} ${statusText}`);
    console.log("Error Message:", error.response?.data || error.message);

    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 요청인 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      // 이미 토큰 갱신 중인 경우, 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((accessToken) => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // 새로운 토큰발급
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // refreshToken으로 새로운 accessToken 발급
        const response = await authApi.refresh(refreshToken);
        const { accessToken } = response.data;
        store.dispatch(updateToken({ accessToken }));

        // 대기 중인 요청들 처리
        processQueue(null, accessToken);

        // 원래 요청 재시도(긍까 마지막요청이 되는것임)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // refreshToken도 만료된 경우 로그아웃
        isRefreshing = false;
        processQueue(refreshError, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const testApi = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // CORS 에러 해결
});

// 요청 인터셉터
testApi.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.headers["X-USER-ID"] = 3; // 로컬테스트용
    // storeId가 true인 경우 X-STORE-ID 헤더 자동 추가
    if (config.storeId) {
      const selectedStore = store.getState().store.selectedStore;
      if (selectedStore?.id) {
        console.log("currentStoreId", selectedStore.id);
        config.headers["X-STORE-ID"] = selectedStore.id;
      }
      delete config.storeId; // 헤더 추가 후 제거
    }

    // FormData인 경우 Content-Type 헤더 제거
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
