import { LogOut } from 'lucide-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { storeApi } from '../../api/store';
import { ApiPageLayout } from '../../components/layouts';
import { useApi } from '../../hooks';
import { ROUTES } from '../../routes/routes.js';
import { logout, setSelectedStore } from '../../store/authSlice';
import { StoreGrid, StoreSelectionHeader } from './components';

export function StoreSelection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // useApi 훅 사용
  const { data: storesData, loading, error, execute: fetchStores } = useApi(storeApi.getStores);

  React.useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const stores = storesData?.data?.result || [];

  const handleStoreSelect = (store) => {
    dispatch(setSelectedStore(store));
    navigate(ROUTES.ANALYTICS.route);
  };

  const handleAddStore = () => {
    navigate(ROUTES.STORE_UPDATE.route);
  };
  
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.log('Logout API failed, but continuing with local logout');
    } finally {
      dispatch(logout());
      navigate(ROUTES.LOGIN.route);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#d3b4ff]/20 to-purple-100 text-gray-900 flex items-center justify-center">
      <ApiPageLayout
        loading={loading}
        error={error}
        loadingMessage="매장 목록을 불러오는 중..."
        errorTitle="매장 목록 로딩 실패"
        containerClassName="max-w-2xl w-full mx-auto px-8 text-center"
      >
        <StoreSelectionHeader />
        <StoreGrid
          stores={stores}
          onStoreSelect={handleStoreSelect}
          onAddStore={handleAddStore}
        />
        <button
          onClick={handleLogout}
          className="flex mx-auto px-4 py-2 bg-red-500 text-white rounded-xl border-2 border-red-700 hover:bg-red-600 transition-all duration-150 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] transform hover:translate-x-0.5 hover:translate-y-0.5"
        >
          <LogOut size={16} className="mr-2" />
          로그아웃
        </button>
      </ApiPageLayout>
    </div>
  );
} 