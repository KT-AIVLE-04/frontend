import { useCallback, useState } from "react";

/**
 * 폼 상태 관리를 위한 커스텀 훅
 * @param {Object} initialValues - 초기 폼 값들
 * @param {Object} formatters - 필드별 포맷터 함수들 { fieldName: (value) => formattedValue }
 * @returns {Object} 폼 상태와 함수들
 * @returns {Object} returns.values - 현재 폼 값들
 * @returns {Object} returns.errors - 필드별 에러 메시지들
 * @returns {Object} returns.touched - 필드별 터치 상태들
 * @returns {Function} returns.handleChange - 값 변경 핸들러 (nameOrEvent, value?) => void
 * @returns {Function} returns.handleBlur - 블러 핸들러 (nameOrEvent) => void
 * @returns {Function} returns.setFieldValue - 특정 필드 값 설정 (name, value) => void
 * @returns {Function} returns.setFieldError - 특정 필드 에러 설정 (name, error) => void
 * @returns {Function} returns.setAllErrors - 모든 에러 설정 (errors) => void
 * @returns {Function} returns.resetForm - 폼 초기화 (newValues?) => void
 * @returns {Function} returns.validateForm - 폼 유효성 검사 (validationSchema) => boolean
 */
export const useForm = (initialValues = {}, formatters = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback(
    (nameOrEvent, value) => {
      // 이벤트 객체인 경우
      if (nameOrEvent && nameOrEvent.target) {
        const { name, value: targetValue } = nameOrEvent.target;

        // 포맷터가 있으면 적용
        const formatter = formatters[name];
        const formattedValue = formatter ? formatter(targetValue) : targetValue;

        setValues((prev) => ({
          ...prev,
          [name]: formattedValue,
        }));

        // 에러가 있으면 클리어
        if (errors[name]) {
          setErrors((prev) => ({
            ...prev,
            [name]: "",
          }));
        }
      } else {
        // 기존 방식 (name, value) 지원
        const formatter = formatters[nameOrEvent];
        const formattedValue = formatter ? formatter(value) : value;

        setValues((prev) => ({
          ...prev,
          [nameOrEvent]: formattedValue,
        }));

        // 에러가 있으면 클리어
        if (errors[nameOrEvent]) {
          setErrors((prev) => ({
            ...prev,
            [nameOrEvent]: "",
          }));
        }
      }
    },
    [errors, formatters]
  );

  const handleBlur = useCallback((nameOrEvent) => {
    // 이벤트 객체인 경우
    if (nameOrEvent && nameOrEvent.target) {
      const { name } = nameOrEvent.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    } else {
      // 기존 방식 (name) 지원
      setTouched((prev) => ({
        ...prev,
        [nameOrEvent]: true,
      }));
    }
  }, []);

  const setFieldValue = useCallback(
    (name, value) => {
      // 포맷터가 있으면 적용
      const formatter = formatters[name];
      const formattedValue = formatter ? formatter(value) : value;

      setValues((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    },
    [formatters]
  );

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const setAllErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  const resetForm = useCallback(
    (newValues = initialValues) => {
      setValues(newValues);
      setErrors({});
      setTouched({});
    },
    [initialValues]
  );

  const validateForm = useCallback(
    (validationSchema) => {
      if (!validationSchema) return true;

      const newErrors = {};
      let isValid = true;

      Object.keys(validationSchema).forEach((fieldName) => {
        const validator = validationSchema[fieldName];
        if (typeof validator === "function") {
          const error = validator(values[fieldName]);
          if (error) {
            console.log("에러 발생:", fieldName, error);
            newErrors[fieldName] = error;
            isValid = false;
          }
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [values]
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setAllErrors,
    resetForm,
    validateForm,
    setTouched, // 추가
  };
};
