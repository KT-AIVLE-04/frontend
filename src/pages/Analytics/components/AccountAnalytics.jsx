import { Eye, Users } from 'lucide-react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { analyticsApi } from '../../../api/analytics';
import { LoadingSpinner } from '../../../components';
import { useApi } from '../../../hooks';

export function AccountAnalytics({ selectedSnsType }) {
  const { connections } = useSelector((state) => state.sns);
  const currentConnection = connections[selectedSnsType];

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
    if (!selectedSnsType) return;

    const yesterday = getDateString(1);
    executeRealtime(selectedSnsType);
    executeHistory(yesterday, selectedSnsType);
  }, [selectedSnsType, executeRealtime, executeHistory]);

  if (!selectedSnsType) {
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
                {realtimeData?.followers?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="text-blue-500">
              <Users size={24} />
            </div>
          </div>
          {historyData?.followers && (
            <p className="text-xs text-blue-600 mt-1">
              어제: {historyData.followers.toLocaleString()}
            </p>
          )}
        </div>

        {/* 조회수 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">총 조회수</p>
              <p className="text-2xl font-bold text-green-800">
                {realtimeData?.views?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="text-green-500">
              <Eye size={24} />
            </div>
          </div>
          {historyData?.views && (
            <p className="text-xs text-green-600 mt-1">
              어제: {historyData.views.toLocaleString()}
            </p>
          )}
        </div>

        {/* 계정 정보 */}
        {currentConnection?.accountInfo && (
          <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">계정 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">계정명:</span>
                <span className="ml-2 font-medium">{currentConnection.accountInfo.snsAccountName}</span>
              </div>
                          <div>
              <span className="text-gray-600">키워드:</span>
              <div className=" flex flex-wrap gap-1 mt-2">
                {currentConnection.accountInfo.keyword?.map((kw, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-20 text-shadow-purple-700 text-xs rounded-full font-medium"
                  >
                    #{kw}
                  </span>
                )) || <span className="text-gray-500">키워드 없음</span>}
              </div>
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
    </div>
  );
}
