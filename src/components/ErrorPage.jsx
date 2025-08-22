import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routes';
import { Container } from './Container';

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
    navigate(ROUTES.DASHBOARD.route);
  };

  return (
    <div className="flex items-center justify-center mx-auto">
      <Container className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 border-2 border-red-300">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600 font-bold">{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && (
            <button
              onClick={handleRetry}
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-xl border-2 border-blue-700 hover:bg-blue-600 transition-all duration-150 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] transform hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <RefreshCw size={16} className="mr-2" />
              다시 시도
            </button>
          )}
          
          {showHome && (
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center px-4 py-2 border-2 border-gray-400 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-150 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] transform hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <Home size={16} className="mr-2" />
              홈으로 이동
            </button>
          )}
        </div>
      </Container>
    </div>
  );
} 