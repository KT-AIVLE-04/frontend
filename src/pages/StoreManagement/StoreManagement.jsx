import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { storeApi } from '../../api/store';
import { Button, ErrorPage, LoadingSpinner } from '../../components';
import { AddStoreForm, StoreTable } from './components';

export function StoreManagement() {
  const [showAddStore, setShowAddStore] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    category: ''
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await storeApi.getStores();
      setStores(response.data || []);
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
      await storeApi.createStore(formData);
      setFormData({ name: '', address: '', phone: '', category: '' });
      setShowAddStore(false);
      fetchStores();
    } catch (error) {
      console.error('매장 추가 실패:', error);
      alert('매장 추가에 실패했습니다.');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      <AddStoreForm
        showAddStore={showAddStore}
        setShowAddStore={setShowAddStore}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />

      <StoreTable stores={stores} handleDelete={handleDelete} />
    </div>
  );
} 