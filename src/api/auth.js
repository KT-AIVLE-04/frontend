import api from './axios'

const BASE_URL = '/auth'

export const authApi = {
  // 회원가입 (API 명세서에 맞게 /signup으로 변경)
  register: (data) => api.post(`${BASE_URL}/signup`, data),
  login: (data) => api.post(`${BASE_URL}/login`, data),
  logout: () => api.post(`${BASE_URL}/logout`),
  refresh: (refreshToken) => api.post(`${BASE_URL}/refresh`, {}, {
    headers: {
      'X-Refresh-Token': `${refreshToken}`
    }
  }),
  getMe: () => api.get(`${BASE_URL}/me`),
  // OAuth 로그인 (API 명세서에 맞게 수정)
  oauthLogin: (provider) => api.get(`${BASE_URL}/${provider}/login`),
  // Spring Security OAuth2 구글 로그인 (기존 호환성)
  googleOAuth: () => api.get('/api/oauth2/authorization/google'),
  // Spring Security OAuth2 카카오 로그인 (기존 호환성)
  kakaoOAuth: () => api.get('/api/oauth2/authorization/kakao')
} 