import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import { Alert, Button, Card } from "../../components";
import { useApi, useForm } from "../../hooks";
import { REGISTER_VALIDATION_SCHEMA } from "../../utils/validations";
import { FieldsContainer } from "./components";

export function Register({ onRegister, onLoginClick }) {
  const navigate = useNavigate();

  // useForm 훅 사용
  const {
    values: formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setAllErrors,
    resetForm,
  } = useForm({
    name: "",
    email: "",
    phoneNumber: "",
    age: "",
    password: "",
  });

  // useApi 훅 사용
  const {
    loading,
    error,
    execute: registerUser,
  } = useApi(authApi.register, {
    onSuccess: (data, message) => {
      console.log("회원가입 성공:", data, message);
      if (onRegister) {
        onRegister();
      }
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
      // 서버 에러를 폼 에러로 변환
      if (error.response?.data?.message) {
        setAllErrors({
          email: error.response.data.message.includes("이메일")
            ? error.response.data.message
            : "",
          password: error.response.data.message.includes("비밀번호")
            ? error.response.data.message
            : "",
          name: error.response.data.message.includes("이름")
            ? error.response.data.message
            : "",
          phone: error.response.data.message.includes("전화번호")
            ? error.response.data.message
            : "",
          age: error.response.data.message.includes("연령대")
            ? error.response.data.message
            : "",
        });
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 클라이언트 사이드 검증
    const isValid = validateForm(REGISTER_VALIDATION_SCHEMA);
    if (!isValid) {
      return;
    }

    try {
      await registerUser(formData);
      // onSuccess에서 자동으로 처리됨
    } catch (error) {
      console.error("회원가입 실패:", error);
      // onError에서 자동으로 처리됨
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

      <Card className="p-8">
        {error && (
          <Alert
            type="error"
            title="회원가입 실패"
            message={
              error.response?.data?.message ||
              "회원가입에 실패했습니다. 입력 정보를 확인해주세요."
            }
          />
        )}
        <form onSubmit={handleSubmit}>
          <FieldsContainer
            formData={formData}
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
            validationSchema={REGISTER_VALIDATION_SCHEMA}
          />
          <Button type="submit" loading={loading} className="w-full">
            {loading ? "회원가입 중..." : "회원가입"}
          </Button>
        </form>
        <div className="mt-6 flex items-center justify-center">
          <div className="text-sm">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={onLoginClick}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              로그인
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
