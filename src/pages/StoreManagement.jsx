import { Pencil, Plus, Store, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { storeApi } from '../api/store';
import { Button, DataTable, ErrorPage, FormField, LoadingSpinner } from '../components';

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
      fetchStores(); // 목록 새로고침
    } catch (error) {
      console.error('매장 추가 실패:', error);
      alert('매장 추가에 실패했습니다.');
    }
  };

  const handleDelete = async (storeId) => {
    if (window.confirm('정말로 이 매장을 삭제하시겠습니까?')) {
      try {
        await storeApi.deleteStore(storeId);
        fetchStores(); // 목록 새로고침
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

      {showAddStore ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">새 매장 추가</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField
              label="매장명"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="매장명을 입력하세요"
              required
            />
            <FormField
              label="매장 주소"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="매장 주소를 입력하세요"
              required
            />
            <FormField
              label="매장 연락처"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="매장 연락처를 입력하세요"
              required
            />
            <FormField
              label="매장 업종"
              name="category"
              type="select"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="업종을 선택하세요"
              required
              options={[
                { value: "cafe", label: "카페/디저트" },
                { value: "restaurant", label: "음식점" },
                { value: "fashion", label: "패션/의류" },
                { value: "beauty", label: "미용/뷰티" },
                { value: "other", label: "기타" }
              ]}
            />
            <div className="flex justify-end space-x-3 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowAddStore(false)}
              >
                취소
              </Button>
              <Button 
                type="submit" 
                variant="primary"
              >
                저장
              </Button>
            </div>
          </form>
        </div>
      ) : null}

      <DataTable
        columns={[
          {
            key: 'name',
            header: '매장명',
            render: (value, store) => (
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Store size={18} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {value}
                  </div>
                </div>
              </div>
            )
          },
          { key: 'address', header: '주소' },
          { key: 'phone', header: '연락처' },
          { key: 'category', header: '업종' },
          {
            key: 'actions',
            header: '관리',
            align: 'right',
            render: (value, store) => (
              <div>
                <button className="text-blue-600 hover:text-blue-900 mr-3">
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(store.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          }
        ]}
        data={stores}
        emptyMessage="등록된 매장이 없습니다"
      />
    </div>
  );
} 