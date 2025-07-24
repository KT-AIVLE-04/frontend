import api from './axios'

const BASE_URL = '/articles'

export const articleApi = {
  // 게시글 목록 조회 (페이지네이션)
  getArticles: (params) => api.get(BASE_URL, { params }),
  
  // 게시글 상세 조회
  getArticle: (articleId) => api.get(`${BASE_URL}/${articleId}`),
  
  // 게시글 생성
  createArticle: (data) => api.post(BASE_URL, data),
  
  // 게시글 수정
  updateArticle: (articleId, data) => api.put(`${BASE_URL}/${articleId}`, data),
  
  // 게시글 삭제
  deleteArticle: (articleId) => api.delete(`${BASE_URL}/${articleId}`)
}
