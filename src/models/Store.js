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

  // Industry 라벨 가져오기
  getIndustryLabel() {
    const industryLabels = {
      'AGRICULTURE': '농업, 임업 및 어업',
      'MINING': '광업',
      'MANUFACTURING': '제조업',
      'ELECTRICITY': '전기, 가스, 증기 및 공기조절',
      'WATER': '수도, 하수, 폐기물 관리',
      'CONSTRUCTION': '건설업',
      'RETAIL': '도매 및 소매업',
      'TRANSPORT': '운수 및 창고업',
      'FOOD': '숙박 및 음식점업',
      'ICT': '정보통신업',
      'FINANCE': '금융 및 보험업',
      'REAL_ESTATE': '부동산업',
      'PROFESSIONAL': '전문, 과학 및 기술 서비스업',
      'BUSINESS': '사업시설관리 및 지원 서비스업',
      'PUBLIC': '공공행정, 국방',
      'EDUCATION': '교육서비스업',
      'HEALTH': '보건 및 사회복지 서비스업',
      'CULTURE': '예술, 스포츠 및 여가',
      'PERSONAL': '수리 및 기타 개인 서비스업',
      'HOUSEHOLD': '가구 내 고용활동 등',
      'FOREIGN': '국제 및 외국기관',
      'ETC': '기타'
    };
    return industryLabels[this.industry] || this.industry;
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
    return this.name && this.address && this.phoneNumber && this.industry;
  }

  // 에러 메시지 가져오기
  getValidationErrors() {
    const errors = [];
    if (!this.name) errors.push('매장명을 입력해주세요.');
    if (!this.address) errors.push('주소를 입력해주세요.');
    if (!this.phoneNumber) errors.push('연락처를 입력해주세요.');
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
      industry: this.industry
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
      industry: this.industry
    };
  }
} 