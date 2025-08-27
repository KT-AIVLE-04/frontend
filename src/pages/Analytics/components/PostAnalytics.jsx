import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { analyticsApi } from "../../../api/analytics";
import { LoadingSpinner } from "../../../components";
import { Card } from "../../../components/molecules/Card";
import { useMultipleApi } from "../../../hooks";
import { getDateFromRange } from "../../../utils";
import { CommentsDisplay, EmotionAnalysis } from "./";

export function PostAnalytics({ selectedSnsType, selectedPostId }) {
  const [dateRange, setDateRange] = useState("last7");

  // 실시간 메트릭들
  const {
    loading: realtimeLoading,
    error: realtimeError,
    results: realtimeResults,
    executeMultiple: executeRealtime,
  } = useMultipleApi({});

  // 히스토리 메트릭들
  const {
    loading: historyLoading,
    error: historyError,
    results: historyResults,
    executeMultiple: executeHistory,
  } = useMultipleApi({});

  // 실시간 메트릭 로드
  useEffect(() => {
    if (!selectedSnsType || !selectedPostId) return;

    const apiCalls = {
      // 선택된 포스트의 실시간 메트릭
      realtimePost: () => analyticsApi.getRealtimePostMetrics(selectedSnsType, selectedPostId),
      // 선택된 포스트의 실시간 댓글
      realtimeComments: () =>
        analyticsApi.getRealtimeComments(selectedSnsType, selectedPostId, 0, 5),
    };

    executeRealtime(apiCalls);
  }, [selectedSnsType, selectedPostId]);

  // 히스토리 메트릭 로드 (dateRange 변경시)
  useEffect(() => {
    if (!selectedSnsType || !selectedPostId) return;

    // dateRange에 따른 날짜 계산
    const targetDate = getDateFromRange(dateRange);

    const apiCalls = {
      // 선택된 포스트의 히스토리 메트릭
      historyPost: () =>
        analyticsApi.getHistoryPostMetrics(targetDate, selectedSnsType, selectedPostId),
      // 선택된 포스트의 히스토리 댓글
      historyComments: () =>
        analyticsApi.getHistoryComments(
          targetDate,
          selectedSnsType,
          selectedPostId,
          0,
          5
        ),
      // 선택된 포스트의 감정분석
      emotionAnalysis: () =>
        analyticsApi.getHistoryEmotionAnalysis(targetDate, selectedSnsType, selectedPostId),
    };

    executeHistory(apiCalls);
  }, [selectedSnsType, selectedPostId, dateRange]);

  if (!selectedSnsType) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          포스트 분석
        </h2>
        <div className="text-center py-8 text-gray-500">
          SNS 계정을 연결해주세요
        </div>
      </div>
    );
  }

  if (!selectedPostId) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          포스트 분석
        </h2>
        <div className="text-center py-8 text-gray-500">
          분석할 포스트를 선택해주세요
        </div>
      </div>
    );
  }

  const realtimeData = realtimeResults.realtimePost?.result;
  const historyData = historyResults.historyPost?.result;

  return (
    <Card variant="default" className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          선택된 포스트 분석
        </h2>

        {/* 날짜 범위 선택 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">비교 기간:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { value: "today", label: "오늘" },
              { value: "yesterday", label: "어제" },
              { value: "last7", label: "7일" },
              { value: "last30", label: "30일" },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setDateRange(period.value)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  dateRange === period.value
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 최근 게시물 분석 */}
      <>
        {/* 포스트 메트릭 */}
        {realtimeLoading || historyLoading ? (
          <LoadingSpinner message="포스트 메트릭을 불러오는 중..." />
        ) : realtimeError || historyError ? (
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
                      {realtimeData?.views?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="text-green-500">
                    <Eye size={24} />
                  </div>
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
                      {realtimeData?.likes?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="text-red-500">
                    <Heart size={24} />
                  </div>
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
                      {realtimeData?.comments?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="text-purple-500">
                    <MessageCircle size={24} />
                  </div>
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
                      {realtimeData?.shares?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="text-orange-500">
                    <Share2 size={24} />
                  </div>
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
              <EmotionAnalysis
                emotionAnalysis={historyResults.emotionAnalysis?.result}
              />
              <CommentsDisplay
                realtimeComments={realtimeResults.realtimeComments?.result}
                historyComments={historyResults.historyComments?.result}
                comparisonPeriod={dateRange}
              />
            </div>
          </>
        )}
      </>
    </Card>
  );
}
