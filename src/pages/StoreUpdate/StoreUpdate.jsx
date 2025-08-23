import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { storeApi } from '../../api/store';
import { Button, FormPageLayout } from '../../components';
import { useApi, useNotification } from '../../hooks';
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

  // 새로운 훅들 사용
  const { success, error: showError } = useNotification();

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
        success('매장 정보가 수정되었습니다.');
      } else {
        await createStore(storeRequest.toCreateRequest());
        success('새 매장이 추가되었습니다.');
      }
      
      // 이전 페이지로 돌아가기
      navigate(-1);
    } catch (error) {
      console.error('매장 저장 실패:', error);
      showError('매장 저장에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <FormPageLayout
      loading={loading}
      error={error}
      topSection={
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{isEditMode ? '매장 정보 수정' : '새 매장 추가'}</h1>
          <Button
            onClick={handleCancel}
            variant="ghost"
            icon={ArrowLeft}
          >
            돌아가기
          </Button>
        </div>
      }
      onSubmit={handleSubmit}
      submitButton={
        <Button
          type="submit"
          loading={loading}
        >
          {isEditMode ? '수정하기' : '추가하기'}
        </Button>
      }
      cancelButton={
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
        >
          취소
        </Button>
      }
    >
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
    </FormPageLayout>
  );
} 