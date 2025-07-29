import api from './axios'

const BASE_URL = '/auth'

export const authApi = {
  register: (data) => api.post(`${BASE_URL}/new`, data),
  login: (data) => api.post(`${BASE_URL}/login`, data),
  logout: () => api.post(`${BASE_URL}/logout`),
  refresh: (refreshToken) => api.post(`${BASE_URL}/refresh`, {refreshToken}),
  getMe: () => api.get(`${BASE_URL}/me`),
  // Spring Security OAuth2 구글 로그인
  googleOAuth: () => api.get('/oauth2/authorization/google')
} 