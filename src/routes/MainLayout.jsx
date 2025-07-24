import { useDispatch } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { logout } from '../store/authSlice'
import { NAV_ITEMS, ROUTE_MAPPING, ROUTES } from './routes'

export const MainLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const getActivePage = () => {
    const path = location.pathname
    if (path === ROUTES.DASHBOARD) return NAV_ITEMS.DASHBOARD
    if (path === ROUTES.ANALYTICS) return NAV_ITEMS.ANALYTICS
    if (path === ROUTES.CONTENT_CREATION) return NAV_ITEMS.CONTENT_CREATION
    if (path === ROUTES.CONTENT_MANAGEMENT) return NAV_ITEMS.CONTENT_MANAGEMENT
    if (path === ROUTES.STORE_MANAGEMENT) return NAV_ITEMS.STORE_MANAGEMENT
    if (path === ROUTES.SNS_INTEGRATION) return NAV_ITEMS.SNS_INTEGRATION
    return NAV_ITEMS.DASHBOARD
  }

  const handleNavigate = (pageId) => {
    if (pageId === 'login') {
      // 로그아웃 로직
      dispatch(logout())
      return
    }
    
    const targetRoute = ROUTE_MAPPING[pageId]
    if (targetRoute) {
      navigate(targetRoute)
    }
  }

  return (
    <div className="flex">
      <Sidebar activePage={getActivePage()} onNavigate={handleNavigate} />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  )
} 