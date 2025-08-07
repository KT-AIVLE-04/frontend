import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { storeApi } from '../../api/store';
import { Button, ErrorPage, LoadingSpinner } from '../../components';
import { ROUTES } from '../../routes/routes';
import { StoreTable } from './components';

export function StoreManagement() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await storeApi.getStores();
      setStores(response.data?.result || []);
    } catch (error) {
      console.error('매장 목록 로딩 실패:', error);
      setError('매장 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storeId) => {
    if (window.confirm('정말로 이 매장을 삭제하시겠습니까?')) {
      try {
        await storeApi.deleteStore(storeId);
        fetchStores();
      } catch (error) {
        console.error('매장 삭제 실패:', error);
        alert('매장 삭제에 실패했습니다.');
      }
    }
  };

  const handleEdit = (store) => {
    // 편집 모드로 라우팅 (store 데이터를 URL state로 전달)
    navigate(ROUTES.STORE_UPDATE.route, { state: { store } });
  };

  const handleSelect = (store) => {
    dispatch(setSelectedStore(store));
    navigate(ROUTES.DASHBOARD.route);
  };

  if (error) {
    return <ErrorPage title="매장 목록 로딩 실패" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">매장 관리</h1>
        <Button 
          onClick={() => navigate(ROUTES.STORE_UPDATE.route)}
          icon={Plus}
        >
          매장 추가
        </Button>
      </div>

      <StoreTable 
        stores={stores} 
        handleDelete={handleDelete} 
        handleEdit={handleEdit}
        handleSelect={handleSelect}
      />
    </div>
  );
} 