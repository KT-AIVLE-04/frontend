import api from './axios'

const BASE_URL = '/sns'

export const snsApi = {
  // 연동된 SNS 계정 목록
  getConnectedAccounts: () => api.get(`${BASE_URL}/accounts`),
  
  // SNS 계정 연결
  connectAccount: (platform, data) => api.post(`${BASE_URL}/accounts/${platform}`, data),
  
  // SNS 계정 연결 해제
  disconnectAccount: (platform) => api.delete(`${BASE_URL}/accounts/${platform}`),
  
  // 예약 게시물 목록
  getScheduledPosts: (params) => api.get(`${BASE_URL}/scheduled-posts`, { params }),
  
  // 예약 게시물 생성
  createScheduledPost: (data) => api.post(`${BASE_URL}/scheduled-posts`, data),
  
  // 예약 게시물 수정
  updateScheduledPost: (postId, data) => api.put(`${BASE_URL}/scheduled-posts/${postId}`, data),
  
  // 예약 게시물 삭제
  deleteScheduledPost: (postId) => api.delete(`${BASE_URL}/scheduled-posts/${postId}`),
  
  // 즉시 게시
  publishNow: (data) => api.post(`${BASE_URL}/publish`, data),
  
  // SNS 최적화 제안
  getOptimizationSuggestions: () => api.get(`${BASE_URL}/suggestions`),
  
  // 해시태그 추천
  getHashtagSuggestions: (keyword) => api.get(`${BASE_URL}/hashtags`, { params: { keyword } })
} 