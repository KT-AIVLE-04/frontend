import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { login, logout, updateToken } from '../store/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  
  // 현재 인증 상태 확인
  const { isAuthenticated } = useSelector(state => state.auth)

  const checkLogin = async () => {
    console.log('checkLogiffn')
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if(!refreshToken) throw new Error('refreshToken not found');

      const response = await authApi.refresh(refreshToken)
      console.log('refreshToken 갱신 성공', response)

      let isSuccess = false
      if (response.data?.result) {
        const {accessToken, refreshToken} = response.data.result
        if(accessToken && refreshToken) {
          dispatch(updateToken({ accessToken, refreshToken }))
          isSuccess = true
        } 
      } 
      if(!isSuccess) {
        dispatch(logout())
      }
    } catch (error) {
      // 리프레시 실패는 일반적인 상황일 수 있으므로 콘솔 에러는 출력하지 않음
      console.log('refreshToken 갱신 실패', error)
      dispatch(logout())
    } finally {
      setIsLoading(false)
    }
  }

  // 쿠키에서 토큰 추출 (oauth-success 경로에서만)
  const oauthParams = useMemo(() => {
    if (location.pathname !== '/oauth-success') {
      return null
    }
    
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {})
    
    const accessToken = cookies.accessToken
    const refreshToken = cookies.refreshToken
    
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken }
    }
    
    return null
  }, [location.pathname])

  const handleOAuthCallback = ({ accessToken, refreshToken }) => {
    try {
      dispatch(login({ accessToken, refreshToken }))
      // navigate 제거 - 라우팅 로직이 자동으로 처리함
    } catch (error) {
      console.error('OAuth 로그인 처리 실패:', error)
      // 사용자에게 에러 알림 (토스트나 알림 컴포넌트 사용)
      alert('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // 이미 로그인 상태면 불필요한 API 호출 방지
    if (isAuthenticated) {
      setIsLoading(false)
      return
    }
    oauthParams ? handleOAuthCallback(oauthParams) : checkLogin();
  }, [oauthParams])

  return { isLoading }
} 