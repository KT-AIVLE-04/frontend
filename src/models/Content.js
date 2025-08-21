/**
 * Content 모델 - 백엔드 ContentResponse/ContentDetailResponse와 일치
 */
export class Content {

  constructor(data = {}) {
    this.id = data.id || null;
    this.url = data.url || '';
    this.title = data.title || '';
    this.objectKey = data.objectKey || '';
    this.contentType = data.contentType || '';
    this.width = data.width || null;
    this.height = data.height || null;
    this.durationSeconds = data.durationSeconds || null;
    this.bytes = data.bytes || null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
  }

  // 초기화 함수
  static createEmpty() {
    return new Content();
  }

  // 백엔드 응답에서 Content 객체 생성
  static fromResponse(responseData) {
    return new Content(responseData);
  }

  // 백엔드 응답 배열에서 Content 객체 배열 생성
  static fromResponseArray(responseArray) {
    return responseArray.map(data => new Content(data));
  }

  // 파일 타입 확인
  isImage() {
    return this.contentType && this.contentType.startsWith('image/');
  }

  isVideo() {
    return this.contentType && this.contentType.startsWith('video/');
  }

  // 파일 크기 포맷팅
  getFormattedSize() {
    if (!this.bytes) return '';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  // 비디오 길이 포맷팅
  getFormattedDuration() {
    if (!this.durationSeconds) return '';
    
    const minutes = Math.floor(this.durationSeconds / 60);
    const seconds = this.durationSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // 해상도 정보
  getResolution() {
    if (!this.width || !this.height) return '';
    return `${this.width} x ${this.height}`;
  }

  // 생성일 포맷팅
  getFormattedCreatedAt() {
    if (!this.createdAt) return '';
    return this.createdAt.toLocaleDateString('ko-KR');
  }

  // 수정일 포맷팅
  getFormattedUpdatedAt() {
    if (!this.updatedAt) return '';
    return this.updatedAt.toLocaleDateString('ko-KR');
  }

  // 유효성 검사
  isValid() {
    return this.id && this.url && this.title && this.contentType;
  }

  // 에러 메시지 가져오기
  getValidationErrors() {
    const errors = [];
    if (!this.id) errors.push('콘텐츠 ID가 없습니다.');
    if (!this.url) errors.push('콘텐츠 URL이 없습니다.');
    if (!this.title) errors.push('콘텐츠 제목이 없습니다.');
    if (!this.contentType) errors.push('콘텐츠 타입이 없습니다.');
    return errors;
  }

  // 제목 수정 요청 데이터로 변환
  toTitleUpdateRequest() {
    return {
      title: this.title
    };
  }
}
