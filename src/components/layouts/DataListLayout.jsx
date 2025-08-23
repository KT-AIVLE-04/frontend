import React from 'react';
import { PageNavigation } from '../organisms';
import { ApiPageLayout } from './ApiPageLayout';

export const DataListLayout = ({
  // ApiPageLayout props
  loading,
  error,
  topSection,
  emptyTitle,
  emptyMessage,
  emptyAction,
  loadingMessage,
  errorTitle,
  errorMessage,
  className,
  
  // 데이터 관련
  data = [],
  isEmpty,
  
  // 렌더링 함수
  renderItem,
  renderList,
  
  // 페이지네이션
  pagination,
  showPagination = true,
  
  // 그리드 옵션
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
  listClassName = "space-y-4",
  
  // 레이아웃 타입
  layoutType = "grid", // "grid" | "list"
  
  // 추가 props
  ...props
}) => {
  const isEmptyData = isEmpty !== undefined ? isEmpty : data.length === 0;

  const renderContent = () => {
    if (layoutType === "list") {
      return (
        <div className={listClassName}>
          {renderList ? renderList(data) : data.map(renderItem)}
        </div>
      );
    }

    return (
      <div className={gridClassName}>
        {renderList ? renderList(data) : data.map(renderItem)}
      </div>
    );
  };

  return (
    <ApiPageLayout
      loading={loading}
      error={error}
      isEmpty={isEmptyData}
      topSection={topSection}
      emptyTitle={emptyTitle}
      emptyMessage={emptyMessage}
      emptyAction={emptyAction}
      loadingMessage={loadingMessage}
      errorTitle={errorTitle}
      errorMessage={errorMessage}
      className={className}
      {...props}
    >
      {renderContent()}
      
      {/* 페이지네이션 */}
      {showPagination && pagination && data.length > 0 && (
        <div className="mt-8">
          <PageNavigation {...pagination} />
        </div>
      )}
    </ApiPageLayout>
  );
};
