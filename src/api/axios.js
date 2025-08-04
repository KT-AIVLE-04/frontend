import axios from 'axios'
import { logout, updateToken } from '../store/authSlice'
import { store } from '../store/store'
import { authApi } from './auth'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false
// 대기 중인 요청들을 저장하는 배열
let failedQueue = []

const processQueue = (error, accessToken = null) => {
  failedQueue.forEach(({ reject }) => {
    reject(error)
  })
  failedQueue.forEach(({ resolve }) => {
    resolve(accessToken)
  })
  failedQueue = []
}

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // 401 에러이고 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/refresh')) {
      
      // 이미 토큰 갱신 중인 경우, 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(accessToken => {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      // 새로운 토큰발급
      originalRequest._retry = true
      isRefreshing = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        // refreshToken으로 새로운 accessToken 발급
        const response = await authApi.refresh(refreshToken)
        const { accessToken } = response.data
        store.dispatch(updateToken({ accessToken }))

        // 대기 중인 요청들 처리
        processQueue(null, accessToken)

        // 원래 요청 재시도(긍까 마지막요청이 되는것임)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // refreshToken도 만료된 경우 로그아웃
        isRefreshing = false
        processQueue(refreshError, null)
        store.dispatch(logout())
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api 