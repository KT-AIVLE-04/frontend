import React from 'react';
import { ErrorPage, LoadingSpinner } from '../../components';
import {
  AnalyticsCharts,
  AnalyticsOverview,
  ApiErrorDisplay,
  ContentPerformanceTable,
  DateRangeSelector,
  EmotionAnalysis
} from './components';
import { useAnalyticsData } from './hooks/useAnalyticsData';

export function Analytics() {
  const {
    dateRange,
    setDateRange,
    overviewStats,
    contentPerformance,
    commentSentiment,
    emotionAnalysis,
    followerTrend,
    optimalPostingTime,
    loading,
    error,
    errors
  } = useAnalyticsData();

  // 전체 에러가 있는 경우 (모든 API가 실패한 경우)
  if (error && Object.keys(errors || {}).length > 0) {
    return <ErrorPage title="분석 데이터 로딩 실패" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">성과 분석</h1>
        <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      {/* 개별 API 에러 표시 */}
      <ApiErrorDisplay errors={errors} />

      <AnalyticsOverview stats={overviewStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <EmotionAnalysis emotionAnalysis={emotionAnalysis} />
        <AnalyticsCharts 
          commentSentiment={commentSentiment}
          followerTrend={followerTrend}
          optimalPostingTime={optimalPostingTime}
        />
      </div>

      <ContentPerformanceTable contentPerformance={contentPerformance} />
    </div>
  );
} 