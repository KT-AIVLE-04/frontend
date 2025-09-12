import api from './axios';

const BASE_URL = '/analytics'

export const analyticsApi = {
  // ===== 실시간 API =====

  // 실시간 계정 메트릭 조회
  getRealtimeAccountMetrics: (snsType) =>
    api.get(`${BASE_URL}/realtime/accounts/metrics`, {
      snsType
    }),

  // 실시간 게시물 메트릭 조회
  getRealtimePostMetrics: (snsType, postId = null) => {
    const params = {};
    if (postId) params.postId = postId;
    return api.get(`${BASE_URL}/realtime/posts/metrics`, {
      snsType,
      params
    });
  },

  // 실시간 게시물 댓글 조회
  getRealtimeComments: (snsType, postId = null, pageToken = null, size = 5) => {
    const params = {size};
    if (postId) params.postId = postId;
    if (pageToken) params.pageToken = pageToken;
    return api.get(`${BASE_URL}/posts/comments`, {
      snsType,
      params
    });
  },

  // ===== 히스토리 API =====

  // 히스토리 계정 메트릭 조회
  getHistoryAccountMetrics: (date, snsType) =>
    api.get(`${BASE_URL}/history/accounts/metrics`, {
      snsType,
      params: {date}
    }),

  // 히스토리 게시물 메트릭 조회
  getHistoryPostMetrics: (date, snsType, postId = null) => {
    const params = {date};
    if (postId) params.postId = postId;
    return api.get(`${BASE_URL}/history/posts/metrics`, {
      snsType,
      params
    });
  },

  // 히스토리 게시물 감정분석 조회
  getHistoryEmotionAnalysis: (date, snsType, postId = null) => {
    const params = {date};
    if (postId) params.postId = postId;
    return api.get(`${BASE_URL}/history/posts/emotion-analysis`, {
      snsType,
      params
    });
  }
} 