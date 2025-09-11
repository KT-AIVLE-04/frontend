import React, { useEffect, useState } from "react";
import { analyticsApi } from "../../../api/analytics";
import { ApiStateLayout, Card } from "../../../components";
import { useApi } from "../../../hooks";

export function CommentsDisplay({
                                  selectedSnsType,
                                  selectedPostId,
                                }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [userSet, setUserSet] = useState(new Set());
  const commentsPerPage = 5;


  // 실시간 댓글 API 호출
  const {
    loading: realtimeCommentsLoading,
    error: realtimeCommentsError,
    data: realtimeCommentsData,
    setArgs: setCommentsArgs,
  } = useApi(analyticsApi.getRealtimeComments, {
    autoExecute: true,
    autoExecuteArgs: [selectedSnsType, selectedPostId, 0, commentsPerPage], // pageIndex: 0, size: 5
  });

  // 사용자 ID Set 관리 (전체적으로 일관된 번호 유지)
  useEffect(() => {
    if (realtimeCommentsData) {
      setUserSet(prevSet => {
        const newSet = new Set(prevSet);
        realtimeCommentsData.forEach((comment) => {
          if (comment.snsAuthorId) {
            newSet.add(comment.snsAuthorId);
          }
        });
        return newSet;
      });
    }
  }, [realtimeCommentsData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 페이지네이션 계산 (서버 사이드)
  const currentComments = realtimeCommentsData || [];
  const isLastPage = currentComments.length < commentsPerPage;

  // 페이지 변경 시 서버에 새로운 페이지 요청
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const pageIndex = newPage - 1; // 0부터 시작하는 pageIndex
    
    if (setCommentsArgs) {
      setCommentsArgs([selectedSnsType, selectedPostId, pageIndex, commentsPerPage]);
    }
  };

  const isEmpty = !realtimeCommentsData || realtimeCommentsData.length === 0;

  const renderComments = (comments) => {

    return (
      <div className="space-y-3">
        {comments.map((comment, index) => {
          // snsAuthorId가 있으면 Set에서의 인덱스 + 1을 사용자 번호로 사용
          const userNumber = comment.snsAuthorId 
            ? Array.from(userSet).indexOf(comment.snsAuthorId) + 1
            : (currentPage - 1) * commentsPerPage + index + 1;

          return (
            <div
              key={comment.commentId || index}
              className="bg-gray-50 rounded-lg p-3"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">
                  사용자 {userNumber}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(comment.publishedAt)}
                </div>
              </div>

              <div className="text-sm text-gray-700 mb-2">{comment.text}</div>

              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-3">👍 {comment.likeCount || 0}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPagination = () => {
    // 첫 페이지이고 데이터가 없으면 페이지네이션 숨김
    if (currentPage === 1 && currentComments.length === 0) return null;
    
    // 첫 페이지이고 마지막 페이지면 페이지네이션 숨김
    if (currentPage === 1 && isLastPage) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        {/* 빈 데이터이고 1페이지가 아닐 때 처음으로 돌아가기 버튼 */}
        {currentComments.length === 0 && currentPage > 1 && (
          <button
            onClick={() => handlePageChange(1)}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            처음으로 돌아가기
          </button>
        )}
        
        {/* 이전 버튼 - 첫 페이지가 아니고 빈 데이터가 아닐 때만 표시 */}
        {currentPage > 1 && currentComments.length > 0 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            이전
          </button>
        )}

        {/* 다음 버튼 - 마지막 페이지가 아닐 때만 표시 */}
        {!isLastPage && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            다음
          </button>
        )}
      </div>
    );
  };

  return (
    <Card variant="default" className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">댓글 목록 조회</h3>
      </div>
      
      <ApiStateLayout
        loading={realtimeCommentsLoading}
        error={realtimeCommentsError}
        isEmpty={isEmpty}
        loadingComponent={
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">댓글을 불러오는 중...</p>
            </div>
          </div>
        }
        errorComponent={
          <div className="text-center text-red-500 py-8">
            댓글을 불러오는데 실패했습니다
          </div>
        }
        emptyComponent={
          <div className="text-center text-gray-500 py-8">
            <div className="text-gray-400 text-4xl mb-4">💬</div>
            <p>댓글이 없습니다.</p>
            <p className="text-sm mt-2">
              {currentPage > 1 ? "이전 페이지에서 댓글을 확인할 수 있습니다." : "게시물을 선택하면 댓글을 확인할 수 있습니다."}
            </p>
            {/* 댓글이 없고 첫 페이지가 아닐 때만 처음으로 돌아가기 버튼 표시 */}
            {currentPage > 1 && (
              <div className="mt-4">
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  처음으로 돌아가기
                </button>
              </div>
            )}
          </div>
        }
      >

      {currentComments.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              댓글 {(currentPage - 1) * commentsPerPage + 1}-{(currentPage - 1) * commentsPerPage + currentComments.length} 
              {isLastPage ? ` (총 ${(currentPage - 1) * commentsPerPage + currentComments.length}개)` : ''}
            </span>
            <span className="text-xs">실시간 데이터</span>
          </div>
        </div>
      )}

      {renderComments(currentComments)}

      {renderPagination()}

      {/* 댓글 통계 */}
      {currentComments.length > 0 && isLastPage && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3">댓글 통계</h4>
          <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">실시간 댓글:</span>
                  <span className="font-medium text-blue-600">
                    {(currentPage - 1) * commentsPerPage + currentComments.length}개
                  </span>
                </div>
          </div>
        </div>
      )}
      </ApiStateLayout>
    </Card>
  );
}