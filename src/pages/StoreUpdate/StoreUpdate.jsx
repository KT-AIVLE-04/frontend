import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { storeApi } from '../../api/store';
import { Card } from '../../components';
import { useApi } from '../../hooks';
import { Store } from '../../models/Store';
import { StoreForm } from './components';

export function StoreUpdate() {
  const location = useLocation();
  const navigate = useNavigate();
  const editStore = location.state?.store;
  const isEditMode = !!editStore;
  
  const [formData, setFormData] = useState(editStore ? new Store(editStore) : Store.createEmpty());
  
  // useApi 훅 사용
  const { loading, error, execute: createStore } = useApi(storeApi.createStore);
  const { execute: updateStore } = useApi(storeApi.updateStore);

  // 연락처 포맷팅 함수
  const formatContactNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // 연락처 입력 핸들러
  const handleContactChange = (e) => {
    const { value } = e.target;
    const formatted = formatContactNumber(value);
    
    setFormData(prev => ({
      ...prev,
      phoneNumber: formatted
    }));
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        const address = data.roadAddress || data.jibunAddress;
        
        console.log('Daum 주소 선택 완료:', {
          address: address,
          fullData: data
        });

        const checkKakaoMapAPI = () => {
          if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            
            geocoder.addressSearch(address, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].x, result[0].y);
                
                console.log('카카오 맵 좌표 변환 완료:', {
                  address: address,
                  latitude: coords.getLat(),
                  longitude: coords.getLng()
                });
                
                setFormData(prev => ({
                  ...prev,
                  address: address,
                  latitude: coords.getLat(),
                  longitude: coords.getLng()
                }));
              } else {
                console.error('주소를 좌표로 변환하는데 실패했습니다.');
                setFormData(prev => ({
                  ...prev,
                  address: address,
                  latitude: null,
                  longitude: null
                }));
              }
            });
          } else {
            console.log('카카오 맵 API 로드 대기 중...');
            setTimeout(checkKakaoMapAPI, 100);
          }
        };

        checkKakaoMapAPI();
      },
      theme: {
        searchBgColor: "#0B65C8",
        queryTextColor: "#FFFFFF"
      }
    }).open();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const storeRequest = new Store(formData);
      if (!storeRequest.isValid()) {
        const errors = storeRequest.getValidationErrors();
        alert(errors.join('\n'));
        return;
      }

      if (isEditMode) {
        await updateStore(editStore.id, storeRequest.toCreateRequest());
        alert('매장 정보가 수정되었습니다.');
      } else {
        await createStore(storeRequest.toCreateRequest());
        alert('새 매장이 추가되었습니다.');
      }
      
      // 이전 페이지로 돌아가기
      navigate(-1);
    } catch (error) {
      console.error('매장 저장 실패:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto">
      <div className="flex items-center mt-4">
        <button
          onClick={handleCancel}
          className="mr-2! p-3 text-gray-600  rounded-xl"
        >
          <ArrowLeft size={20} strokeWidth={4} />
        </button>
        <h1 className="text-2xl font-bold" >{isEditMode ? '매장 정보 수정' : '새 매장 추가'}</h1>
      </div>

      <Card className="p-8 ">
        <StoreForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleContactChange={handleContactChange}
          handleAddressSearch={handleAddressSearch}
          loading={loading}
          error={error}
          onCancel={handleCancel}
          isEditMode={isEditMode}
        />
      </Card>
    </div>
  );
} 