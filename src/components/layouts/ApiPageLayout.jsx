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

  // 에러 상태
  if (error) {
    return (
      <ErrorPage 
        title={errorTitle} 
        message={errorMessage || error} 
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
