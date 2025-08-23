import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { storeApi } from '../../api/store';
import { Card, ErrorPage, LoadingSpinner } from '../../components';
import { useApi } from '../../hooks';
import { Store } from '../../models/Store';
import { ROUTES } from '../../routes/routes';
import { setSelectedStore } from '../../store/authSlice';

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
        {/* 헤더 */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">어떤 매장을 관리하시겠습니까?</h1>
          <p className="text-xl text-gray-600">매장을 선택하세요</p>
        </div>

        {/* 매장 목록 */}
        <div className="grid gap-4 mb-12 justify-items-center grid-flow-col">
          {stores.map((store) => (
            <div
              key={store.id}
              onClick={() => handleStoreSelect(store)}
              className="group cursor-pointer transition-all duration-300 hover:scale-105 w-full max-w-52 max-h-80"
            >
              <Card variant="hover" className="p-6 text-center h-full">
                <div className="w-24 h-24 mx-auto mb-4 bg-[#984fff] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-2xl font-bold text-white">
                    {store.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-purple-700 transition-colors">{store.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{Store.getIndustryLabel(store.industry)}</p>
                <p className="text-gray-500 text-xs truncate">{store.address}</p>
              </Card>
            </div>
          ))}
          
          {/* 새 매장 추가 */}
          <div
            onClick={handleAddStore}
            className="group cursor-pointer transition-all duration-300 hover:scale-105 w-full max-w-52 max-h-80"
          >
            <Card className="p-6 text-center border-2 border-dashed border-gray-300 hover:border-[#d3b4ff] transition-all duration-300 h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-[#d3b4ff]/50 rounded-2xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-[#d3b4ff]/70 transition-all duration-300">
                <svg className="w-8 h-8 text-[#d3b4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-purple-700 transition-colors">새 매장 추가</h3>
              <p className="text-gray-600 text-sm">새로운 매장을 등록하세요</p>
                          </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 