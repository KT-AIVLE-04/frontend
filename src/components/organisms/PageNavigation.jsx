import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { Button } from '../atoms';

export function PageNavigation({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ""
}) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 mx-1 rounded-lg font-bold transition-colors ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="small"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        icon={ChevronLeft}
      >
        이전
      </Button>
      
      {renderPageNumbers()}
      
      <Button
        variant="outline"
        size="small"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        icon={ChevronRight}
      >
        다음
      </Button>
    </div>
  );
}
