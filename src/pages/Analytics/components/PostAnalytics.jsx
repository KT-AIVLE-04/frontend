import React, { useState } from "react";
import { Card } from "../../../components";
import { CommentsDisplay, EmotionAnalysis, PostMetrics } from "./";

export function PostAnalytics({selectedSnsType, selectedPostId}) {
  const [dateRange, setDateRange] = useState("last7");

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
              {value: "today", label: "오늘"},
              {value: "yesterday", label: "어제"},
              {value: "last7", label: "7일"},
              {value: "last30", label: "30일"},
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
        <PostMetrics
          dateRange={dateRange}
          selectedSnsType={selectedSnsType}
          selectedPostId={selectedPostId}
        />

        {/* 감정분석 및 댓글 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmotionAnalysis
            selectedSnsType={selectedSnsType}
            selectedPostId={selectedPostId}
            dateRange={dateRange}
          />
          <CommentsDisplay
            selectedSnsType={selectedSnsType}
            selectedPostId={selectedPostId}
          />
        </div>
      </>
    </Card>
  );
}
