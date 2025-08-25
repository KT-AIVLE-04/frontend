import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { analyticsApi } from '../../../api/analytics';
import { snsApi } from '../../../api/sns';
import { LoadingSpinner } from '../../../components';
import { useApi } from '../../../hooks';
import { ContentPerformanceTable } from './';

export function ContentPerformanceSection({ selectedSnsType, dateRange }) {
  const { connections } = useSelector((state) => state.sns);
  const currentConnection = connections[selectedSnsType];
  const accountId = currentConnection?.accountInfo?.id;

  // 포스트 목록 가져오기
  const { 
    data: postsData, 
    loading: postsLoading, 
    error: postsError,
    execute: executePosts 
  } = useApi(snsApi.post.getPosts);

  // 콘텐츠 성과 분석
  const { 
    data: performanceData, 
    loading: performanceLoading, 
    error: performanceError,
    execute: executePerformance 
  } = useApi(analyticsApi.getContentPerformance);

  // 데이터 로드
  useEffect(() => {
    if (!accountId) return;
    executePosts();
  }, [accountId, executePosts]);

  useEffect(() => {
    if (!accountId) return;
    executePerformance({ dateRange, snsType: selectedSnsType });
  }, [accountId, dateRange, selectedSnsType, executePerformance]);

  if (!accountId) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">콘텐츠 성과 분석</h2>
        <div className="text-center py-8 text-gray-500">
          SNS 계정을 연결해주세요
        </div>
      </div>
    );
  }

  if (postsLoading || performanceLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">콘텐츠 성과 분석</h2>
        <LoadingSpinner message="콘텐츠 성과 데이터를 불러오는 중..." />
      </div>
    );
  }

  if (postsError || performanceError) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">콘텐츠 성과 분석</h2>
        <div className="text-center py-8 text-red-500">
          콘텐츠 성과 데이터를 불러오는데 실패했습니다
        </div>
      </div>
    );
  }

  // 포스트 목록에서 선택된 SNS 타입의 포스트만 필터링
  const filteredPosts = postsData?.result?.filter(post => post.snsType === selectedSnsType) || [];
  
  // 성과 데이터와 포스트 데이터를 결합
  const combinedData = performanceData?.result?.map(performance => {
    const matchingPost = filteredPosts.find(post => post.id === performance.id);
    return {
      ...performance,
      title: matchingPost?.title || performance.title,
      publishAt: matchingPost?.publishAt || performance.publishAt,
      snsType: matchingPost?.snsType || performance.platform
    };
  }) || [];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">콘텐츠 성과 분석</h2>
      
      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">총 포스트</p>
              <p className="text-2xl font-bold text-blue-800">
                {filteredPosts.length}
              </p>
            </div>
            <div className="text-blue-500 text-2xl">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">총 조회수</p>
              <p className="text-2xl font-bold text-green-800">
                {combinedData.reduce((sum, item) => sum + (item.views || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="text-green-500 text-2xl">👁️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">총 좋아요</p>
              <p className="text-2xl font-bold text-red-800">
                {combinedData.reduce((sum, item) => sum + (item.likes || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="text-red-500 text-2xl">❤️</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">총 댓글</p>
              <p className="text-2xl font-bold text-purple-800">
                {combinedData.reduce((sum, item) => sum + (item.comments || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="text-purple-500 text-2xl">💬</div>
          </div>
        </div>
      </div>

      {/* 성과 테이블 */}
      <ContentPerformanceTable contentPerformance={combinedData} />

      {/* 데이터가 없는 경우 */}
      {combinedData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          분석할 콘텐츠가 없습니다
        </div>
      )}
    </div>
  );
}
