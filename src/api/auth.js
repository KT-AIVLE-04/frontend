import api from './axios'

const BASE_URL = '/members'

export const authApi = {
  register: (data) => api.post(`${BASE_URL}/new`, data),
  login: (data) => api.post(`${BASE_URL}/login`, data),
  logout: () => api.post(`${BASE_URL}/logout`),
  refresh: () => api.post(`${BASE_URL}/refresh`),
  getMe: () => api.get(`${BASE_URL}/me`)
} 