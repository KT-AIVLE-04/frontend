import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import { LoadingSpinner } from './components'
import { useAuth } from './hooks'
import AppRoutes from './routes'
import { store } from './store'

function AuthProvider({ children }) {
  const { isLoading } = useAuth()

  return isLoading ? <LoadingSpinner /> : children
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </Provider>
  )
}

export default App
