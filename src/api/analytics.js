import { testApi } from './axios';

const BASE_URL = '/analytics'

export const analyticsApi = {
  // ===== 실시간 API =====
  
  // 실시간 계정 메트릭 조회
  getRealtimeAccountMetrics: (accountId) => 
    testApi.get(`${BASE_URL}/realtime/accounts/metrics`, { 
      params: { accountId } 
    }),
  
  // 실시간 게시물 메트릭 조회
  getRealtimePostMetrics: (accountId, postId = null) => {
    const params = { accountId };
    if (postId) params.postId = postId;
    return testApi.get(`${BASE_URL}/realtime/posts/metrics`, { params });
  },
  
  // 실시간 게시물 댓글 조회
  getRealtimeComments: (accountId, postId = null, page = 0, size = 20) => {
    const params = { accountId, page, size };
    if (postId) params.postId = postId;
    return testApi.get(`${BASE_URL}/realtime/posts/comments`, { params });
  },
  
  // ===== 히스토리 API =====
  
  // 히스토리 계정 메트릭 조회
  getHistoryAccountMetrics: (date, accountId) => 
    testApi.get(`${BASE_URL}/history/accounts/metrics`, { 
      params: { date, accountId } 
    }),
  
  // 히스토리 게시물 메트릭 조회
  getHistoryPostMetrics: (date, accountId, postId = null) => {
    const params = { date, accountId };
    if (postId) params.postId = postId;
    return testApi.get(`${BASE_URL}/history/posts/metrics`, { params });
  },
  
  // 히스토리 게시물 댓글 조회
  getHistoryComments: (date, accountId, postId = null, page = 0, size = 20) => {
    const params = { date, accountId, page, size };
    if (postId) params.postId = postId;
    return testApi.get(`${BASE_URL}/history/posts/comments`, { params });
  },
  
  // 히스토리 게시물 감정분석 조회
  getHistoryEmotionAnalysis: (date, accountId, postId = null) => {
    const params = { date, accountId };
    if (postId) params.postId = postId;
    return testApi.get(`${BASE_URL}/history/posts/emotion-analysis`, { params });
  },
  
  // 감정 분석 조회 (API 명세서에 맞게 추가)
  getEmotionAnalysis: (date, accountId) => 
    testApi.get(`${BASE_URL}/history/emotion-analysis`, { 
      params: { date, accountId } 
    }),
  

  
  // ===== 기존 호환성 API (점진적 마이그레이션용) =====
  
  // 콘텐츠 성과 분석 (기존)
  getContentPerformance: (params) => testApi.get(`${BASE_URL}/content-performance`, { params }),
} 