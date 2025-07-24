import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthInitializer } from './components'
import AppRoutes from './routes'
import { store } from './store/store'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer>
          <AppRoutes />
        </AuthInitializer>
      </Router>
    </Provider>
  )
}

export default App
