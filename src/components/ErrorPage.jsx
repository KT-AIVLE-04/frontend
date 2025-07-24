import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function ErrorPage({ 
  title = '오류가 발생했습니다', 
  message = '요청하신 작업을 처리하는 중에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  showRetry = true,
  showHome = true 
}) {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && (
            <button
              onClick={handleRetry}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              다시 시도
            </button>
          )}
          
          {showHome && (
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Home size={16} className="mr-2" />
              홈으로 이동
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 