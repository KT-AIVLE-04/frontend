import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "../../../components";
import { Card } from "../../../components/molecules/Card";
import { PostTableRow } from "./";

export function ContentPerformanceSection({ 
  selectedSnsType, 
  postsData, 
  postsLoading, 
  postsError,
  onPostSelect
}) {
  // 선택된 포스트 ID 상태 관리
  const [selectedPostId, setSelectedPostId] = useState(null);

  // 포스트 목록에서 선택된 SNS 타입의 포스트만 필터링
  const filteredPosts =
    postsData?.filter((post) => post.snsType === selectedSnsType) || [];

  // 첫 번째 포스트를 기본 선택으로 설정
  useEffect(() => {
    if (filteredPosts.length > 0 && !selectedPostId) {
      const firstPostId = filteredPosts[0].id;
      setSelectedPostId(firstPostId);
      onPostSelect(firstPostId);
    }
  }, [filteredPosts, selectedPostId, onPostSelect]);

  // 포스트 선택 핸들러
  const handlePostSelect = (postId) => {
    setSelectedPostId(postId);
    onPostSelect(postId);
  };

  if (!selectedSnsType) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          콘텐츠 성과 분석
        </h2>
        <div className="text-center py-8 text-gray-500">
          SNS 계정을 연결해주세요
        </div>
      </div>
    );
  }

  if (postsLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          콘텐츠 성과 분석
        </h2>
        <LoadingSpinner message="콘텐츠 성과 데이터를 불러오는 중..." />
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          콘텐츠 성과 분석
        </h2>
        <div className="text-center py-8 text-red-500">
          콘텐츠 성과 데이터를 불러오는데 실패했습니다
        </div>
      </div>
    );
  }

  return (
    <Card variant="default" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 m-0!">
          게시물 실시간 현황
        </h2>
        <p className="text-sm text-gray-500">
          표에서 게시물을 선택 시 분석데이터를 확인하실 수 있습니다
        </p>
      </div>
      
      {/* 최근 5개 게시물 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                게시물
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">
                조회수
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">
                좋아요
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">
                댓글
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">
                공유
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">
                분석보고서
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.slice(0, 5).map((post, index) => (
              <PostTableRow
                key={post.id}
                post={post}
                index={index}
                selectedSnsType={selectedSnsType}
                isSelected={selectedPostId === post.id}
                onSelect={handlePostSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 데이터가 없는 경우 */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          분석할 게시물이 없습니다
        </div>
      )}
    </Card>
  );
}
