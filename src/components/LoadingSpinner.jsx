import React from 'react';

export function LoadingSpinner({ 
  message = "로딩 중...", 
  size = "medium",
  className = "" 
}) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8", 
    large: "h-12 w-12"
  };

  return (
    <div className={`flex items-center justify-center h-64 ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} mx-auto mb-4`}></div>
        <div className="text-gray-500">{message}</div>
      </div>
    </div>
  );
} 