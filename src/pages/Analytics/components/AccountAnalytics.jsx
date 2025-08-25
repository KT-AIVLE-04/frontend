import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { analyticsApi } from '../../../api/analytics';
import { LoadingSpinner } from '../../../components';
import { useApi } from '../../../hooks';

export function AccountAnalytics({ selectedSnsType, dateRange }) {
  const { connections } = useSelector((state) => state.sns);
  const currentConnection = connections[selectedSnsType];
  const accountId = currentConnection?.accountInfo?.id;

  // 날짜 계산 헬퍼
  const getDateString = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  // 실시간 계정 메트릭
  const { 
    data: realtimeData, 
    loading: realtimeLoading, 
    error: realtimeError,
    execute: executeRealtime 
  } = useApi(analyticsApi.getRealtimeAccountMetrics);

  // 히스토리 계정 메트릭 (어제)
  const { 
    data: historyData, 
    loading: historyLoading, 
    error: historyError,
    execute: executeHistory 
  } = useApi(analyticsApi.getHistoryAccountMetrics);

  // 데이터 로드
  useEffect(() => {
    if (!accountId) return;

    const yesterday = getDateString(1);
    executeRealtime(accountId);
    executeHistory(yesterday, accountId);
  }, [accountId, executeRealtime, executeHistory]);

  if (!accountId) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">계정 분석</h2>
        <div className="text-center py-8 text-gray-500">
          SNS 계정을 연결해주세요
        </div>
      </div>
    );
  }

  if (realtimeLoading || historyLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">계정 분석</h2>
        <LoadingSpinner message="계정 데이터를 불러오는 중..." />
      </div>
    );
  }

  if (realtimeError || historyError) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">계정 분석</h2>
        <div className="text-center py-8 text-red-500">
          계정 데이터를 불러오는데 실패했습니다
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">계정 분석</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 팔로워 수 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">팔로워</p>
              <p className="text-2xl font-bold text-blue-800">
                {realtimeData?.followerCount?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="text-blue-500 text-2xl">👥</div>
          </div>
          {historyData?.followerCount && (
            <p className="text-xs text-blue-600 mt-1">
              어제: {historyData.followerCount.toLocaleString()}
            </p>
          )}
        </div>

        {/* 조회수 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">총 조회수</p>
              <p className="text-2xl font-bold text-green-800">
                {realtimeData?.viewCount?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="text-green-500 text-2xl">👁️</div>
          </div>
          {historyData?.viewCount && (
            <p className="text-xs text-green-600 mt-1">
              어제: {historyData.viewCount.toLocaleString()}
            </p>
          )}
        </div>

        {/* 좋아요 */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">총 좋아요</p>
              <p className="text-2xl font-bold text-red-800">
                {realtimeData?.likeCount?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="text-red-500 text-2xl">❤️</div>
          </div>
          {historyData?.likeCount && (
            <p className="text-xs text-red-600 mt-1">
              어제: {historyData.likeCount.toLocaleString()}
            </p>
          )}
        </div>

        {/* 댓글 */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">총 댓글</p>
              <p className="text-2xl font-bold text-purple-800">
                {realtimeData?.commentCount?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="text-purple-500 text-2xl">💬</div>
          </div>
          {historyData?.commentCount && (
            <p className="text-xs text-purple-600 mt-1">
              어제: {historyData.commentCount.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* 계정 정보 */}
      {currentConnection?.accountInfo && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-2">계정 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">계정명:</span>
              <span className="ml-2 font-medium">{currentConnection.accountInfo.snsAccountName}</span>
            </div>
            <div>
              <span className="text-gray-600">계정 ID:</span>
              <span className="ml-2 font-medium">{currentConnection.accountInfo.snsAccountId}</span>
            </div>
            {currentConnection.accountInfo.snsAccountDescription && (
              <div className="md:col-span-2">
                <span className="text-gray-600">설명:</span>
                <span className="ml-2">{currentConnection.accountInfo.snsAccountDescription}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
