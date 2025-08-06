import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { storeApi } from '../../api/store';
import { Button, ErrorPage, LoadingSpinner } from '../../components';
import { Store } from '../../models/Store';
import { StoreForm, StoreTable } from './components';

export function StoreManagement() {
  const [showAddStore, setShowAddStore] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(Store.createEmpty());

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await storeApi.getStores();
      // API에서 이미 Store 객체 배열로 변환됨
      setStores(response.data?.result || []);
    } catch (error) {
      console.error('매장 목록 로딩 실패:', error);
      setError('매장 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingStore) {
        // 수정 모드
        const updateRequest = new Store(formData);
        if (!updateRequest.isValid()) {
          const errors = updateRequest.getValidationErrors();
          alert(errors.join('\n'));
          return;
        }
        await storeApi.updateStore(editingStore.id, updateRequest.toUpdateRequest());
        setEditingStore(null);
      } else {
        // 추가 모드
        const createRequest = new Store(formData);
        if (!createRequest.isValid()) {
          const errors = createRequest.getValidationErrors();
          alert(errors.join('\n'));
          return;
        }
        await storeApi.createStore(createRequest.toCreateRequest());
      }
      
      setFormData(Store.createEmpty());
      setShowAddStore(false);
      fetchStores();
    } catch (error) {
      console.error('매장 저장 실패:', error);
      alert('매장 저장에 실패했습니다.');
    }
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setFormData(new Store({
      name: store.name,
      address: store.address,
      phoneNumber: store.phoneNumber,
      industry: store.industry,
      businessNumber: store.businessNumber || '',
      latitude: store.latitude,
      longitude: store.longitude
    }));
    setShowAddStore(true);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setShowAddStore(false);
    setEditingStore(null);
    setFormData(Store.createEmpty());
  };

  if (error) {
    return <ErrorPage title="매장 목록 로딩 실패" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">매장 관리</h1>
        <Button 
          onClick={() => setShowAddStore(true)}
          icon={Plus}
        >
          매장 추가
        </Button>
      </div>

      <StoreForm
        showAddStore={showAddStore}
        setShowAddStore={setShowAddStore}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        editingStore={editingStore}
        onCancel={handleCancel}
      />

      <StoreTable stores={stores} handleDelete={handleDelete} handleEdit={handleEdit} />
    </div>
  );
} 