import React from 'react';
import { Alert, Card, LoadingSpinner } from '../molecules';

export const FormPageLayout = ({
  // 기본 상태
  loading = false,
  error = null,
  
  // 메인 콘텐츠
  children,
  
  // 제목과 설명
  title,
  description,
  
  // 뒤로가기 버튼
  onBack,
  backButtonText = "돌아가기",
  
  // 폼 관련
  onSubmit,
  
  // 폼 옵션
  formClassName = "space-y-6",
  cardClassName = "p-8",
  
  // 버튼 영역
  submitButton,
  cancelButton,
  buttonArea,
  
  // 클래스명
  className = "",
  
  // 로딩 메시지
  loadingMessage = "처리 중...",
  
  // 에러 정보
  errorTitle = "오류가 발생했습니다",
  errorMessage,
  
  // 추가 콘텐츠 (하단 링크 등)
  bottomContent
}) => {
  const renderButtonArea = () => {
    if (buttonArea) {
      return buttonArea;
    }

    if (submitButton || cancelButton) {
      return (
        <div className="flex justify-end gap-3 pt-6">
          {cancelButton}
          {submitButton}
        </div>
      );
    }

    return null;
  };

  // 로딩 상태
  if (loading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  return (
    <div className={`flex-1 max-w-2xl mx-auto ${className}`}>
      {/* 헤더 영역 - Register.jsx와 동일한 스타일 */}
      <div className="flex items-center mt-4">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-2! p-3 text-gray-600 rounded-xl"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {/* 메인 콘텐츠 */}
      <Card className={cardClassName}>
        {error && (
          <Alert
            type="error"
            title={errorTitle}
            message={errorMessage || error}
          />
        )}
        <form onSubmit={onSubmit} className={formClassName}>
          {children}
          {renderButtonArea()}
        </form>
        {bottomContent}
      </Card>
    </div>
  );
};
