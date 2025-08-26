import api from './axios';

const BASE_URL = '/shorts'

export const shortApi = {

  // 시나리오 생성 요청
  createScenarios: (data) => api.post(`/shorts/scenario`, data, {
    storeId: true,
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
    });
  },

  // 숏폼 저장 요청 (API 명세서에 맞게 수정)
  saveShorts: (sessionId, selectedScenario) => api.post('/shorts/save', { 
    sessionId, 
    selectedScenario 
  }, {
    storeId: true,
  })
}