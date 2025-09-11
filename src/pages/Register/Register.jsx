import { ArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import { Alert, Button, Card } from "../../components";
import { useApi, useForm, useNotification } from "../../hooks";
import { ROUTES } from "../../routes/routes.js";
import { formatPhoneNumber, REGISTER_VALIDATION_SCHEMA } from "../../utils";
import { FieldsContainer } from "./components";

export function Register({onRegister}) {
  const navigate = useNavigate();
  const {success} = useNotification();

  // useForm 훅 사용 (포맷터 추가)
  const formatters = {
    phoneNumber: formatPhoneNumber,
  };

  // useForm 훅 사용
  const {
    values: formData,
    errors,
    handleChange,
    validateForm,
    setAllErrors,
    setFieldError,
  } = useForm(
    {
      name: "",
      email: "",
      phoneNumber: "",
      // age: "",
      password: "",
    },
    formatters,
    REGISTER_VALIDATION_SCHEMA
  );

  // useApi 훅 사용
  const {
    loading,
    error,
    execute: registerUser,
  } = useApi(authApi.register, {
    onSuccess: (data, message) => {
      success(
        "회원가입이 성공적으로 완료되었습니다. 지금 로그인하여 서비스를 시작하세요!"
      );
      console.log("회원가입 성공:", data, message);
      if (onRegister) {
        onRegister();
      }
      navigate(ROUTES.LOGIN.route);
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
          phoneNumber: error.response.data.message.includes("전화번호")
            ? error.response.data.message
            : "",
          // age: error.response.data.message.includes("연령대")
          //   ? error.response.data.message
          //   : "",
        });
      }
    },
  });

  useEffect(() => {
    console.log("폼 데이터 변경:", formData);
    console.log("폼 에러 상태:", errors);
  }, [formData, errors]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // validateForm으로 검증
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      await registerUser(formData);
      // 성공 시에만 로그인 페이지로 이동 (onSuccess에서 처리)
    } catch (error) {
      console.error("회원가입 실패:", error);
      // 실패 시에는 현재 페이지에 머물면서 에러 표시 (onError에서 처리)
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // 로그인 페이지로 이동
  const handleLoginClick = () => {
    navigate(ROUTES.LOGIN.route);
  };

  // 현재 에러가 있는 필드 개수 계산
  const errorCount = Object.keys(errors).filter(
    (fieldName) => errors[fieldName] && errors[fieldName].trim() !== ""
  ).length;

  return (
    <div className="flex-1 max-w-2xl mx-auto">
      <div className="flex items-center mt-4">
        <button
          onClick={handleCancel}
          className="mr-2! p-3 text-gray-600 rounded-xl"
        >
          <ArrowLeft size={20} strokeWidth={4}/>
        </button>
        <h1 className="text-2xl font-bold">회원가입</h1>
      </div>

      <Card className="p-8">
        {/* 전체 에러 상태 표시 */}
        {errorCount > 0 && (
          <Alert
            type="error"
            title="입력 정보를 확인해주세요"
            message={`${errorCount}개의 필드에 오류가 있습니다. 아래 빨간색으로 표시된 필드를 수정해주세요.`}
            className="mb-6"
          />
        )}

        {/* 서버 에러 표시 (필드 에러가 없을 때만) */}
        {error && errorCount === 0 && (
          <Alert
            type="error"
            title="회원가입 실패"
            message={
              error.response?.data?.message ||
              "회원가입에 실패했습니다. 입력 정보를 확인해주세요."
            }
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FieldsContainer
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            disabled={errorCount > 0}
          >
            {loading ? "회원가입 중..." : "회원가입"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <div className="text-sm">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={handleLoginClick}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              로그인
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
