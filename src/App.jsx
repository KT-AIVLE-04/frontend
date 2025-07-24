import { useEffect, useState } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { authApi } from './api/auth'
import { LoadingSpinner } from './components'
import AppRoutes from './routes'
import { logout, updateToken } from './store/authSlice'
import { store } from './store/store'


function AuthProvider({ children }) {
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
      console.log(response)
      if (response.data?.result?.accessToken) {
        dispatch(updateToken({ token: response.data.result.accessToken }))
      }else{
        dispatch(logout())
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

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </Provider>
  )
}

export default App
