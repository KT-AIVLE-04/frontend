import React from 'react';
import { Container } from './Container';

export function LoadingSpinner({ 
  message = "로딩 중...", 
  size = "medium",
  className = "" 
}) {
  const sizeClasses = {
    small: "h-4 w-8",
    medium: "h-8 w-8", 
    large: "h-12 w-12"
  };

  return (
    <div className={`flex items-center justify-center h-64 ${className} mx-auto`}>
      <Container className="p-8 text-center">
        <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${sizeClasses[size]} mx-auto mb-4`}></div>
        <div className="text-gray-700 font-bold">{message}</div>
      </Container>
    </div>
  );
} 