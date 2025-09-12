import React, { useEffect, useState } from "react";
import { analyticsApi } from "../../../api/analytics";
import { ApiStateLayout, Card } from "../../../components";
import { useApi } from "../../../hooks";
import { CommentsList } from "./CommentsList";
import { CommentsPagination } from "./CommentsPagination";

export function CommentsDisplay({
                                  selectedSnsType,
                                  selectedPostId,
                                }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [userSet, setUserSet] = useState(new Set());
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [pageCache, setPageCache] = useState(new Map()); // 페이지별 데이터 캐시
  const COMMENTS_PER_PAGE = 5;


  // 실시간 댓글 API 호출
  const {
    loading: realtimeCommentsLoading,
    error: realtimeCommentsError,
    data: realtimeCommentsData,
    setArgs: setCommentsArgs,
  } = useApi(analyticsApi.getRealtimeComments, {
    autoExecute: true,
    autoExecuteArgs: [selectedSnsType, selectedPostId, null, COMMENTS_PER_PAGE], // snsType, postId, pageToken, size
  });

  // 실시간 데이터 처리 함수
  const processRealtimeData = (data) => {
    const { data: comments = [], nextPageToken, hasNextPage } = data;
    
    setNextPageToken(nextPageToken);
    setHasNextPage(hasNextPage);
    
    // 현재 페이지 데이터를 캐시에 저장
    setPageCache(prevCache => {
      const newCache = new Map(prevCache);
      newCache.set(currentPage, {
        data: data,
        comments: comments,
        nextPageToken: nextPageToken,
        hasNextPage: hasNextPage
      });
      return newCache;
    });
    
    // 사용자 ID Set 업데이트
    setUserSet(prevSet => {
      const newSet = new Set(prevSet);
      comments.forEach((comment) => {
        if (comment.snsAuthorId) {
          newSet.add(comment.snsAuthorId);
        }
      });
      return newSet;
    });
  };

  


  // 페이지네이션 계산 (캐시 우선, 서버 데이터 보조)
  const getCurrentComments = () => {
    const cachedData = pageCache.get(currentPage);
    if (cachedData) {
      return cachedData.comments;
    }
    return realtimeCommentsData?.data || [];
  };
  
  

  // 페이지 변경 시 서버에 새로운 페이지 요청
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    if (setCommentsArgs) {
      // pageToken 기반 페이지네이션
      const token = newPage === 1 ? null : nextPageToken;
      setCommentsArgs([selectedSnsType, selectedPostId, token, COMMENTS_PER_PAGE]);
    }
  };

  // 이전 페이지로 이동 (캐시 사용)
  const handlePreviousPage = () => {
    const prevPage = currentPage - 1;
    
    // 캐시에서 데이터 복원
    const cachedData = pageCache.get(prevPage);
    if (cachedData) {
      setNextPageToken(cachedData.nextPageToken);
      setHasNextPage(cachedData.hasNextPage);
      setCurrentPage(prevPage);
    }
  };

  // 처음으로 돌아가기 (초기화)
  const handleGoToFirst = () => {
    setCurrentPage(1);
    setPageCache(new Map()); // 캐시 초기화
    setNextPageToken(null);
    setHasNextPage(false);
    
    if (setCommentsArgs) {
      setCommentsArgs([selectedSnsType, selectedPostId, null, COMMENTS_PER_PAGE]);
    }
  };

  const isEmpty = !realtimeCommentsData || !realtimeCommentsData.data || realtimeCommentsData.data.length === 0;
  const currentComments = getCurrentComments();
  const isLastPage = !hasNextPage;

  // 사용자 ID Set 관리 및 페이지네이션 상태 업데이트
  useEffect(() => {
    if (realtimeCommentsData) {
      processRealtimeData(realtimeCommentsData);
    }
  }, [realtimeCommentsData, currentPage]);

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
                  onClick={handleGoToFirst}
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
              댓글 {currentComments.length}개
              {isLastPage ? ' (마지막 페이지)' : ''}
            </span>
            <span className="text-xs">실시간 데이터</span>
          </div>
        </div>
      )}

      <CommentsList
        comments={currentComments}
        userSet={userSet}
        currentPage={currentPage}
        commentsPerPage={COMMENTS_PER_PAGE}
      />

      <CommentsPagination
        currentPage={currentPage}
        currentComments={currentComments}
        isLastPage={isLastPage}
        hasNextPage={hasNextPage}
        onGoToFirst={handleGoToFirst}
        onPreviousPage={handlePreviousPage}
        onNextPage={() => handlePageChange(currentPage + 1)}
      />

      {/* 댓글 통계 */}
      {currentComments.length > 0 && isLastPage && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3">댓글 통계</h4>
          <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">총 조회된 댓글:</span>
                  <span className="font-medium text-blue-600">
                    {Array.from(pageCache.values()).reduce((total, pageData) => total + pageData.comments.length, 0)}개
                  </span>
                </div>
          </div>
        </div>
      )}
      </ApiStateLayout>
    </Card>
  );
}