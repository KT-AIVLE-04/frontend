/**
 * SNS 타입 enum
 */
export const SNS_TYPES = {
  YOUTUBE: 'youtube',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook'
};

/**
 * SNS 타입 라벨
 */
export const SNS_TYPE_LABELS = {
  [SNS_TYPES.YOUTUBE]: 'YouTube',
  [SNS_TYPES.INSTAGRAM]: 'Instagram',
  [SNS_TYPES.FACEBOOK]: 'Facebook'
};

/**
 * SNS Account 모델 - 백엔드 SnsAccountResponse와 일치
 */
export class SnsAccount {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.storeId = data.storeId || null;
    this.snsType = data.snsType || '';
    this.snsAccountId = data.snsAccountId || '';
    this.snsAccountName = data.snsAccountName || '';
    this.snsAccountDescription = data.snsAccountDescription || '';
    this.snsAccountUrl = data.snsAccountUrl || '';
    this.follower = data.follower || 0;
    this.postCount = data.postCount || 0;
    this.viewCount = data.viewCount || 0;
    this.keyword = data.keyword || [];
  }

  // 초기화 함수
  static createEmpty() {
    return new SnsAccount();
  }

  // 백엔드 응답에서 SnsAccount 객체 생성
  static fromResponse(responseData) {
    return new SnsAccount(responseData);
  }

  // 백엔드 응답 배열에서 SnsAccount 객체 배열 생성
  static fromResponseArray(responseArray) {
    return responseArray.map(data => new SnsAccount(data));
  }

  // SNS 타입 라벨 가져오기 (Static 메서드)
  static getSnsTypeLabel(snsType) {
    return SNS_TYPE_LABELS[snsType] || snsType;
  }

  // SNS 타입이 유효한지 확인
  static isValidSnsType(snsType) {
    return Object.values(SNS_TYPES).includes(snsType);
  }

  // SNS 타입 enum 값들 가져오기
  static getSnsTypes() {
    return Object.values(SNS_TYPES);
  }

  // SNS 타입과 라벨 쌍 가져오기
  static getSnsTypeOptions() {
    return Object.entries(SNS_TYPE_LABELS).map(([value, label]) => ({
      value,
      label
    }));
  }

  // 계정 ID가 있는지 확인
  hasAccountId() {
    return this.snsAccountId && this.snsAccountId.trim() !== '';
  }

  // 계정명이 있는지 확인
  hasAccountName() {
    return this.snsAccountName && this.snsAccountName.trim() !== '';
  }

  // 유효성 검사
  isValid() {
    return this.snsType && this.snsAccountId && this.snsAccountName;
  }

  // 팔로워 수 가져오기
  getFollowerCount() {
    return this.follower || 0;
  }

  // 게시물 수 가져오기
  getPostCount() {
    return this.postCount || 0;
  }

  // 조회수 가져오기
  getViewCount() {
    return this.viewCount || 0;
  }

  // 키워드 배열 가져오기
  getKeywords() {
    return this.keyword || [];
  }

  // 에러 메시지 가져오기
  getValidationErrors() {
    const errors = [];
    if (!this.snsType) errors.push('SNS 타입을 선택해주세요.');
    if (!this.snsAccountId) errors.push('SNS 계정 ID를 입력해주세요.');
    if (!this.snsAccountName) errors.push('SNS 계정명을 입력해주세요.');
    return errors;
  }

  // 생성 요청 데이터로 변환
  toCreateRequest() {
    return {
      snsType: this.snsType,
      snsAccountId: this.snsAccountId,
      snsAccountName: this.snsAccountName,
      snsAccountDescription: this.snsAccountDescription,
      snsAccountUrl: this.snsAccountUrl
    };
  }

  // 업데이트 요청 데이터로 변환
  toUpdateRequest() {
    return {
      snsAccountName: this.snsAccountName,
      snsAccountDescription: this.snsAccountDescription,
      snsAccountUrl: this.snsAccountUrl
    };
  }

  // SNS 타입 라벨 가져오기 (인스턴스 메서드)
  getSnsTypeLabel() {
    return SnsAccount.getSnsTypeLabel(this.snsType);
  }
}
