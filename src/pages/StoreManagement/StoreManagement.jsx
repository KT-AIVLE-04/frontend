import { Plus } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { storeApi } from '../../api/store';
import { Button, DataListLayout } from '../../components';
import { useApi, useConfirm, useNotification } from '../../hooks';
import { ROUTES } from '../../routes/routes';
import { setSelectedStore } from "../../store/authSlice.js";
import { StoreTable } from './components';

export function StoreManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {selectedStoreId} = useSelector((state) => state.auth);

  // useApi 훅 사용
  const { data: storesData, loading, error, execute: fetchStores } = useApi(storeApi.getStores);
  const { execute: deleteStore } = useApi(storeApi.deleteStore);

  // 새로운 훅들 사용
  const { confirm } = useConfirm();
  const { success, error: showError } = useNotification();

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const stores = storesData?.data?.result || [];

  const handleDelete = async (storeId) => {
    const confirmed = await confirm({
      title: '매장 삭제',
      message: '정말로 이 매장을 삭제하시겠습니까?'
    });

    if (confirmed) {
      try {
        await deleteStore(storeId);
        fetchStores();
        success('매장이 삭제되었습니다.');
      } catch (error) {
        console.error('매장 삭제 실패:', error);
        showError('매장 삭제에 실패했습니다.');
      }
    }
  };

  const handleEdit = (store) => {
    // 편집 모드로 라우팅 (store 데이터를 URL state로 전달)
    navigate(ROUTES.STORE_UPDATE.route, {state: {store}});
  };

  const handleSelect = (store) => {
    dispatch(setSelectedStore(store));
  };

  return (
    <DataListLayout
      loading={loading}
      error={error}
      topSection={
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">매장 관리</h1>
          <Button
            onClick={() => navigate(ROUTES.STORE_UPDATE.route)}
            icon={Plus}
          >
            매장 추가
          </Button>
        </div>
      }
      data={stores}
      isEmpty={stores.length === 0}
      emptyTitle="등록된 매장이 없습니다"
      emptyMessage="새로운 매장을 추가해보세요."
      emptyAction={
        <Button
          onClick={() => navigate(ROUTES.STORE_UPDATE.route)}
          icon={Plus}
        >
          매장 추가하기
        </Button>
      }
      renderList={() => (
        <StoreTable
          stores={stores}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleSelect={handleSelect}
          selectedStoreId={selectedStoreId}
        />
      )}
    />
  );
} 