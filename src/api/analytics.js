import api from './axios'

const BASE_URL = '/analytics'

export const analyticsApi = {
  // 대시보드 통계
  getDashboardStats: (dateRange = 'last7') => api.get(`${BASE_URL}/dashboard`, { params: { dateRange } }),
  
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