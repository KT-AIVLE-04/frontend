import React from 'react';
import {useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {authApi} from '../../api/auth';
import {Alert, Button, FormField} from '../../components';
import {useApi, useForm} from '../../hooks';
import {ROUTES} from '../../routes/routes.js';
import {login} from '../../store/authSlice';
import {LOGIN_VALIDATION_SCHEMA} from '../../utils/index.js';
import {BackgroundElements, GoogleIcon, KakaoIcon} from './components';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 소셜 로그인 상태
  const [socialLoading, setSocialLoading] = React.useState(false);
  const [socialError, setSocialError] = React.useState('');

  // useForm 훅 사용
  const {
    values: formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setAllErrors
  } = useForm({
    email: '',
    password: ''
  });

  // useApi 훅 사용
  const {loading, error, execute: loginUser} = useApi(
    authApi.login,
    {
      onSuccess: (data, message) => {
        console.log('로그인 성공:', data, message);
        const {accessToken, refreshToken} = data;
        dispatch(login({accessToken, refreshToken}));
        navigate(ROUTES.STORE_SELECTION.route);
      },
      onError: (error) => {
        console.error('로그인 실패:', error);
        // 서버 에러를 폼 에러로 변환
        if (error.response?.data?.message) {
          setAllErrors({
            email: error.response.data.message.includes('이메일') ? error.response.data.message : '',
            password: error.response.data.message.includes('비밀번호') ? error.response.data.message : ''
          });
        }
      }
    }
  );


  const handleSubmit = async (e) => {
    e.preventDefault();

    // 클라이언트 사이드 검증
    const isValid = validateForm(LOGIN_VALIDATION_SCHEMA);
    if (!isValid) {
      return;
    }

    try {
      await loginUser(formData);
      // onSuccess에서 자동으로 처리됨
    } catch (error) {
      console.error('로그인 실패:', error);
      // onError에서 자동으로 처리됨
    }
  };


  const onRegisterClick = () => {
    navigate(ROUTES.REGISTER.route);
  }


  const handleGoogleLogin = async () => {
    setSocialLoading(true);
    setSocialError('');

    try {
      window.location.href = API_BASE_URL + '/auth/google/login';
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      const errorMessage = error.response?.data?.message || '구글 로그인에 실패했습니다.';
      setSocialError(errorMessage);
      setSocialLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setSocialLoading(true);
    setSocialError('');

    try {
      window.location.href = API_BASE_URL + '/auth/kakao/login';
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      const errorMessage = error.response?.data?.message || '카카오 로그인에 실패했습니다.';
      setSocialError(errorMessage);
      setSocialLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br h-screen from-pink-300 via-purple-300 to-indigo-400 relative overflow-hidden">
      <BackgroundElements/>

      <div className="z-10 flex items-center justify-center min-h-[500px] p-4">
        <div
          className="bg-white z-10 rounded-[1.5rem] border-2 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] p-8 w-full max-w-md">
          <div>
            <div className="text-center mb-8">
              <div className="mb-6">
                <h1 className="text-4xl font-black text-gray-800 mb-3 tracking-tight drop-shadow-lg">
                  다 맡케팅
                </h1>
                <p className="text-gray-700 font-bold text-lg">마케팅을 다 맡겨드려요 🚀</p>
              </div>
            </div>

            {(error || socialError) && (
              <Alert
                type="error"
                title="로그인 실패"
                message={error?.response?.data?.message || socialError || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="이메일"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                placeholder="이메일 주소를 입력하세요"
                required
              />
              <FormField
                label="비밀번호"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
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
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-black py-3 px-6 rounded-2xl transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] flex items-center justify-center space-x-3 h-12 transform hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleGoogleLogin}
                  disabled={socialLoading}
                >
                  <div className="flex items-center space-x-3">
                    <GoogleIcon size={20}/>
                    <span>{socialLoading ? '구글 로그인 중...' : '구글로 로그인'}</span>
                  </div>
                </button>

                {/* Kakao 버튼 */}
                <button
                  type="button"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3 px-6 rounded-2xl border-2 border-yellow-600 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] flex items-center justify-center space-x-3 h-12 transform hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleKakaoLogin}
                  disabled={socialLoading}
                >
                  <KakaoIcon size={20} className="text-black"/>
                  <span>{socialLoading ? '카카오 로그인 중...' : '카카오로 로그인'}</span>
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