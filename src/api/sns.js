import api from "./axios";
import { store } from "../store";

// 사용자 ID만 헤더에 추가하는 헬퍼 함수
const getUserConfig = (additionalHeaders = {}) => {
  const state = store.getState();
  const userId = state.auth.user?.id || state.auth.user?.memberId;

  return {
    headers: {
      ...(userId && { "X-USER-ID": userId }),
      ...additionalHeaders,
    },
  };
};

// 사용자 ID와 매장 ID를 헤더에 추가하는 헬퍼 함수
const getUserStoreConfig = (storeId = null, additionalHeaders = {}) => {
  const state = store.getState();
  const userId = state.auth.user?.id || state.auth.user?.memberId;
  const selectedStoreId = storeId || state.auth.selectedStoreId;

  return {
    headers: {
      ...(userId && { "X-USER-ID": userId }),
      ...(selectedStoreId && { "X-STORE-ID": selectedStoreId }),
      ...additionalHeaders,
    },
  };
};

export const snsApi = {
  // === OAuth 인증 관련 ===
  oauth: {
    getAuthUrl: (snsType, storeId) => {
      const config = getUserStoreConfig(storeId); // USER-ID + STORE-ID 필요
      return api.get(`/sns/oauth/${snsType}/url`, config);
    },

    callback: (snsType, code, state) => {
      return api.get(`/sns/oauth/${snsType}/callback`, {
        params: { code, state },
      });
    },
  },

  // === SNS 계정 관리 ===
  account: {
    // SNS 계정 정보 조회
    getAccountInfo: (snsType, storeId) => {
      const config = getUserStoreConfig(storeId); // USER-ID + STORE-ID 필요
      return api.get(`/sns/account/${snsType}`, config);
    },

    // SNS 계정 정보 수정
    updateAccount: (snsType, data) => {
      const config = getUserConfig(); // USER-ID만 필요
      return api.put(`/sns/account/${snsType}`, data, config);
    },

    // SNS 포스트 목록 조회
    getPostList: (snsType, storeId) => {
      const config = getUserStoreConfig(storeId); // USER-ID + STORE-ID 필요
      return api.get(`/sns/account/${snsType}/list`, config);
    },
  },

  // === SNS 포스트 관리 ===
  post: {
    // 동영상 업로드
    uploadVideo: (snsType, data) => {
      const config = getUserConfig(); // USER-ID만 필요
      return api.post(`/sns/video/${snsType}/upload`, data, config);
    },

    // 동영상 정보 수정
    updateVideo: (snsType, data) => {
      const config = getUserConfig(); // USER-ID만 필요
      return api.put(`/sns/video/${snsType}/update`, data, config);
    },

    // 동영상 삭제
    deleteVideo: (snsType, data) => {
      const config = getUserConfig(); // USER-ID만 필요
      return api.delete(`/sns/video/${snsType}/delete`, {
        ...config,
        data,
      });
    },
  },

  // === AI 포스트 생성 ===
  ai: {
    // 제목 + 본문 + 해시태그 생성
    createPost: (data) => {
      return api.post("/posts/ai/post", data);
    },

    // 해시태그 생성
    createHashtags: (data) => {
      return api.post("/posts/ai/hashtags", data);
    },
  },
};
