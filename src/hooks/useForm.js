import { useCallback, useState } from 'react';

export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((nameOrEvent, value) => {
    // 이벤트 객체인 경우
    if (nameOrEvent && nameOrEvent.target) {
      const { name, value: targetValue } = nameOrEvent.target;
      setValues(prev => ({
        ...prev,
        [name]: targetValue
      }));
      
      // 에러가 있으면 클리어
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    } else {
      // 기존 방식 (name, value) 지원
      setValues(prev => ({
        ...prev,
        [nameOrEvent]: value
      }));
      
      // 에러가 있으면 클리어
      if (errors[nameOrEvent]) {
        setErrors(prev => ({
          ...prev,
          [nameOrEvent]: ''
        }));
      }
    }
  }, [errors]);

  const handleBlur = useCallback((nameOrEvent) => {
    // 이벤트 객체인 경우
    if (nameOrEvent && nameOrEvent.target) {
      const { name } = nameOrEvent.target;
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    } else {
      // 기존 방식 (name) 지원
      setTouched(prev => ({
        ...prev,
        [nameOrEvent]: true
      }));
    }
  }, []);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  const setAllErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const validateForm = useCallback((validationSchema) => {
    if (!validationSchema) return true;
    
    try {
      validationSchema.validateSync(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  }, [values]);

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
    validateForm
  };
};
