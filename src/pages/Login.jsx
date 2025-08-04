import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Button, FormField } from '../components';
import { ROUTES } from '../routes/routes';
import { login } from '../store/authSlice';

// 구글 아이콘 컴포넌트
const GoogleIcon = ({ size = 16, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// 카카오 아이콘 컴포넌트
const KakaoIcon = ({ size = 16, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-5.183-3.668-5.183-6.866C1.5 6.665 6.201 3 12 3z"/>
  </svg>
);

export function Login() {
  const [formData, setFormData] = useState({  
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authApi.login(formData);
      const { accessToken, refreshToken } = result;
      dispatch(login({ accessToken, refreshToken }));
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 초기화
    if (error) {
      setError('');
    }
  };

  const onRegisterClick = () => {
    navigate(ROUTES.REGISTER);
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      window.location.href = 'http://localhost:8080/api/auth/oauth2/authorization/google';
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      const errorMessage = error.response?.data?.message || '구글 로그인에 실패했습니다.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      window.location.href = 'http://localhost:8080/api/auth/oauth2/authorization/kakao';
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      const errorMessage = error.response?.data?.message || '카카오 로그인에 실패했습니다.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormField
          label="이메일"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="이메일 주소를 입력하세요"
          required
        />
        <FormField
          label="비밀번호"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="비밀번호를 입력하세요"
          required
        />
        <Button 
          type="submit" 
          loading={loading}
          className="w-full"
        >
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </form>
      <div className="mt-6 flex items-center justify-center">
        <div className="text-sm">
          계정이 없으신가요?{' '}
          <button 
            onClick={onRegisterClick} 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            회원가입
          </button>
        </div>
      </div>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button 
            type="button" 
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
            icon={GoogleIcon}
          >
            {loading ? '구글 로그인 중...' : '구글'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400 hover:border-yellow-500"
            onClick={handleKakaoLogin}
            disabled={loading}
            icon={KakaoIcon}
          >
            {loading ? '카카오 로그인 중...' : '카카오'}
          </Button>
        </div>
      </div>
    </div>
  );
} 