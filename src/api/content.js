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
  
  // 시나리오 생성 요청
  createScenarios: (storeId, data) => api.post(`/shorts/scenario`, data, {
    headers: {
      'x-store-id': storeId
    },
    timeout: 30000 // 30초 타임아웃
  }),
  
  // 콘텐츠 생성 상태 확인
  getContentStatus: (contentId) => api.get(`${BASE_URL}/${contentId}/status`),

  // 숏폼 생성 요청
  createShorts: (requestData, images) => {
    const formData = new FormData();
    
    // request 객체를 JSON Blob으로 변환하여 추가 (Content-Type 명시)
    const jsonBlob = new Blob([JSON.stringify(requestData)], {
      type: 'application/json'
    });
    formData.append('request', jsonBlob);
    
    // images 배열 추가
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        console.log(`Adding image ${index}:`, image);
        formData.append('images', image);
      });
    }
    
    // FormData 내용 디버깅
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    return api.post('/shorts', formData, {
      timeout: 600000 // 10분 타임아웃
    });
  }
} 