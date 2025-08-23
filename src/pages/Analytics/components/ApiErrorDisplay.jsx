import React from 'react';
import { Alert } from '../../../components';

export function ApiErrorDisplay({ errors, title = "일부 데이터를 불러오는데 실패했습니다" }) {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  const errorMessages = Object.entries(errors).map(([key, error]) => {
    const apiName = getApiDisplayName(key);
    return `${apiName}: ${error.message || '알 수 없는 오류'}`;
  });

  return (
    <Alert 
      variant="error" 
      title={title}
      className="mb-6"
    >
      <ul className="list-disc list-inside space-y-1 mt-2">
        {errorMessages.map((message, index) => (
          <li key={index} className="text-sm">
            {message}
          </li>
        ))}
      </ul>
    </Alert>
  );
}

function getApiDisplayName(key) {
  const apiNames = {
    accounts: 'SNS 포스트 정보',
    contents: '콘텐츠 정보',
    performance: '콘텐츠 성과',
    sentiment: '댓글 감정 분석',
    trend: '팔로워 트렌드',
    postingTime: '최적 게시 시간',
    // 실시간 메트릭
    realtime_post_1: '실시간 포스트 메트릭',
    realtime_content_1: '실시간 콘텐츠 메트릭',
    // 히스토리 메트릭
    history_post_1: '포스트 히스토리 메트릭',
    history_content_1: '콘텐츠 히스토리 메트릭'
  };

  // 동적 키 처리 (예: realtime_post_123)
  if (key.startsWith('realtime_post_')) {
    return '실시간 포스트 메트릭';
  }
  if (key.startsWith('realtime_content_')) {
    return '실시간 콘텐츠 메트릭';
  }
  if (key.startsWith('history_post_')) {
    return '포스트 히스토리 메트릭';
  }
  if (key.startsWith('history_content_')) {
    return '콘텐츠 히스토리 메트릭';
  }

  return apiNames[key] || key;
}
