import { AlertCircle, Home, LogOut, RefreshCw } from 'lucide-react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { ROUTES } from '../routes/routes';
import { logout } from '../store/authSlice';
import { Button, Container } from './';

export function ErrorPage({ 
  title = '오류가 발생했습니다', 
  message = '요청하신 작업을 처리하는 중에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  showRetry = true,
  showHome = true,
  showLogout = false
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate(ROUTES.DASHBOARD.route);
  };

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출 (실패해도 상관없음)
      await authApi.logout();
    } catch (error) {
      console.log('Logout API failed, but continuing with local logout');
    } finally {
      // Redux store에서 로그아웃 처리
      dispatch(logout());
      // 로그인 페이지로 이동
      navigate(ROUTES.LOGIN.route);
    }
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
            <Button
              onClick={handleRetry}
              variant="primary"
              icon={RefreshCw}
            >
              다시 시도
            </Button>
          )}
          
          {showHome && (
            <Button
              onClick={handleGoHome}
              variant="outline"
              icon={Home}
            >
              홈으로 이동
            </Button>
          )}

          {showLogout && (
            <Button
              onClick={handleLogout}
              variant="danger"
              icon={LogOut}
            >
              로그아웃
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
} 