import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { authApi } from '../api/auth'
import { login, logout, updateToken } from '../store/authSlice'

/**
 * 인증 상태 관리를 위한 커스텀 훅
 * @returns {Object} 인증 관련 상태와 함수들
 * @returns {boolean} returns.isLoading - 인증 처리 중 로딩 상태
 */
export const useAuth = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const hasInitialized = useRef(false)

  // 현재 인증 상태 확인
  const {isAuthenticated} = useSelector(state => state.auth)

  const checkLogin = async () => {
    console.log('checkLogin')
    try {
      setIsLoading(true)
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) throw new Error('refreshToken not found');

      const response = await authApi.refresh(refreshToken)
      console.log('refreshToken 갱신 성공', response)

      let isSuccess = false
      if (response.data?.result) {
        const {accessToken, refreshToken} = response.data.result
        if (accessToken && refreshToken) {
          dispatch(updateToken({accessToken, refreshToken}))
          isSuccess = true
        }
      }
      if (!isSuccess) {
        dispatch(logout())
      }
    } catch (error) {
      console.log('refreshToken 갱신 실패', error)
      dispatch(logout())
    } finally {
      setIsLoading(false)
    }
  }

  // URL fragment에서 토큰 추출 (oauth-success 경로에서만)
  const oauthParams = useMemo(() => {
    if (location.pathname !== '/oauth-success') {
      return null
    }

    // URL fragment에서 토큰 파라미터 추출
    const fragment = window.location.hash.substring(1) // '#' 제거
    const params = new URLSearchParams(fragment)
    
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)

    if (accessToken && refreshToken) {
      return {accessToken, refreshToken}
    }

    return null
  }, [location.pathname])

  const handleOAuthCallback = ({accessToken, refreshToken}) => {
    try {
      setIsLoading(true)
      dispatch(login({accessToken, refreshToken}))
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
    // 이미 초기화되었거나 로그인 상태면 실행하지 않음
    if (hasInitialized.current || isAuthenticated) {
      setIsLoading(false)
      return
    }
    
    if (isLoading) return;
    
    // 초기화 플래그 설정
    hasInitialized.current = true;
    
    oauthParams ? handleOAuthCallback(oauthParams) : checkLogin();
  }, [oauthParams, isAuthenticated])

  return {isLoading}
} 