import api, { testApi } from './axios'

const BASE_URL = '/analytics'

export const analyticsApi = {
  // ===== 실시간 API =====
  
  // 실시간 계정 메트릭 조회
  getRealtimeAccountMetrics: (snsType) => 
    testApi.get(`${BASE_URL}/realtime/accounts/metrics`, { 
      params: { snsType } 
    }),
  
  // 실시간 게시물 메트릭 조회
  getRealtimePostMetrics: (snsType, postId = null) => {
    const params = { snsType };
    if (postId) params.postId = postId;
    return testApi.get(`${BASE_URL}/realtime/posts/metrics`, { params });
  },
  
  // 실시간 게시물 댓글 조회
  getRealtimeComments: (snsType, postId = null, page = 0, size = 20) => {
    const params = { snsType, page, size };
    if (postId) params.postId = postId;
    return testApi.get(`${BASE_URL}/realtime/posts/comments`, { params });
  },
  
  // ===== 히스토리 API =====
  
  // 히스토리 계정 메트릭 조회
  getHistoryAccountMetrics: (date, snsType) => 
    testApi.get(`${BASE_URL}/history/accounts/metrics`, { 
      params: { date, snsType } 
    }),
  
  // 히스토리 게시물 메트릭 조회
  getHistoryPostMetrics: (date, snsType, postId = null) => {
    const params = { date, snsType };
    if (postId) params.postId = postId;
    return testApi.get(`${BASE_URL}/history/posts/metrics`, { params });
  },
  
  // 히스토리 게시물 댓글 조회
  getHistoryComments: (snsType, postId = null, page = 0, size = 20) => {
    const params = { snsType, page, size };
    if (postId) params.postId = postId;
    return testApi.get(`${BASE_URL}/history/posts/comments`, { params });
  },
  
  // 히스토리 게시물 감정분석 조회
  getHistoryEmotionAnalysis: (date, snsType, postId = null) => {
    const params = { date, snsType };
    if (postId) params.postId = postId;
    return testApi.get(`${BASE_URL}/history/posts/emotion-analysis`, { params });
  },
  
  // ===== 배치 API =====
  
  // 계정 메트릭 수집
  collectAccountMetrics: () => 
    testApi.post(`${BASE_URL}/batch/accounts/metrics`),
  
  // 특정 계정 메트릭 수집
  collectSpecificAccountMetrics: (accountId) => 
    testApi.post(`${BASE_URL}/batch/accounts/${accountId}/metrics`),
  
  // 게시물 메트릭 수집
  collectPostMetrics: () => 
    testApi.post(`${BASE_URL}/batch/posts/metrics`),
  
  // 특정 게시물 메트릭 수집
  collectSpecificPostMetrics: (postId) => 
    testApi.post(`${BASE_URL}/batch/posts/${postId}/metrics`),
  
  // 배치 작업 상태 조회
  getBatchJobStatus: (jobName) => 
    testApi.get(`${BASE_URL}/batch/status/${jobName}`),
  
  // ===== 기존 호환성 API (점진적 마이그레이션용) =====
  
  // 대시보드 통계 (기존)
  getDashboardStats: () => api.get(`${BASE_URL}/dashboard-stats`),
  
  // 콘텐츠 성과 분석 (기존)
  getContentPerformance: (params) => api.get(`${BASE_URL}/content-performance`, { params }),
  
  // 댓글 감성 분석 (기존 - 새로운 감정분석 API로 대체 권장)
  getCommentSentiment: (params) => api.get(`${BASE_URL}/comment-sentiment`, { params }),
  
  // 팔로워 트렌드 (기존)
  getFollowerTrend: (params) => api.get(`${BASE_URL}/follower-trend`, { params }),
  
  // 최적 게시 시간 (기존)
  getOptimalPostingTime: () => api.get(`${BASE_URL}/optimal-posting-time`),
  
  // 키워드 분석 (기존)
  getKeywordAnalysis: (params) => api.get(`${BASE_URL}/keyword-analysis`, { params })
} 