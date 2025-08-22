import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {authApi} from '../../api/auth';
import {Button, FormField} from '../../components';
import {ROUTES} from '../../routes/routes';
import {login} from '../../store/authSlice';
import {GoogleIcon, KakaoIcon, NaverIcon} from './components';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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
      const {data} = await authApi.login(formData);
      if (!data || !data.result) throw new Error('로그인 정보가 올바르지 않습니다.');
      const {accessToken, refreshToken} = data.result;
      dispatch(login({accessToken, refreshToken}));
      navigate(ROUTES.STORE_SELECTION.route);
    } catch (error) {
      console.error('로그인 실패:', error);
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      setError('');
    }
  };

  const onRegisterClick = () => {
    navigate(ROUTES.REGISTER.route);
  }


  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      window.location.href = API_BASE_URL + '/auth/google/login';
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
      window.location.href = API_BASE_URL + '/auth/kakao/login';
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      const errorMessage = error.response?.data?.message || '카카오 로그인에 실패했습니다.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleNaverLogin = async () => {
    // setLoading(true);
    // setError('');

    // try {
    //   window.location.href = API_BASE_URL+'/auth/naver/login';
    // } catch (error) {
    //   console.error('네이버 로그인 실패:', error);
    //   const errorMessage = error.response?.data?.message || '네이버 로그인에 실패했습니다.';
    //   setError(errorMessage);
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 relative overflow-hidden">
      {/* 만화적 배경 요소들 */}
      <div
        className="absolute top-10 left-8 w-24 h-24 bg-yellow-400 rounded-full border-4 border-yellow-600 shadow-lg"></div>
      <div
        className="absolute bottom-16 right-12 w-20 h-20 bg-green-400 rounded-full border-4 border-green-600 shadow-lg"></div>
      <div
        className="absolute top-1/3 right-1/4 w-16 h-16 bg-red-400 rounded-full border-4 border-red-600 shadow-lg"></div>
      <div
        className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-blue-400 rounded-full border-4 border-blue-600 shadow-lg"></div>

      {/* 만화적 별들 */}
      <div
        className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-300 transform rotate-45 border-2 border-yellow-500 shadow-lg"></div>

      {/* 만화적 구름 모양 */}
      <div
        className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full border-4 border-gray-300 shadow-lg"></div>
      <div
        className="absolute bottom-32 left-16 w-28 h-14 bg-white rounded-full border-4 border-gray-300 shadow-lg"></div>
      <div
        className="absolute top-1/4 left-1/4 w-24 h-12 bg-white rounded-full border-4 border-gray-300 shadow-lg"></div>

      {/* 만화적 하트들 */}
      <div
        className="absolute top-40 left-1/4 w-8 h-8 bg-pink-400 transform rotate-45 border-2 border-pink-600 shadow-lg"></div>
      <div
        className="absolute bottom-40 right-1/4 w-6 h-6 bg-pink-400 transform rotate-45 border-2 border-pink-600 shadow-lg"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div
          className="bg-white rounded-[1.5rem] border-2 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-8 w-full max-w-md relative">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="mb-6">
                <h1 className="text-4xl font-black text-gray-800 mb-3 tracking-tight drop-shadow-lg">
                  다 맡케팅
                </h1>
                <p className="text-gray-700 font-bold text-lg">마케팅을 다 맡겨드려요 🚀</p>
              </div>
            </div>

            {error && (
              <div
                className="mb-6 p-4 bg-red-100 border-2 border-red-400 text-red-800 rounded-2xl text-center font-bold shadow-lg">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full text-lg py-4 bg-blue-500 hover:bg-blue-600 border-2 border-blue-700 text-white font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] transform hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <div className="text-gray-700 font-bold">
                계정이 없으신가요?{' '}
                <button
                  onClick={onRegisterClick}
                  className="font-black text-blue-600 hover:text-blue-700 transition-colors underline decoration-2 underline-offset-2"
                >
                  회원가입
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-400"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-600 font-bold">또는</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {/* Google 버튼 */}
                <button
                  type="button"
                  className="w-full bg-white border-2 border-gray-400 text-gray-700 hover:bg-gray-100 font-black py-3 px-6 rounded-2xl transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] flex items-center justify-center space-x-3 h-12 transform hover:translate-x-0.5 hover:translate-y-0.5"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <GoogleIcon size={20} className="text-gray-600"/>
                  <span>{loading ? '구글 로그인 중...' : 'Google로 로그인'}</span>
                </button>

                {/* Kakao 버튼 */}
                <button
                  type="button"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3 px-6 rounded-2xl border-2 border-yellow-600 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] flex items-center justify-center space-x-3 h-12 transform hover:translate-x-0.5 hover:translate-y-0.5"
                  onClick={handleKakaoLogin}
                  disabled={loading}
                >
                  <KakaoIcon size={20} className="text-black"/>
                  <span>{loading ? '카카오 로그인 중...' : '카카오로 로그인'}</span>
                </button>

                {/* Naver 버튼 */}
                <button
                  type="button"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3 px-6 rounded-2xl border-2 border-green-700 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] flex items-center justify-center space-x-3 h-12 transform hover:translate-x-0.5 hover:translate-y-0.5"
                  onClick={handleNaverLogin}
                  disabled={loading}
                >
                  <NaverIcon size={20} className="text-white"/>
                  <span>{loading ? '네이버 로그인 중...' : '네이버로 로그인'}</span>
                </button>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-gray-600">
              <Link to="/AIVLE.html" target="_blank" rel="noopener noreferrer"
                    className="underline hover:text-gray-900">
                이용약관
              </Link>
              <span className="mx-2">|</span>
              <Link to="/Open_Source.html" target="_blank" rel="noopener noreferrer"
                    className="underline hover:text-gray-900">
                오픈소스 라이선스
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 