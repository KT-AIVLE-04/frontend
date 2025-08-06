import { LogOut } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Store } from '../models/Store'
import { logout, setSelectedStore } from '../store/authSlice'
import { clearSelectedStore, fetchStoreById } from '../store/storeSlice'
import { ROUTES } from './routes'

export const MainLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedStoreId, user } = useSelector((state) => state.auth)
  const { selectedStore, loading } = useSelector((state) => state.store)
  
  // 선택된 매장 정보 가져오기
  useEffect(() => {
    if (selectedStoreId) {
      dispatch(fetchStoreById(selectedStoreId))
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
      navigate(ROUTES.STORE_SELECTION);
    }
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      dispatch(logout())
    }
  };

  const isActive = (route) => location.pathname === route;

  const menuItems = [
    { name: '대시보드', route: ROUTES.DASHBOARD },
    { name: '콘텐츠 제작', route: ROUTES.CONTENT_CREATION },
    { name: '콘텐츠 관리', route: ROUTES.CONTENT_MANAGEMENT },
    { name: '성과 분석', route: ROUTES.ANALYTICS },
    { name: 'SNS 연동', route: ROUTES.SNS_INTEGRATION },
    { name: '매장 관리', route: ROUTES.STORE_MANAGEMENT },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#d3b4ff]/20 to-purple-100">
      {/* 상단 네비게이션 */}
      {selectedStore && !loading && (
        <div className="bg-white/90 backdrop-blur-sm border-b-2 border-gray-800 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.8)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between py-4">
              {/* 왼쪽: 플랫폼명과 메뉴들 */}
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-black text-gray-800 pr-4">marketing</h1>
                
                {/* 메뉴들 */}
                <div className="flex space-x-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.route}
                      onClick={() => handleNavigate(item.route)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                        isActive(item.route)
                          ? 'text-white bg-[#d3b4ff] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 오른쪽: 사용자 정보, 매장 정보, 액션 버튼들 */}
              <div className="flex items-center space-x-4">
                {/* 사용자 정보 */}
                {user && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#d3b4ff] to-purple-600 rounded-full flex items-center justify-center border-2 border-purple-700 shadow-lg">
                      <span className="text-sm font-bold text-white">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name || '사용자'}</span>
                  </div>
                )}

                {/* 매장 정보 */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#d3b4ff] to-purple-600 rounded-full flex items-center justify-center border-2 border-purple-700 shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {selectedStore.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{selectedStore.name}</p>
                    <p className="text-xs font-medium text-gray-600">{Store.getIndustryLabel(selectedStore.industry)}</p>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStoreChange}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-150"
                  >
                    매장 변경
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-red-700 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-150"
                    title="로그아웃"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
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
  )
} 