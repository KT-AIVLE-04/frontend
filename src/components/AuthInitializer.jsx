import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { authApi } from '../api/auth'
import { updateToken } from '../store/authSlice'
import { LoadingSpinner } from './LoadingSpinner'

export function AuthInitializer({children}) {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  const checkLogin = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      setIsLoading(false)
      return
    }
    try {
      const response = await authApi.refresh(refreshToken)
      if (response.data?.token) {
        dispatch(updateToken({ token: response.data.token }))
      }
    } catch (error) {
      // 리프레시 실패는 일반적인 상황일 수 있으므로 콘솔 에러는 출력하지 않음
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return children
} 