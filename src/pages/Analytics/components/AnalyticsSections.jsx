import React, { useEffect, useState } from "react";
import { snsApi } from "../../../api/sns";
import { useApi } from "../../../hooks";
import {
    AccountAnalytics,
    ContentPerformanceSection,
    PostAnalytics,
} from "./index";

export function AnalyticsSections({ selectedSnsType }) {
  // 선택된 포스트 ID 상태 관리
  const [selectedPostId, setSelectedPostId] = useState(null);

  // 포스트 목록 가져오기
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    execute: executePosts,
  } = useApi(snsApi.post.getPosts);

  // 데이터 로드
  useEffect(() => {
    if (!selectedSnsType) return;
    executePosts();
  }, [selectedSnsType]);

  // 포스트 선택 핸들러
  const handlePostSelect = (postId) => {
    setSelectedPostId(postId);
  };

  return (
    <div className="space-y-6">
      {/* 1. 계정 분석 섹션 */}
      <AccountAnalytics selectedSnsType={selectedSnsType} />

      {/* 2. 콘텐츠 성과 분석 섹션 */}
      <ContentPerformanceSection 
        selectedSnsType={selectedSnsType}
        postsData={postsData}
        postsLoading={postsLoading}
        postsError={postsError}
        onPostSelect={handlePostSelect}
      />

      {/* 3. 포스트 분석 섹션 */}
      <PostAnalytics 
        selectedSnsType={selectedSnsType}
        selectedPostId={selectedPostId}
      />
    </div>
  );
}
