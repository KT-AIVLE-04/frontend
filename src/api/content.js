import api from './axios';

const BASE_URL = '/api/contents'

export const contentApi = {
  // 콘텐츠 업로드 (multipart/form-data)
  uploadContent: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(BASE_URL, formData, {
      storeId: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // 콘텐츠 상세 조회
  getContent: (contentId) => api.get(`${BASE_URL}/${contentId}`, {
    storeId: true
  }),

  // 콘텐츠 목록 조회
  getContents: (params) => api.get(BASE_URL, {
    params,
    storeId: true
  }),

  // 콘텐츠 제목 수정 (PATCH)
  updateContentTitle: (contentId, title) => api.patch(`${BASE_URL}/${contentId}`, null, {
    storeId: true,
    params: { title }
  }),

  // 콘텐츠 삭제
  deleteContent: (contentId) => api.delete(`${BASE_URL}/${contentId}`, {
    storeId: true
  }),

  // 시나리오 생성 요청
  createScenarios: (data) => api.post(`/shorts/scenario`, data, {
    storeId: true,
    timeout: 30000
  }),

  // 숏폼 생성 요청
  createShorts: (requestData, images) => {
    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(requestData)], {
      type: 'application/json'
    });
    formData.append('request', jsonBlob);

    if (images && images.length > 0) {
      images.forEach((image, index) => {
        console.log(`Adding image ${index}:`, image);
        formData.append('images', image);
      });
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    return api.post('/shorts', formData, {
      storeId: true,
      timeout: 600000
    });
  }
} 