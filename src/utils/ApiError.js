/**
 * API 에러를 위한 커스텀 에러 클래스
 * Error를 상속받아 message와 status 속성을 포함
 */
export class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
