import { INDUSTRY_LABELS } from '../const/industries';
import { isValidPhoneNumber } from '../utils/formatUtils';

/**
 * Store 모델 - 백엔드 StoreResponse와 일치
 */
export class Store {

  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.name = data.name || '';
    this.address = data.address || '';
    this.phoneNumber = data.phoneNumber || '';
    this.businessNumber = data.businessNumber || '';
    this.latitude = data.latitude || null;
    this.longitude = data.longitude || null;
    this.industry = data.industry || '';
  }

  // 초기화 함수
  static createEmpty() {
    return new Store();
  }

  // 백엔드 응답에서 Store 객체 생성
  static fromResponse(responseData) {
    return new Store(responseData);
  }

  // 백엔드 응답 배열에서 Store 객체 배열 생성
  static fromResponseArray(responseArray) {
    return responseArray.map(data => new Store(data));
  }

  // Industry 라벨 가져오기 (Static 메서드)
  static getIndustryLabel(industry) {
    return INDUSTRY_LABELS[industry] || industry;
  }

  // 위치 정보가 있는지 확인
  hasLocation() {
    return this.latitude !== null && this.longitude !== null;
  }

  // 사업자등록번호가 있는지 확인
  hasBusinessNumber() {
    return this.businessNumber && this.businessNumber.trim() !== '';
  }

  // 유효성 검사
  isValid() {
    return this.name && this.address && this.phoneNumber && this.industry && isValidPhoneNumber(this.phoneNumber);
  }

  // 에러 메시지 가져오기
  getValidationErrors() {
    const errors = [];
    if (!this.name) errors.push('매장명을 입력해주세요.');
    if (!this.address) errors.push('주소를 입력해주세요.');
    if (!this.phoneNumber) errors.push('연락처를 입력해주세요.');
    if (!isValidPhoneNumber(this.phoneNumber)) errors.push('올바른 연락처 형식을 입력해주세요. (예: 02-1234-5678)');
    if (!this.industry) errors.push('업종을 선택해주세요.');
    return errors;
  }

  // 생성 요청 데이터로 변환
  toCreateRequest() {
    return {
      name: this.name,
      address: this.address,
      phoneNumber: this.phoneNumber,
      businessNumber: this.businessNumber,
      latitude: this.latitude,
      longitude: this.longitude,
      industry: INDUSTRY_LABELS[this.industry] || this.industry
    };
  }

  // 업데이트 요청 데이터로 변환
  toUpdateRequest() {
    return {
      name: this.name,
      address: this.address,
      phoneNumber: this.phoneNumber,
      latitude: this.latitude,
      longitude: this.longitude,
      industry: INDUSTRY_LABELS[this.industry] || this.industry
    };
  }
} 