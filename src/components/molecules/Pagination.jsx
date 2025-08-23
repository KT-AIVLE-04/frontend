import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = ""
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // 시작이나 끝에 가까울 때 조정
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const buttonClasses = "px-3 py-2 text-sm font-medium border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed";
  const activeButtonClasses = "px-3 py-2 text-sm font-medium bg-blue-600 text-white border border-blue-600";

  return (
    <nav className={`flex items-center justify-center space-x-1 ${className}`} aria-label="Pagination">
      {/* First Page */}
      {showFirstLast && currentPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`${buttonClasses} rounded-l-md`}
            aria-label="첫 페이지로"
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Previous */}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${buttonClasses} ${!showFirstLast || currentPage === 1 ? 'rounded-l-md' : ''}`}
          aria-label="이전 페이지"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? activeButtonClasses : buttonClasses}
          aria-label={`${page} 페이지로`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${buttonClasses} ${!showFirstLast || currentPage === totalPages ? 'rounded-r-md' : ''}`}
          aria-label="다음 페이지"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Last Page */}
      {showFirstLast && currentPage < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`${buttonClasses} rounded-r-md`}
            aria-label="마지막 페이지로"
          >
            {totalPages}
          </button>
        </>
      )}
    </nav>
  );
};
