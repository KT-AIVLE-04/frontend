import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Analytics } from '../pages/Analytics'
import { ContentCreation } from '../pages/ContentCreation'
import { ContentManagement } from '../pages/ContentManagement'
import { Dashboard } from '../pages/Dashboard'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { SnsIntegration } from '../pages/SnsIntegration'
import { StoreManagement } from '../pages/StoreManagement'
import { MainLayout } from './MainLayout'
import { ROUTES } from './routes'

const ProtectedRoute = () => {
  const {isAuthenticated} = useSelector((state) => state.auth)
  return isAuthenticated ? <Outlet/> : <Navigate to={ROUTES.LOGIN} replace/>
}

const NotFoundRoute = () => {
  const {isAuthenticated} = useSelector((state) => state.auth)
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace/> : <Navigate to={ROUTES.LOGIN} replace/>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login/>}/>
      <Route path={ROUTES.REGISTER} element={<Register/>}/>
      <Route element={<ProtectedRoute/>}>
        <Route element={<MainLayout/>}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard/>}/>
          <Route path={ROUTES.ANALYTICS} element={<Analytics/>}/>
          <Route path={ROUTES.CONTENT_CREATION} element={<ContentCreation/>}/>
          <Route path={ROUTES.CONTENT_MANAGEMENT} element={<ContentManagement/>}/>
          <Route path={ROUTES.STORE_MANAGEMENT} element={<StoreManagement/>}/>
          <Route path={ROUTES.SNS_INTEGRATION} element={<SnsIntegration/>}/>
          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace/>}/>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundRoute/>}/>
    </Routes>
  )
}

export default AppRoutes 