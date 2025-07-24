import api from './axios'

const BASE_URL = '/content'

export const contentApi = {
  // 콘텐츠 목록 조회
  getContents: (params) => api.get(BASE_URL, { params }),
  
  // 콘텐츠 상세 조회
  getContent: (contentId) => api.get(`${BASE_URL}/${contentId}`),
  
  // 콘텐츠 생성 (AI)
  createContent: (data) => api.post(BASE_URL, data),
  
  // 콘텐츠 수정
  updateContent: (contentId, data) => api.put(`${BASE_URL}/${contentId}`, data),
  
  // 콘텐츠 삭제
  deleteContent: (contentId) => api.delete(`${BASE_URL}/${contentId}`),
  
  // 콘텐츠 다운로드
  downloadContent: (contentId) => api.get(`${BASE_URL}/${contentId}/download`),
  
  // 시나리오 목록 조회
  getScenarios: () => api.get(`${BASE_URL}/scenarios`),
  
  // 콘텐츠 생성 상태 확인
  getContentStatus: (contentId) => api.get(`${BASE_URL}/${contentId}/status`)
} 