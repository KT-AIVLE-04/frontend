import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, ErrorPage } from '../../components';
import { ContentTypeSelector, ShortsWorkflow } from './components';

export function ContentCreation() {
  const selectedStoreId = useSelector((state) => state.auth.selectedStoreId);
  const [contentType, setContentType] = useState(null);

  if (!selectedStoreId) {
    return <ErrorPage title="매장이 선택되지 않음" message="먼저 매장을 선택해주세요." />;
  }

  return (
    <div className="flex-1 w-full">
      <h1 className="text-2xl font-bold mb-6">콘텐츠 제작</h1>
      
      {!contentType && (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-8">
            제작할 콘텐츠 유형을 선택하세요
          </h2>
          <ContentTypeSelector contentType={contentType} setContentType={setContentType} />
        </Card>
      )}

      {contentType === 'video' && (
        <ShortsWorkflow setContentType={setContentType} />
      )}

      {contentType === 'image' && (
        <Card className="overflow-hidden p-6">
          <h2 className="text-lg font-semibold mb-4">이미지 생성</h2>
          <p className="text-gray-500 mb-6">
            AI 이미지 생성 기능은 준비 중입니다. 곧 서비스될 예정입니다.
          </p>
          <button 
            onClick={() => setContentType(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            돌아가기
          </button>
        </Card>
      )}
    </div>
  );
} 