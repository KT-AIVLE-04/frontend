import api from "./axios";

export const snsApi = {
  // === OAuth 인증 관련 (SnsOAuthController) ===
  oauth: {
    // OAuth 인증 URL 조회
    getAuthUrl: (snsType) => {
      return api.get(`/sns/oauth/${snsType}/login`, { storeId: true });
    },

    // OAuth 콜백 처리
    callback: (snsType, code, state) => {
      return api.get(`/sns/oauth/${snsType}/callback`, {
        params: { code, state },
      });
    },
  },

  // === SNS 계정 관리 (SnsAccountController) ===
  account: {
    // SNS 계정 정보 조회
    getAccountInfo: (snsType) => {
      return api.get(`/sns/account/${snsType}`, { storeId: true });
    },

    // SNS 계정 정보 수정
    updateAccount: (snsType, data) => {
      return api.put(`/sns/account/${snsType}`, data);
    },
  },

  // === SNS 포스트 관리 (SnsPostController) ===
  post: {
    // 게시물 업로드
    uploadPost: (data) => {
      return api.post("/sns/posts", data, { storeId: true });
    },

    // 게시물 목록 조회
    getPosts: () => {
      return api.get("/sns/posts", { storeId: true });
    },

    // 게시물 상세 조회
    getPost: (postId) => {
      return api.get(`/sns/posts/${postId}`, { storeId: true });
    },

    // 게시물 삭제
    deletePost: (postId, data) => {
      return api.delete(`/sns/posts/${postId}`, {
        data,
        storeId: true,
      });
    },
  },

  // === AI 포스트 생성 ===
  ai: {
    // AI 포스트 생성
    uploadAiPost: (data) => {
      return api.post("/sns/posts/ai", data);
    },

    // AI 태그 생성
    uploadAiTag: (data) => {
      return api.post("/sns/posts/ai/tag", data);
    },
  },
};
