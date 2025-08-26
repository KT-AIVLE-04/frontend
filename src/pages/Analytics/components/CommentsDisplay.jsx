import React, { useState } from 'react';

export function CommentsDisplay({
  realtimeComments,
  historyComments,
  comparisonPeriod
}) {
  const [activeTab, setActiveTab] = useState('realtime');

  const getComparisonLabel = () => {
    switch (comparisonPeriod) {
      case 'yesterday': return '어제';
      case 'week': return '1주일 전';
      case 'month': return '1달 전';
      default: return '어제';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderComments = (comments, title, emptyMessage) => {
    if (!comments || comments.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {comments.slice(0, 5).map((comment, index) => (
          <div key={comment.commentId || index} className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-medium text-gray-900">
                {comment.authorId || `사용자${index + 1}`}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(comment.publishedAt)}
              </div>
            </div>
            
            <div className="text-sm text-gray-700 mb-2">
              {comment.text}
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-3">👍 {comment.likeCount || 0}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">댓글 목록 조회</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('realtime')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'realtime'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            실시간
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {getComparisonLabel()}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>최근 댓글 5개</span>
          <span className="text-xs">
            {activeTab === 'realtime' ? '실시간 데이터' : `${getComparisonLabel()} 데이터`}
          </span>
        </div>
      </div>

      {activeTab === 'realtime' ? (
        renderComments(
          realtimeComments,
          '실시간 댓글',
          '실시간 댓글이 없습니다.'
        )
      ) : (
        renderComments(
          historyComments,
          `${getComparisonLabel()} 댓글`,
          `${getComparisonLabel()} 댓글이 없습니다.`
        )
      )}

      {/* 댓글 통계 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-3">댓글 통계</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">실시간 댓글:</span>
            <span className="font-medium text-blue-600">
              {realtimeComments?.length || 0}개
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">{getComparisonLabel()} 댓글:</span>
            <span className="font-medium text-blue-600">
              {historyComments?.length || 0}개
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">평균 좋아요:</span>
            <span className="font-medium text-blue-600">
              {realtimeComments && realtimeComments.length > 0
                ? Math.round(
                    realtimeComments.reduce((sum, comment) => sum + (comment.likeCount || 0), 0) / 
                    realtimeComments.length
                  )
                : 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">총 좋아요:</span>
            <span className="font-medium text-blue-600">
              {realtimeComments?.reduce((sum, comment) => sum + (comment.likeCount || 0), 0) || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
