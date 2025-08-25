import React from 'react';

export const ApiStateLayout = ({
  // 기본 상태
  loading = false,
  error = null,
  isEmpty = false,
  
  // 메인 콘텐츠
  children,
  
  // 상단 영역 (검색, 필터, 액션 등)
  topSection,
  
  // 상태별 커스텀 컴포넌트
  loadingComponent,
  errorComponent,
  emptyComponent,
  
  // 기본 컴포넌트들 (fallback)
  defaultLoadingComponent,
  defaultErrorComponent,
  defaultEmptyComponent,
  
  // 클래스명
  className = "",
  containerClassName = ""
}) => {
  // 로딩 상태
  if (loading) {
    if (loadingComponent) {
      return loadingComponent;
    }
    if (defaultLoadingComponent) {
      return defaultLoadingComponent;
    }
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    if (errorComponent) {
      return errorComponent;
    }
    if (defaultErrorComponent) {
      return defaultErrorComponent;
    }
    
    // 기본 에러 처리 (ApiPageLayout과 동일)
    const getErrorMessage = () => {
      if (error instanceof Error) {
        return error.message;
      }
      if (typeof error === 'string') {
        return error;
      }
      if (error && typeof error === 'object') {
        return error.message || error.error || '알 수 없는 오류가 발생했습니다.';
      }
      return '오류가 발생했습니다.';
    };

    const getErrorTitle = () => {
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
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{getErrorTitle()}</h3>
          <p className="text-gray-600">{getErrorMessage()}</p>
        </div>
      </div>
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
          emptyComponent || defaultEmptyComponent || (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-4">📭</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">데이터가 없습니다</h3>
                <p className="text-gray-600">표시할 데이터가 없습니다.</p>
              </div>
            </div>
          )
        ) : (
          children
        )}
      </div>
    </div>
  );
};
