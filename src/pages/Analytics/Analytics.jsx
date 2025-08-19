import React from 'react';
import { ErrorPage, LoadingSpinner } from '../../components';
import { DateRangeSelector } from './components';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { AnalyticsOverview } from './components/AnalyticsOverview';
import { ContentPerformanceTable } from './components/ContentPerformanceTable';
import { useAnalyticsData } from './hooks/useAnalyticsData';

export function Analytics() {
  const {
    dateRange,
    setDateRange,
    overviewStats,
    contentPerformance,
    commentSentiment,
    followerTrend,
    optimalPostingTime,
    loading,
    error
  } = useAnalyticsData();

  if (error) {
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

      <AnalyticsOverview stats={overviewStats} />
      
      <AnalyticsCharts 
        commentSentiment={commentSentiment}
        followerTrend={followerTrend}
        optimalPostingTime={optimalPostingTime}
      />

      <ContentPerformanceTable contentPerformance={contentPerformance} />
    </div>
  );
} 