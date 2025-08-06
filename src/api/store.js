import { Store } from '../models/Store';
import api from './axios';

const BASE_URL = '/stores'

export const storeApi = {
  // 매장 목록 조회
  getStores: async () => {
    const response = await api.get(BASE_URL);
    return {
      ...response,
      data: {
        ...response.data,
        result: Store.fromResponseArray(response.data?.result || [])
      }
    };
  },
  
  // 매장 상세 조회
  getStore: async (storeId) => {
    const response = await api.get(`${BASE_URL}/${storeId}`);
    return {
      ...response,
      data: {
        ...response.data,
        result: Store.fromResponse(response.data?.result)
      }
    };
  },
  
  // 매장 생성
  createStore: (data) => api.post(BASE_URL, data),
  
  // 매장 수정 (PATCH 사용)
  updateStore: (storeId, data) => api.patch(`${BASE_URL}/${storeId}`, data),
  
  // 매장 삭제
  deleteStore: (storeId) => api.delete(`${BASE_URL}/${storeId}`)
} 