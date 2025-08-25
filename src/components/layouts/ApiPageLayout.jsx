import React from 'react';
import { EmptyState, ErrorPage, LoadingSpinner } from '../organisms';

export const ApiPageLayout = ({
  // 기본 상태
  loading = false,
  error = null,
  isEmpty = false,
  
  // 메인 콘텐츠
  children,
  
  // 상단 영역 (검색, 필터, 액션 등)
  topSection,
  
  // 빈 상태 정보
  emptyTitle = "데이터가 없습니다",
  emptyMessage = "표시할 데이터가 없습니다.",
  emptyAction,
  
  // 로딩 메시지
  loadingMessage = "데이터를 불러오는 중...",
  
  // 에러 정보
  errorTitle = "오류가 발생했습니다",
  errorMessage,
  
  // 클래스명
  className = "",
  containerClassName = ""
}) => {
  // 로딩 상태
  if (loading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  // 에러 상태 - useApi의 Error 타입 활용
  if (error) {
    // Error 객체에서 메시지 추출
    const getErrorMessage = () => {
      if (errorMessage) return errorMessage;
      
      // Error 객체인 경우
      if (error instanceof Error) {
        return error.message;
      }
      
      // 문자열인 경우
      if (typeof error === 'string') {
        return error;
      }
      
      // 객체인 경우 (API 응답 에러)
      if (error && typeof error === 'object') {
        return error.message || error.error || '알 수 없는 오류가 발생했습니다.';
      }
      
      return '오류가 발생했습니다.';
    };

    // Error 객체에서 제목 추출
    const getErrorTitle = () => {
      if (errorTitle) return errorTitle;
      
      // API 응답 에러인 경우
      if (error && typeof error === 'object' && error.response) {
        const status = error.response.status;
        if (status === 404) return "데이터를 찾을 수 없습니다";
        if (status === 403) return "접근 권한이 없습니다";
        if (status === 401) return "인증이 필요합니다";
        if (status >= 500) return "서버 오류가 발생했습니다";
      }
      
      return "오류가 발생했습니다";
    };

    return (
      <ErrorPage 
        title={getErrorTitle()} 
        message={getErrorMessage()} 
      />
    );
  }

  return (
    <div className={`flex-1 w-full ${className}`}>
      {/* 상단 영역 (검색, 필터, 액션 등) */}
      {topSection && (
        <div className="mb-6">
          {topSection}
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className={containerClassName}>
        {isEmpty ? (
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
            action={emptyAction}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
};
