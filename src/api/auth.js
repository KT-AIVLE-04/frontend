import api from './axios'

const BASE_URL = '/auth'

export const authApi = {
  register: (data) => api.post(`${BASE_URL}/signup`, data),
  login: (data) => api.post(`${BASE_URL}/login`, data),
  logout: () => api.post(`${BASE_URL}/logout`),
  refresh: (refreshToken) => api.post(`${BASE_URL}/refresh`, {}, {
    headers: {
      'X-Refresh-Token': `${refreshToken}`
    }
  }),
  getMe: () => api.get(`${BASE_URL}/me`),
  // Spring Security OAuth2 구글 로그인
  googleOAuth: () => api.get('/api/oauth2/authorization/google'),
  // Spring Security OAuth2 카카오 로그인
  kakaoOAuth: () => api.get('/api/oauth2/authorization/kakao')
} 