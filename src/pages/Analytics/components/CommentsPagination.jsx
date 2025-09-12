import React from "react";

export function CommentsPagination({
  currentPage,
  currentComments,
  isLastPage,
  hasNextPage,
  onGoToFirst,
  onPreviousPage,
  onNextPage,
}) {
  // 첫 페이지이고 데이터가 없으면 페이지네이션 숨김
  if (currentPage === 1 && currentComments.length === 0) return null;
  
  // 첫 페이지이고 마지막 페이지면 페이지네이션 숨김
  if (currentPage === 1 && isLastPage) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {/* 빈 데이터이고 1페이지가 아닐 때 처음으로 돌아가기 버튼 */}
      {currentComments.length === 0 && currentPage > 1 && (
        <button
          onClick={onGoToFirst}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
        >
          처음으로 돌아가기
        </button>
      )}
      
      {/* 이전 버튼 - 첫 페이지가 아니고 빈 데이터가 아닐 때만 표시 */}
      {currentPage > 1 && currentComments.length > 0 && (
        <button
          onClick={onPreviousPage}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
        >
          이전
        </button>
      )}

      {/* 다음 버튼 - 마지막 페이지가 아닐 때만 표시 */}
      {hasNextPage && (
        <button
          onClick={onNextPage}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
        >
          다음
        </button>
      )}
    </div>
  );
}
