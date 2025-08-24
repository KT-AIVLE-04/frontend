import { useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout.jsx";
import {
    Analytics,
    ContentCreation,
    ContentManagement,
    Login,
    PostManagement,
    Register,
    SnsIntegration,
    StoreManagement,
    StoreSelection,
    StoreUpdate,
} from "../pages";
import { ROUTES } from "./routes";

const ProtectedRoute = () => {
  const {isAuthenticated} = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN.route} replace/>;
  }

  return <Outlet/>;
};

const StoreRequiredRoute = () => {
  const {selectedStoreId} = useSelector((state) => state.auth);

  // 매장이 선택되지 않았으면 매장 선택 화면으로
  if (!selectedStoreId) {
    return <Navigate to={ROUTES.STORE_SELECTION.route} replace/>;
  }

  return <Outlet/>;
};

const NotFoundRoute = () => {
  const {isAuthenticated} = useSelector((state) => state.auth);
  return isAuthenticated ? (
    <Navigate to={ROUTES.ANALYTICS.route} replace/>
  ) : (
    <Navigate to={ROUTES.LOGIN.route} replace/>
  );
};

// 이미 로그인돼엇으면 dashboard로 이동
const AlreadyLoggedInRoute = () => {
  const {isAuthenticated} = useSelector((state) => state.auth);
  return isAuthenticated ? (
    <Navigate to={ROUTES.ANALYTICS.route} replace/>
  ) : (
    <Outlet/>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* 🧪 개발용 테스트 라우트들 - 인증 없이 접근 가능 */}

      {/* {import.meta.env.DEV && (
        <>
          <Route path="/test/sns-integration" element={<SnsIntegration />} />
          <Route path="/test/dashboard" element={<Dashboard />} />
          <Route path="/test/analytics" element={<Analytics />} />
          <Route path="/test/content-creation" element={<ContentCreation />} />
          <Route
            path="/test/content-management"
            element={<ContentManagement />}
          />
          <Route path="/test/post-management" element={<PostManagement />} />
          <Route path="/test/store-management" element={<StoreManagement />} />
        </>
      )} */}

      <Route element={<AlreadyLoggedInRoute/>}>
        <Route path={ROUTES.LOGIN.route} element={<Login/>}/>
        <Route path={ROUTES.REGISTER.route} element={<Register/>}/>
      </Route>
      <Route element={<ProtectedRoute/>}>
        <Route
          path={ROUTES.STORE_SELECTION.route}
          element={<StoreSelection/>}
        />
        <Route path={ROUTES.STORE_UPDATE.route} element={<StoreUpdate/>}/>
        <Route element={<StoreRequiredRoute/>}>
          <Route element={<MainLayout/>}>
            <Route path={ROUTES.ANALYTICS.route} element={<Analytics/>}/>
            <Route
              path={ROUTES.CONTENT_CREATION.route}
              element={<ContentCreation/>}
            />
            <Route
              path={ROUTES.CONTENT_MANAGEMENT.route}
              element={<ContentManagement/>}
            />
            <Route
              path={ROUTES.POST_MANAGEMENT.route}
              element={<PostManagement/>}
            />
            <Route
              path={ROUTES.STORE_MANAGEMENT.route}
              element={<StoreManagement/>}
            />
            <Route
              path={ROUTES.SNS_INTEGRATION.route}
              element={<SnsIntegration/>}
            />
            <Route
              path="/"
              element={<Navigate to={ROUTES.STORE_SELECTION.route} replace/>}
            />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundRoute/>}/>
    </Routes>
  );
}

export default AppRoutes;
