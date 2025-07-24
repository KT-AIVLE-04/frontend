import api from './axios'

const BASE_URL = '/stores'

export const storeApi = {
  // 매장 목록 조회
  getStores: () => api.get(BASE_URL),
  
  // 매장 상세 조회
  getStore: (storeId) => api.get(`${BASE_URL}/${storeId}`),
  
  // 매장 생성
  createStore: (data) => api.post(BASE_URL, data),
  
  // 매장 수정
  updateStore: (storeId, data) => api.put(`${BASE_URL}/${storeId}`, data),
  
  // 매장 삭제
  deleteStore: (storeId) => api.delete(`${BASE_URL}/${storeId}`)
} 