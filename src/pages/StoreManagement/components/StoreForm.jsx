import { MapPin } from 'lucide-react';
import { Button, FormField } from '../../../components';
import { INDUSTRY_OPTIONS } from '../../../const/industries';

export const StoreForm = ({ 
  showAddStore, 
  setShowAddStore, 
  formData, 
  setFormData, 
  handleSubmit, 
  handleInputChange,
  editingStore,
  onCancel
}) => {
  // 연락처 포맷팅 함수
  const formatContactNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 길이에 따라 포맷팅
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else if (numbers.length <= 11) {
      // 휴대전화: 010-1234-5678
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      // 지역번호: 031-1234-5678
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
        // 도로명 주소와 지번 주소 모두 사용 가능
        const address = data.roadAddress || data.jibunAddress;
        
        console.log('Daum 주소 선택 완료:', {
          address: address,
          fullData: data
        });

        // 카카오 맵 API 로드 확인 및 대기
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
                // 좌표 변환 실패 시에도 주소는 저장
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
            setTimeout(checkKakaoMapAPI, 100); // 100ms 후 다시 확인
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

  if (!showAddStore) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {editingStore ? '매장 수정' : '새 매장 추가'}
      </h2>
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
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            매장 주소
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="주소 찾기를 클릭하여 주소를 입력하세요"
              required
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
            <Button
              type="button"
              onClick={handleAddressSearch}
              icon={MapPin}
              className="px-4 py-2"
            >
              주소 찾기
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            매장 연락처
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleContactChange}
            placeholder="02-1234-5678 또는 010-1234-5678"
            maxLength="13"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <FormField
          label="사업자등록번호"
          name="businessNumber"
          type="text"
          value={formData.businessNumber}
          onChange={handleInputChange}
          placeholder="사업자등록번호 (선택사항)"
        />
        <FormField
          label="매장 업종"
          name="industry"
          type="select"
          value={formData.industry}
          onChange={handleInputChange}
          placeholder="업종을 선택하세요"
          required
          options={INDUSTRY_OPTIONS}
        />
        <div className="flex justify-end space-x-3 pt-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            className="!mr-2"
          >
            취소
          </Button>
          <Button 
            type="submit" 
            variant="primary"
          >
            {editingStore ? '수정' : '저장'}
          </Button>
        </div>
      </form>
    </div>
  );
}; 