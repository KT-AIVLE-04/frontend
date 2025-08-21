import api, { testApi } from './axios'

const BASE_URL = '/analytics'

export const analyticsApi = {
  // 대시보드 통계
  getDashboardStats: () => api.get(`${BASE_URL}/dashboard-stats`),
  
  // 실시간 데이터 조회 API
  getRealtimePostMetrics: (postId) => testApi.get(`${BASE_URL}/realtime/posts/${postId}/metrics`),
  getRealtimeAccountMetrics: (accountId) => testApi.get(`${BASE_URL}/realtime/accounts/${accountId}/metrics`),
  getRealtimeComments: (postId, page = 0, size = 20) => 
    testApi.get(`${BASE_URL}/realtime/posts/${postId}/comments`, { params: { page, size } }),
  
  // 히스토리 데이터 조회 API
  getHistoryPostMetrics: (postId, date) => 
    testApi.get(`${BASE_URL}/history/posts/${postId}/metrics`, { params: { date } }),
  getHistoryAccountMetrics: (accountId, date) => 
    testApi.get(`${BASE_URL}/history/accounts/${accountId}/metrics`, { params: { date } }),
  getHistoryComments: (postId, date, page = 0, size = 20) => 
    testApi.get(`${BASE_URL}/history/posts/${postId}/comments`, { params: { date, page, size } }),
  
  // 콘텐츠 성과 분석
  getContentPerformance: (params) => api.get(`${BASE_URL}/content-performance`, { params }),
  
  // 댓글 감성 분석
  getCommentSentiment: (params) => api.get(`${BASE_URL}/comment-sentiment`, { params }),
  
  // 팔로워 트렌드
  getFollowerTrend: (params) => api.get(`${BASE_URL}/follower-trend`, { params }),
  
  // 최적 게시 시간
  getOptimalPostingTime: () => api.get(`${BASE_URL}/optimal-posting-time`),
  
  // 키워드 분석
  getKeywordAnalysis: (params) => api.get(`${BASE_URL}/keyword-analysis`, { params })
} 