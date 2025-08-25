import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { analyticsApi } from '../../../api/analytics';
import { snsApi } from '../../../api/sns';
import { LoadingSpinner } from '../../../components';
import { useApi, useMultipleApi } from '../../../hooks';
import { CommentsDisplay, EmotionAnalysis } from './';

export function PostAnalytics({ selectedSnsType, dateRange }) {
  const { connections } = useSelector((state) => state.sns);
  const currentConnection = connections[selectedSnsType];
  const accountId = currentConnection?.accountInfo?.id;
  
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comparisonPeriod, setComparisonPeriod] = useState("yesterday");

  // 날짜 계산 헬퍼
  const getDateString = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  // 포스트 목록 가져오기
  const { 
    data: postsData, 
    loading: postsLoading, 
    error: postsError,
    execute: executePosts 
  } = useApi(snsApi.post.getPosts);

  // 포스트 메트릭들
  const { 
    loading: metricsLoading, 
    error: metricsError, 
    results: metricsResults, 
    executeMultiple: executeMetrics 
  } = useMultipleApi({});

  // 포스트 목록 로드
  useEffect(() => {
    if (!accountId) return;
    executePosts();
  }, [accountId, executePosts]);

  // 포스트 목록 처리
  useEffect(() => {
    if (postsData?.result) {
      const filteredPosts = postsData.result.filter(post => post.snsType === selectedSnsType);
      setPosts(filteredPosts);
      
      // 첫 번째 포스트를 기본 선택
      if (filteredPosts.length > 0 && !selectedPostId) {
        setSelectedPostId(filteredPosts[0].id || filteredPosts[0].postId);
      }
    }
  }, [postsData, selectedSnsType, selectedPostId]);

  // 선택된 포스트의 메트릭 로드
  useEffect(() => {
    if (!accountId || !selectedPostId) return;

    const yesterday = getDateString(1);
    const weekAgo = getDateString(7);
    const monthAgo = getDateString(30);

    const apiCalls = {
      // 실시간 포스트 메트릭
      realtimePost: () => analyticsApi.getRealtimePostMetrics(accountId, selectedPostId),
      
      // 히스토리 포스트 메트릭들
      historyPostYesterday: () => analyticsApi.getHistoryPostMetrics(yesterday, accountId, selectedPostId),
      historyPostWeek: () => analyticsApi.getHistoryPostMetrics(weekAgo, accountId, selectedPostId),
      historyPostMonth: () => analyticsApi.getHistoryPostMetrics(monthAgo, accountId, selectedPostId),
      
      // 댓글
      realtimeComments: () => analyticsApi.getRealtimeComments(accountId, selectedPostId, 0, 5),
      historyComments: () => analyticsApi.getHistoryComments(yesterday, accountId, selectedPostId, 0, 5),
      
      // 감정분석
      emotionAnalysis: () => analyticsApi.getHistoryEmotionAnalysis(yesterday, accountId, selectedPostId)
    };

    executeMetrics(apiCalls);
  }, [accountId, selectedPostId, executeMetrics]);

  if (!accountId) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">포스트 분석</h2>
        <div className="text-center py-8 text-gray-500">
          SNS 계정을 연결해주세요
        </div>
      </div>
    );
  }

  if (postsLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">포스트 분석</h2>
        <LoadingSpinner message="포스트 목록을 불러오는 중..." />
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">포스트 분석</h2>
        <div className="text-center py-8 text-red-500">
          포스트 목록을 불러오는데 실패했습니다
        </div>
      </div>
    );
  }

  const selectedPost = posts.find(post => (post.id || post.postId) === selectedPostId);
  const realtimeData = metricsResults.realtimePost;
  const historyData = metricsResults[`historyPost${comparisonPeriod.charAt(0).toUpperCase() + comparisonPeriod.slice(1)}`];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">포스트 분석</h2>
      
      {/* 포스트 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          분석할 포스트 선택
        </label>
        <select
          value={selectedPostId || ''}
          onChange={(e) => setSelectedPostId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {posts.map((post) => (
            <option key={post.id || post.postId} value={post.id || post.postId}>
              {post.title || `포스트 ${post.id || post.postId}`}
            </option>
          ))}
        </select>
      </div>

      {/* 비교 기간 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          비교 기간
        </label>
        <div className="flex gap-2">
          {[
            { value: 'yesterday', label: '어제' },
            { value: 'week', label: '1주 전' },
            { value: 'month', label: '1달 전' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setComparisonPeriod(period.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                comparisonPeriod === period.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {selectedPost && (
        <>
          {/* 선택된 포스트 정보 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">선택된 포스트</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">제목:</span>
                <span className="ml-2 font-medium">{selectedPost.title}</span>
              </div>
              <div>
                <span className="text-gray-600">게시일:</span>
                <span className="ml-2">{new Date(selectedPost.publishAt || selectedPost.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* 포스트 메트릭 */}
          {metricsLoading ? (
            <LoadingSpinner message="포스트 메트릭을 불러오는 중..." />
          ) : metricsError ? (
            <div className="text-center py-8 text-red-500">
              포스트 메트릭을 불러오는데 실패했습니다
            </div>
          ) : (
            <>
              {/* 메트릭 카드들 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* 조회수 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">조회수</p>
                      <p className="text-2xl font-bold text-green-800">
                        {realtimeData?.views?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="text-green-500 text-2xl">👁️</div>
                  </div>
                  {historyData?.views && (
                    <p className="text-xs text-green-600 mt-1">
                      비교: {historyData.views.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* 좋아요 */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">좋아요</p>
                      <p className="text-2xl font-bold text-red-800">
                        {realtimeData?.likes?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="text-red-500 text-2xl">❤️</div>
                  </div>
                  {historyData?.likes && (
                    <p className="text-xs text-red-600 mt-1">
                      비교: {historyData.likes.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* 댓글 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">댓글</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {realtimeData?.comments?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="text-purple-500 text-2xl">💬</div>
                  </div>
                  {historyData?.comments && (
                    <p className="text-xs text-purple-600 mt-1">
                      비교: {historyData.comments.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* 공유 */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">공유</p>
                      <p className="text-2xl font-bold text-orange-800">
                        {realtimeData?.shares?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="text-orange-500 text-2xl">📤</div>
                  </div>
                  {historyData?.shares && (
                    <p className="text-xs text-orange-600 mt-1">
                      비교: {historyData.shares.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* 감정분석 및 댓글 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EmotionAnalysis emotionAnalysis={metricsResults.emotionAnalysis} />
                <CommentsDisplay
                  realtimeComments={metricsResults.realtimeComments}
                  historyComments={metricsResults.historyComments}
                  comparisonPeriod={comparisonPeriod}
                />
              </div>
            </>
          )}
        </>
      )}

      {posts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          분석할 포스트가 없습니다
        </div>
      )}
    </div>
  );
}
