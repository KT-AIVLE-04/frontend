import React from "react";
import { analyticsApi } from "../../../api/analytics";
import { ApiStateLayout } from "../../../components";
import { useApi } from "../../../hooks";
import { getDateFromRange } from "../../../utils";
import { MetricCard } from "./";


export function PostMetrics({dateRange, selectedSnsType, selectedPostId}) {

   // 실시간 포스트 메트릭
   const {
    loading: realtimePostLoading,
    error: realtimePostError,
    data: realtimePostData,
  } = useApi(analyticsApi.getRealtimePostMetrics, {
    autoExecute: true,
    autoExecuteArgs: [selectedSnsType, selectedPostId],
  });

  // 히스토리 포스트 메트릭
  const {
    loading: historyPostLoading,
    error: historyPostError,
    data: historyPostData,
  } = useApi(analyticsApi.getHistoryPostMetrics, {
    autoExecute: true,
    autoExecuteArgs: [getDateFromRange(dateRange), selectedSnsType, selectedPostId],
  });

  
  return (
    <ApiStateLayout
      loading={realtimePostLoading || historyPostLoading}
      error={realtimePostError || historyPostError}
      loadingComponent={
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">포스트 메트릭을 불러오는 중...</p>
          </div>
        </div>
      }
      errorComponent={
        <div className="text-center py-8 text-red-500">
          포스트 메트릭을 불러오는데 실패했습니다
        </div>
      }
    >
      {/* 메트릭 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="조회수"
          value={realtimePostData?.views}
          comparisonValue={historyPostData?.views}
        />
        <MetricCard
          title="좋아요"
          value={realtimePostData?.likes}
          comparisonValue={historyPostData?.likes}
        />
        <MetricCard
          title="댓글"
          value={realtimePostData?.comments}
          comparisonValue={historyPostData?.comments}
        />
        <MetricCard
          title="공유"
          value={realtimePostData?.shares}
          comparisonValue={historyPostData?.shares}
        />
      </div>
    </ApiStateLayout>
  );
}
