import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { storeApi } from '../../api/store';
import { ErrorPage, LoadingSpinner } from '../../components';
import { useApi } from '../../hooks';
import { ROUTES } from '../../routes/routes.js';
import { setSelectedStore } from '../../store/authSlice';
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

  if (error) {
    return <ErrorPage title="매장 목록 로딩 실패" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner message="매장 목록을 불러오는 중..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-[#d3b4ff]/20 to-purple-100 text-gray-900 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-8 text-center">
        <StoreSelectionHeader />
        <StoreGrid
          stores={stores}
          onStoreSelect={handleStoreSelect}
          onAddStore={handleAddStore}
        />
      </div>
    </div>
  );
} 