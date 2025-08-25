import React from 'react';
import { Spinner } from '../atoms';

export function LoadingSpinner({ 
  size = "large",
  message = "로딩 중...",
  className = ""
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Spinner size={size} color="blue" className="mb-4" />
      {message && (
        <p className="text-gray-500 font-bold">{message}</p>
      )}
    </div>
  );
}
