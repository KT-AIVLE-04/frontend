import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import {
  Analytics,
  ContentCreation,
  ContentManagement,
  Dashboard,
  Login,
  Register,
  SnsIntegration,
  StoreManagement,
  StoreSelection
} from '../pages'
import { MainLayout } from './MainLayout'
import { ROUTES } from './routes'

const ProtectedRoute = () => {
  const {isAuthenticated, selectedStoreId} = useSelector((state) => state.auth)
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace/>
  }
  
  // 매장이 선택되지 않았으면 매장 선택 화면으로
  if (!selectedStoreId) {
    return <Navigate to={ROUTES.STORE_SELECTION} replace/>
  }
  
  return <Outlet/>
}

const StoreSelectionRoute = () => {
  const {isAuthenticated, selectedStoreId} = useSelector((state) => state.auth)
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace/>
  }
  
  // 이미 매장이 선택되었으면 대시보드로
  if (selectedStoreId) {
    return <Navigate to={ROUTES.DASHBOARD} replace/>
  }
  
  return <Outlet/>
}

const NotFoundRoute = () => {
  const {isAuthenticated} = useSelector((state) => state.auth)
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace/> : <Navigate to={ROUTES.LOGIN} replace/>
}

// 이미 로그인돼엇으면 dashboard로 이동
const AlreadyLoggedInRoute = () => {
  const {isAuthenticated} = useSelector((state) => state.auth)
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace/> : <Outlet/>
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AlreadyLoggedInRoute/>}>
        <Route path={ROUTES.LOGIN} element={<Login/>}/>
        <Route path={ROUTES.REGISTER} element={<Register/>}/>
      </Route>
      <Route element={<StoreSelectionRoute/>}>
        <Route path={ROUTES.STORE_SELECTION} element={<StoreSelection/>}/>
      </Route>
      <Route element={<ProtectedRoute/>}>
        <Route element={<MainLayout/>}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard/>}/>
          <Route path={ROUTES.ANALYTICS} element={<Analytics/>}/>
          <Route path={ROUTES.CONTENT_CREATION} element={<ContentCreation/>}/>
          <Route path={ROUTES.CONTENT_MANAGEMENT} element={<ContentManagement/>}/>
          <Route path={ROUTES.STORE_MANAGEMENT} element={<StoreManagement/>}/>
          <Route path={ROUTES.SNS_INTEGRATION} element={<SnsIntegration/>}/>
          <Route path="/" element={<Navigate to={ROUTES.STORE_SELECTION} replace/>}/>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundRoute/>}/>
    </Routes>
  )
}

export default AppRoutes 