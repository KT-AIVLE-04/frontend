import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Button, FormField } from '../../components';
import { ROUTES } from '../../routes/routes';
import { login } from '../../store/authSlice';
import { GoogleIcon, KakaoIcon } from './components';

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