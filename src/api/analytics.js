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
  getRealtimeComments: (snsType, postId = null, page = 0, size = 20) => {
    const params = { page, size };
    if (postId) params.postId = postId;
    return api.get(`${BASE_URL}/realtime/posts/comments`, { 
      snsType,
      params 
    });
  },
  
  // ===== 히스토리 API =====
  
  // 히스토리 계정 메트릭 조회
  getHistoryAccountMetrics: (date, snsType) => 
    api.get(`${BASE_URL}/history/accounts/metrics`, { 
      snsType,
      params: { date } 
    }),
  
  // 히스토리 게시물 메트릭 조회
  getHistoryPostMetrics: (date, snsType, postId = null) => {
    const params = { date };
    if (postId) params.postId = postId;
    return api.get(`${BASE_URL}/history/posts/metrics`, { 
      snsType,
      params 
    });
  },
  
  // 히스토리 게시물 댓글 조회
  getHistoryComments: (date, snsType, postId = null, page = 0, size = 20) => {
    const params = { date, page, size };
    if (postId) params.postId = postId;
    return api.get(`${BASE_URL}/history/posts/comments`, { 
      snsType,
      params 
    });
  },
  
  // 히스토리 게시물 감정분석 조회
  getHistoryEmotionAnalysis: (date, snsType, postId = null) => {
    const params = { date };
    if (postId) params.postId = postId;
    return api.get(`${BASE_URL}/history/posts/emotion-analysis`, { 
      snsType,
      params 
    });
  },
  
  // 감정 분석 조회 (API 명세서에 맞게 추가)
  getEmotionAnalysis: (date, snsType) => 
    api.get(`${BASE_URL}/history/emotion-analysis`, { 
      snsType,
      params: { date } 
    }),
  
  // ===== AI 분석 보고서 API =====
  
  // AI 분석 보고서 조회 (캐시 포함)
  getAiReport: (snsType, postId) => 
    api.get(`${BASE_URL}/realtime/posts/report`, { 
      snsType,
      params: { postId },
      storeId: true // X-STORE-ID 헤더 자동 추가
    }),
  
  // ===== 기존 호환성 API (점진적 마이그레이션용) =====
  
  // 콘텐츠 성과 분석 (기존)
  getContentPerformance: (params) => api.get(`${BASE_URL}/content-performance`, { params }),
} 