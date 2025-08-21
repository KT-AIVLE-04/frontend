import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Button, Container, FormField } from '../../components';
import { ageOptions } from './components';

export function Register({ onRegister, onLoginClick }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.register(formData);
      
      if (onRegister) {
        onRegister();
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다. 입력 정보를 확인해주세요.';
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

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto">
      <div className="flex items-center mt-4">
        <button
          onClick={handleCancel}
          className="mr-2! p-3 text-gray-600 rounded-xl"
        >
          <ArrowLeft size={20} strokeWidth={4} />
        </button>
        <h1 className="text-2xl font-bold">회원가입</h1>
      </div>

      <Container className="p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <FormField
            label="이름"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="이름을 입력하세요"
            required
          />
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
            label="전화번호"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="전화번호를 입력하세요"
            required
          />
          <FormField
            label="연령대"
            name="age"
            type="select"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="연령대를 선택하세요"
            required
            options={ageOptions}
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
            {loading ? '회원가입 중...' : '회원가입'}
          </Button>
        </form>
        <div className="mt-6 flex items-center justify-center">
          <div className="text-sm">
            이미 계정이 있으신가요?{' '}
            <button 
              onClick={onLoginClick} 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              로그인
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
} 