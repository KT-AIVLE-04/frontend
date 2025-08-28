import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import { Alert, Button, Card } from "../../components";
import { useApi, useForm, useNotification } from "../../hooks";
import { REGISTER_VALIDATION_SCHEMA } from "../../utils/validations";
import { FieldsContainer } from "./components";
import { formatPhoneNumber } from "../../utils/formatters";
import { ROUTES } from "../../routes/routes";

export function Register({ onRegister }) {
  const navigate = useNavigate();
  const { success } = useNotification();

  // useForm 훅 사용 (포맷터 추가)
  const formatters = {
    phoneNumber: formatPhoneNumber,
  };

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
  } = useForm(
    {
      name: "",
      email: "",
      phoneNumber: "",
      age: "",
      password: "",
    },
    formatters
  );

  // useApi 훅 사용
  const {
    loading,
    error,
    execute: registerUser,
  } = useApi(authApi.register, {
    onSuccess: (data, message) => {
      handleLoginClick();
      success(
        "회원가입이 성공적으로 완료되었습니다. 지금 로그인하여 서비스를 시작하세요!"
      );
      console.log("회원가입 성공:", data, message);
      if (onRegister) {
        onRegister();
      }
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
      // 서버 에러를 폼 에러로 변환
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;

        // 필드별로 에러 메시지 매핑
        if (errorMessage.includes("이메일")) {
          setFieldError("email", errorMessage);
        } else if (errorMessage.includes("비밀번호")) {
          setFieldError("password", errorMessage);
        } else if (errorMessage.includes("이름")) {
          setFieldError("name", errorMessage);
        } else if (errorMessage.includes("전화번호")) {
          setFieldError("phoneNumber", errorMessage);
        } else if (errorMessage.includes("연령대")) {
          setFieldError("age", errorMessage);
        } else {
          // 일반적인 에러는 이메일 필드에 표시
          setFieldError("email", errorMessage);
        }
      }
    },
  });

  // 실시간 필드 검증 함수
  const validateField = (name, value) => {
    const validator = REGISTER_VALIDATION_SCHEMA[name];
    if (validator) {
      const error = validator(value);
      setFieldError(name, error || "");
      return error;
    }
    return "";
  };

  // 향상된 handleChange
  const handleEnhancedChange = (e) => {
    const { name, value } = e.target;
    handleChange(e);

    // 실시간 검증 (필드가 touched 상태일 때만)
    if (touched[name]) {
      validateField(name, value);
    }
  };

  // 향상된 handleBlur
  const handleEnhancedBlur = (e) => {
    const { name, value } = e.target;
    handleBlur(e);

    // 블러 시 항상 검증 실행
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // // 모든 필드를 touched 상태로 만들기
    // const touchedFields = Object.keys(formData).reduce((acc, key) => {
    //   acc[key] = true;
    //   return acc;
    // }, {});

    // 클라이언트 사이드 검증
    // const isValid = validateForm(REGISTER_VALIDATION_SCHEMA);

    // if (!isValid) {
    //   // 검증 실패 시 사용자에게 알림
    //   alert("입력 정보를 확인해주세요. 빨간색으로 표시된 필드를 수정해주세요.");
    //   return;
    // }

    try {
      await registerUser(formData);
      navigate(ROUTES.LOGIN.route);
      // onSuccess에서 자동으로 처리됨
    } catch (error) {
      console.error("회원가입 실패:", error);
      console.error("회원가입 실패:", error);
      // onError에서 자동으로 처리됨
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
  const errorCount = Object.values(errors).filter(
    (error) => error && error.trim() !== ""
  ).length;

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
            handleChange={handleEnhancedChange}
            handleBlur={handleEnhancedBlur}
            touched={touched}
            errors={errors}
            validationSchema={REGISTER_VALIDATION_SCHEMA}
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
