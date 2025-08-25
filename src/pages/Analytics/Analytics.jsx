import React, { useEffect, useState } from 'react';
import { analyticsApi } from '../../api/analytics';
import { contentApi } from '../../api/content';
import { snsApi } from '../../api/sns';
import { ErrorPage, LoadingSpinner } from '../../components';
import { useMultipleApi } from '../../hooks';
import {
  ApiErrorDisplay,
  CommentsDisplay,
  ComparisonStats,
  ContentPerformanceTable,
  DateRangeSelector,
  EmotionAnalysis,
  PostSelector
} from './components';

export function Analytics() {
  const [dateRange, setDateRange] = useState("last7");
  const [selectedSnsType, setSelectedSnsType] = useState("youtube");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [contents, setContents] = useState([]);
  
  // 비교 기간 설정
  const [comparisonPeriod, setComparisonPeriod] = useState("yesterday"); // yesterday, week, month
  
  const { loading, error, errors, results, executeMultiple } = useMultipleApi();

  // 날짜 계산 헬퍼
  const getDateString = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  // 사용자 데이터 로드 (SNS 포스트, 콘텐츠)
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { results: userResults, errors: userErrors } = await executeMultiple({
          posts: () => snsApi.post.getPosts(),
          contents: () => contentApi.getContents()
        });

        if (!userErrors.posts) {
          setPosts(userResults.posts || []);
        }
        if (!userErrors.contents) {
          setContents(userResults.contents || []);
        }

        // 첫 번째 포스트를 기본 선택
        if (userResults.posts && userResults.posts.length > 0) {
          setSelectedPostId(userResults.posts[0].id || userResults.posts[0].postId);
        }
      } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);
      }
    };

    loadUserData();
  }, []);

  // 분석 데이터 로드
  useEffect(() => {
    if (!selectedSnsType) return;

    const loadAnalyticsData = async () => {
      const yesterday = getDateString(1);
      const weekAgo = getDateString(7);
      const monthAgo = getDateString(30);

      const apiCalls = {
        // 실시간 계정 메트릭
        realtimeAccount: () => analyticsApi.getRealtimeAccountMetrics(selectedSnsType),
        
        // 히스토리 계정 메트릭 (어제)
        historyAccountYesterday: () => analyticsApi.getHistoryAccountMetrics(yesterday, selectedSnsType),
        
        // 히스토리 계정 메트릭 (1주일 전)
        historyAccountWeek: () => analyticsApi.getHistoryAccountMetrics(weekAgo, selectedSnsType),
        
        // 히스토리 계정 메트릭 (1달 전)
        historyAccountMonth: () => analyticsApi.getHistoryAccountMetrics(monthAgo, selectedSnsType),
      };

      // 선택된 게시물이 있는 경우 게시물 메트릭도 로드
      if (selectedPostId) {
        apiCalls.realtimePost = () => analyticsApi.getRealtimePostMetrics(selectedSnsType, selectedPostId);
        apiCalls.historyPostYesterday = () => analyticsApi.getHistoryPostMetrics(yesterday, selectedSnsType, selectedPostId);
        apiCalls.historyPostWeek = () => analyticsApi.getHistoryPostMetrics(weekAgo, selectedSnsType, selectedPostId);
        apiCalls.historyPostMonth = () => analyticsApi.getHistoryPostMetrics(monthAgo, selectedSnsType, selectedPostId);
        
        // 게시물 댓글
        apiCalls.realtimeComments = () => analyticsApi.getRealtimeComments(selectedSnsType, selectedPostId, 0, 5);
        apiCalls.historyComments = () => analyticsApi.getHistoryComments(yesterday, selectedSnsType, selectedPostId, 0, 5);
        
        // 게시물 감정분석
        apiCalls.emotionAnalysis = () => analyticsApi.getHistoryEmotionAnalysis(yesterday, selectedSnsType, selectedPostId);
      }

      // 콘텐츠 성과 데이터
      apiCalls.contentPerformance = () => analyticsApi.getContentPerformance({ dateRange });

      await executeMultiple(apiCalls);
    };

    loadAnalyticsData();
  }, [selectedSnsType, selectedPostId, dateRange]);

  if (loading && Object.keys(results).length === 0) {
    return <LoadingSpinner />;
  }

  // 전체 에러가 있는 경우
  if (error && Object.keys(errors || {}).length > 0) {
    return <ErrorPage title="분석 데이터 로딩 실패" message={error} />;
  }

  return (
    <div className="flex-1 w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">성과 분석</h1>
        <div className="flex gap-4">
          <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
        </div>
      </div>

      {/* 개별 API 에러 표시 */}
      <ApiErrorDisplay errors={errors} />

      {/* SNS 타입 및 게시물 선택 */}
      <div className="mb-6">
        <PostSelector
          selectedSnsType={selectedSnsType}
          setSelectedSnsType={setSelectedSnsType}
          selectedPostId={selectedPostId}
          setSelectedPostId={setSelectedPostId}
          posts={posts}
          contents={contents}
        />
      </div>

      {/* 비교 기간 선택 */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setComparisonPeriod("yesterday")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              comparisonPeriod === "yesterday"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            어제와 비교
          </button>
          <button
            onClick={() => setComparisonPeriod("week")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              comparisonPeriod === "week"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            1주일 전과 비교
          </button>
          <button
            onClick={() => setComparisonPeriod("month")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              comparisonPeriod === "month"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            1달 전과 비교
          </button>
        </div>
      </div>

      {/* 계정 메트릭 비교 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">계정 성과</h2>
        <ComparisonStats
          realtimeData={results.realtimeAccount}
          historyData={results[`historyAccount${comparisonPeriod.charAt(0).toUpperCase() + comparisonPeriod.slice(1)}`]}
          comparisonPeriod={comparisonPeriod}
          type="account"
        />
      </div>

      {/* 게시물 메트릭 (게시물이 선택된 경우) */}
      {selectedPostId && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">게시물 성과</h2>
          <ComparisonStats
            realtimeData={results.realtimePost}
            historyData={results[`historyPost${comparisonPeriod.charAt(0).toUpperCase() + comparisonPeriod.slice(1)}`]}
            comparisonPeriod={comparisonPeriod}
            type="post"
          />
        </div>
      )}

      {/* 감정분석 및 댓글 */}
      {selectedPostId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <EmotionAnalysis emotionAnalysis={results.emotionAnalysis} />
          <CommentsDisplay
            realtimeComments={results.realtimeComments}
            historyComments={results.historyComments}
            comparisonPeriod={comparisonPeriod}
          />
        </div>
      )}

      {/* 콘텐츠 성과 테이블 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">콘텐츠 성과</h2>
        <ContentPerformanceTable contentPerformance={results.contentPerformance} />
      </div>
    </div>
  );
} 