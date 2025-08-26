import { LogOut, Settings, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../../models/Store.js";
import { getMenuItems, ROUTES } from "../../routes/routes.js";
import { logout, setSelectedStore } from "../../store/authSlice.js";
import { fetchAllSnsAccounts } from "../../store/snsSlice.js";
import { clearSelectedStore, fetchStoreById } from "../../store/storeSlice.js";
import { useWindowSize } from "../../hooks/useWindowSize.js";

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { selectedStoreId, user } = useSelector((state) => state.auth);
  const { selectedStore, loading } = useSelector((state) => state.store);
  const { width } = useWindowSize();

  // 브라우저 너비가 60% 이하일 때 모바일 모드 (일반적인 데스크톱 1920px의 60% = 1152px)
  const isMobileMode = width <= 1152;

  // 선택된 매장 정보 가져오기
  useEffect(() => {
    if (selectedStoreId) {
      dispatch(fetchStoreById(selectedStoreId));
      // 매장이 선택되면 SNS 계정 정보도 자동으로 불러오기
      dispatch(fetchAllSnsAccounts());
    } else {
      dispatch(clearSelectedStore());
    }
  }, [selectedStoreId, dispatch]);

  // 화면 크기 변경 시 사이드 메뉴 자동 닫기
  useEffect(() => {
    if (!isMobileMode) {
      setIsSideMenuOpen(false);
    }
  }, [isMobileMode]);

  const handleNavigate = (route) => {
    navigate(route);
    setIsSideMenuOpen(false);
  };

  const handleStoreChange = () => {
    if (window.confirm("다른 매장으로 변경하시겠습니까?")) {
      dispatch(setSelectedStore(null));
      navigate(ROUTES.STORE_SELECTION.route);
      setIsSideMenuOpen(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃하시겠습니까?")) {
      dispatch(logout());
      setIsSideMenuOpen(false);
    }
  };

  const closeSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  const isActive = (route) => location.pathname === route;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#d3b4ff]/20 to-purple-100">
      {/* 상단 네비게이션 */}
      <div className="bg-white/90 backdrop-blur-sm border-b-2 border-gray-800 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4 px-4">
            {/* 왼쪽: 햄버거 버튼과 플랫폼명 */}
            <div className="flex items-center space-x-4">
              {/* 햄버거 메뉴 버튼 - 60% 너비 이하에서만 표시 */}
              {isMobileMode && (
                <button
                  onClick={() => setIsSideMenuOpen(true)}
                  className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="메뉴 열기"
                >
                  <Menu size={24} />
                </button>
              )}

              <h1 className="text-2xl font-black text-gray-800">marketing</h1>

              {/* 데스크탑 메뉴들 - 60% 너비 초과에서만 표시 */}
              {!isMobileMode && (
                <div className="flex ml-8">
                  {getMenuItems().map((item) => (
                    <button
                      key={item.route}
                      onClick={() => handleNavigate(item.route)}
                      className={`mx-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                        isActive(item.route)
                          ? "text-white bg-[#984fff] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {item.krName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 오른쪽: 사용자 정보, 매장 정보, 액션 버튼들 */}
            {!loading && selectedStore && (
              <div className="flex items-center space-x-4">
                {/* 데스크탑용 사용자 정보 - 큰 화면에서만 표시 */}
                {user && width > 1024 && (
                  <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50 shadow-sm">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">
                        {user.name || "사용자"}
                      </span>
                      <span className="text-xs text-gray-500">관리자</span>
                    </div>
                  </div>
                )}

                {/* 데스크탑용 매장 정보 - 큰 화면에서만 표시 */}
                {width > 1024 && (
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl px-4 py-2 border border-purple-200/50 shadow-sm">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#984fff] to-purple-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-white">
                        {selectedStore.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedStore.name}
                      </p>
                      <p className="text-xs text-purple-600 font-medium">
                        {Store.getIndustryLabel(selectedStore.industry)}
                      </p>
                    </div>
                  </div>
                )}

                {/* 구분선 - 큰 화면에서만 표시 */}
                {width > 1024 && (
                  <div className="w-px h-8 bg-gray-300/50"></div>
                )}

                {/* 데스크탑용 액션 버튼들 - 큰 화면에서만 표시 */}
                {width > 1024 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleStoreChange}
                      className="p-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-200"
                      title="매장 변경"
                    >
                      <Settings size={18} />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
                      title="로그아웃"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                )}

                {/* 모바일용 사용자 아바타 - 작은 화면에서만 표시 */}
                {user && width <= 1024 && (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 오버레이 - 모바일 모드에서만 표시 */}
      {isMobileMode && isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSideMenu}
        />
      )}

      {/* 사이드 메뉴 - 모바일 모드에서만 표시 */}
      {isMobileMode && (
        <div
          className={`fixed top-0 left-0 h-screen w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
            isSideMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* 사이드 메뉴 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
            <h2 className="text-xl font-bold text-gray-800">메뉴</h2>
            <button
              onClick={closeSideMenu}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="메뉴 닫기"
            >
              <X size={24} />
            </button>
          </div>

          {/* 사이드 메뉴 콘텐츠 - 헤더를 제외한 나머지 높이 */}
          <div
            className="flex flex-col"
            style={{ height: "calc(100vh - 89px)" }}
          >
            {/* 사용자 및 매장 정보 */}
            {!loading && selectedStore && (
              <div className="p-6 border-b border-gray-100 flex-shrink-0">
                {/* 사용자 정보 */}
                {user && (
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-base font-bold text-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-gray-800">
                        {user.name || "사용자"}
                      </span>
                      <span className="text-sm text-gray-500">관리자</span>
                    </div>
                  </div>
                )}

                {/* 매장 정보 */}
                <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#984fff] to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-base font-bold text-white">
                      {selectedStore.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-base font-semibold text-gray-800">
                      {selectedStore.name}
                    </p>
                    <p className="text-sm text-purple-600 font-medium">
                      {Store.getIndustryLabel(selectedStore.industry)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 네비게이션 메뉴 */}
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4">
                <div className="space-y-2">
                  {getMenuItems().map((item) => (
                    <button
                      key={item.route}
                      onClick={() => handleNavigate(item.route)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center ${
                        isActive(item.route)
                          ? "text-white bg-[#984fff] shadow-[0_2px_8px_rgba(152,79,255,0.3)]"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">{item.krName}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </div>

            {/* 하단 액션 버튼들 - 항상 하단에 고정 */}
            <div className="border-t border-gray-100 bg-gray-50 p-4">
              <div className="space-y-2">
                <button
                  onClick={handleStoreChange}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                >
                  <Settings size={20} />
                  <span className="font-medium">매장 변경</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span className="font-medium">로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
