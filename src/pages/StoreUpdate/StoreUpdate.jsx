import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { storeApi } from '../../api/store';
import { FormPageLayout } from '../../components';
import { INDUSTRY_OPTIONS } from '../../const/industries';
import { useApi, useForm, useNotification } from '../../hooks';
import { Store } from '../../models/Store';
import { ROUTES } from '../../routes/routes.js';
import { formatPhoneNumber, STORE_VALIDATION_SCHEMA } from '../../utils/index.js';
import { FieldsContainer } from './components';

export function StoreUpdate() {
  const location = useLocation();
  const navigate = useNavigate();
  const editStore = location.state?.store;
  const isEditMode = !!editStore;
  
  const formatters = {
    phoneNumber: formatPhoneNumber
  };

  const {
    values: formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setAllErrors,
    setFieldValue
  } = useForm(editStore ? new Store(editStore) : Store.createEmpty(), formatters);
  
  const { loading, error, execute: saveStore } = useApi(
    isEditMode ? storeApi.updateStore : storeApi.createStore,
    {
      onSuccess: (data, response) => {
        console.log('매장 저장 성공:', data);
        success('매장이 성공적으로 저장되었습니다.');
        navigate(ROUTES.STORE_MANAGEMENT.route);
      },
      onError: (error) => {
        console.error('매장 저장 실패:', error);
        showError('매장 저장에 실패했습니다.');
      }
    }
  );

  const { success, error: showError } = useNotification();

  

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
                
                setFieldValue('address', address);
                setFieldValue('latitude', coords.getLat());
                setFieldValue('longitude', coords.getLng());
              } else {
                console.error('주소를 좌표로 변환하는데 실패했습니다.');
                setFieldValue('address', address);
                setFieldValue('latitude', null);
                setFieldValue('longitude', null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('폼 제출됨!', formData);
    
    // 클라이언트 사이드 검증
    const isValid = validateForm(STORE_VALIDATION_SCHEMA);
    if (!isValid) return;
    
    try {
      const storeRequest = new Store(formData);
      if (isEditMode) {
        await saveStore(editStore.id, storeRequest.toUpdateRequest());
        success('매장 정보가 수정되었습니다.');
      } else {
        await saveStore(storeRequest.toCreateRequest());
        success('새 매장이 추가되었습니다.');
      }
      
      // 이전 페이지로 돌아가기
      navigate(-1);
    } catch (error) {
      console.error('매장 저장 실패:', error);
      showError('매장 저장에 실패했습니다.');
      // 서버 에러를 폼 에러로 변환
      if (error.response?.data?.message) {
        setAllErrors({
          name: error.response.data.message.includes('매장명') ? error.response.data.message : '',
          address: error.response.data.message.includes('주소') ? error.response.data.message : '',
          phoneNumber: error.response.data.message.includes('연락처') ? error.response.data.message : '',
          industry: error.response.data.message.includes('업종') ? error.response.data.message : ''
        });
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <FormPageLayout
      loading={loading}
      error={error}
      errorTitle="매장 저장 실패"
      errorMessage={error?.response?.data?.message || '매장 저장에 실패했습니다. 입력 정보를 확인해주세요.'}
      title={isEditMode ? '매장 정보 수정' : '새 매장 추가'}
      onBack={handleCancel}
      onSubmit={handleSubmit}
      submitButton={
        <Button 
          type="submit" 
          loading={loading}
          className="w-full"
        >
          {loading ? '저장 중...' : (isEditMode ? '수정하기' : '추가하기')}
        </Button>
      }
    >
      <FieldsContainer
        formData={formData}
        handleChange={handleChange}
        handleBlur={handleBlur}
        touched={touched}
        errors={errors}
        handleAddressSearch={handleAddressSearch}
        validationSchema={STORE_VALIDATION_SCHEMA}
        industryOptions={INDUSTRY_OPTIONS}
      />
    </FormPageLayout>
  );
} 