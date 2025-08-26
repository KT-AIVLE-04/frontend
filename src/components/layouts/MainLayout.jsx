import { LogOut, Settings } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Store } from '../../models/Store.js'
import { getMenuItems, ROUTES } from '../../routes/routes.js'
import { logout, setSelectedStore } from '../../store/authSlice.js'
import { fetchAllSnsAccounts } from '../../store/snsSlice.js'
import { clearSelectedStore, fetchStoreById } from '../../store/storeSlice.js'

export const MainLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {selectedStoreId, user} = useSelector((state) => state.auth)
  const {selectedStore, loading} = useSelector((state) => state.store)

  // 선택된 매장 정보 가져오기
  useEffect(() => {
    if (selectedStoreId) {
      dispatch(fetchStoreById(selectedStoreId))
      // 매장이 선택되면 SNS 계정 정보도 자동으로 불러오기
      dispatch(fetchAllSnsAccounts())
    } else {
      dispatch(clearSelectedStore())
    }
  }, [selectedStoreId, dispatch])

  const handleNavigate = (route) => {
    navigate(route)
  }

  const handleStoreChange = () => {
    if (window.confirm('다른 매장으로 변경하시겠습니까?')) {
      dispatch(setSelectedStore(null));
      navigate(ROUTES.STORE_SELECTION.route);
    }
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      dispatch(logout())
    }
  };

  const isActive = (route) => location.pathname === route;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#d3b4ff]/20 to-purple-100">
      {/* 상단 네비게이션 */}
      <div className="bg-white/90 backdrop-blur-sm border-b-2 border-gray-800 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4">
            {/* 왼쪽: 플랫폼명과 메뉴들 */}
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-black text-gray-800 pr-8">marketing</h1>

              {/* 메뉴들 */}
              <div className="flex">
                {getMenuItems().map((item) => (
                  <button
                    key={item.route}
                    onClick={() => handleNavigate(item.route)}
                    className={`mx-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                      isActive(item.route)
                        ? 'text-white bg-[#984fff] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.krName}
                  </button>
                ))}
              </div>
            </div>

            {/* 오른쪽: 사용자 정보, 매장 정보, 액션 버튼들 */}
            {!loading && selectedStore && (
              <div className="flex items-center space-x-6">
                {/* 사용자 정보 */}
                {user && (
                  <div
                    className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/50 shadow-sm">
                    <div
                      className="w-9 h-9 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-white">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">{user.name || '사용자'}</span>
                      <span className="text-xs text-gray-500">관리자</span>
                    </div>
                  </div>
                )}

                {/* 매장 정보 */}
                <div
                  className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl px-4 py-2 border border-purple-200/50 shadow-sm">
                  <div
                    className="w-9 h-9 bg-gradient-to-br from-[#984fff] to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">
                      {selectedStore.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">{selectedStore.name}</p>
                    <p
                      className="text-xs text-purple-600 font-medium">{Store.getIndustryLabel(selectedStore.industry)}</p>
                  </div>
                </div>

                {/* 구분선 */}
                <div className="w-px h-8 bg-gray-300/50"></div>

                {/* 액션 버튼들 */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStoreChange}
                    className="p-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-200"
                    title="매장 변경"
                  >
                    <Settings size={18}/>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
                    title="로그아웃"
                  >
                    <LogOut size={18}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet/>
        </div>
      </div>
    </div>
  )
} 