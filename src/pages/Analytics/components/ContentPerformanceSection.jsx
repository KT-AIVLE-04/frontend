import React, { useEffect } from "react";
import { snsApi } from "../../../api/sns";
import { LoadingSpinner } from "../../../components";
import { useApi } from "../../../hooks";
import { PostTableRow } from "./";
import { Card } from "../../../components/molecules/Card";

export function ContentPerformanceSection({ selectedSnsType }) {
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
  // 포스트 목록에서 선택된 SNS 타입의 포스트만 필터링
  const filteredPosts =
    postsData?.filter((post) => post.snsType === selectedSnsType) || [];

  return (
    <Card variant="default" className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        최근 게시물 실시간 현황
      </h2>

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
