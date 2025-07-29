import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { authApi } from '../api/auth'
import { login, logout, updateToken } from '../store/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  const checkLogin = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      setIsLoading(false)
      return
    }
    try {
      const response = await authApi.refresh(refreshToken)
      console.log(response)
      if (response.data?.result?.accessToken) {
        dispatch(updateToken({ accessToken: response.data.result.accessToken }))
      } else {
        dispatch(logout())
      }
    } catch (error) {
      // 리프레시 실패는 일반적인 상황일 수 있으므로 콘솔 에러는 출력하지 않음
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthCallback = () => {
    const urlParams = new URLSearchParams(location.search)
    console.log(urlParams)
    const accessToken = urlParams.get('accessToken')
    const refreshToken = urlParams.get('refreshToken')
    const error = urlParams.get('error')

    if (error) {
      console.error('OAuth 인증 실패:', error)
      return
    }
    console.log(accessToken, refreshToken)

    if (accessToken && refreshToken) {
      // OAuth 토큰으로 로그인 처리
      dispatch(login({ accessToken, refreshToken }))
      
      // URL에서 토큰 파라미터 제거
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }

  useEffect(() => {
    checkLogin()
    handleOAuthCallback()
  }, [])

  return { isLoading }
} 