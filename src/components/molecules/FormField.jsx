import React from 'react';
import { FieldError, FieldInput, FieldLabel } from '../atoms';

export function FormField({ 
  label, 
  name, 
  type = "text",
  value, 
  onChange, 
  onBlur,
  placeholder, 
  required = false,
  error,
  validate,
  touched,
  options = [],
  className = "",
  readOnly = false,
  step,
  rows
}) {
  // 실시간 검증 함수
  const validateField = (fieldValue) => {
    if (!validate || typeof validate !== 'function') return null;
    return validate(fieldValue);
  };

  // 필드 변경 핸들러 (검증 포함)
  const handleFieldChange = (e) => {
    const newValue = e.target.value;
    
    // 실시간 검증 (에러가 있을 때만)
    if (touched && touched[name]) {
      const validationError = validateField(newValue);
      if (validationError) {
        // 에러가 있으면 onChange에 에러 정보도 포함
        const errorEvent = {
          ...e,
          validationError
        };
        onChange(errorEvent);
        return;
      }
    }
    
    onChange(e);
  };

  // 필드 블러 핸들러 (검증 포함)
  const handleFieldBlur = (e) => {
    const validationError = validateField(e.target.value);
    
    // 블러 이벤트에 검증 결과 포함
    const blurEvent = {
      ...e,
      validationError
    };
    
    if (onBlur) {
      onBlur(blurEvent);
    }
  };

  // 에러 표시 (외부 에러 또는 검증 에러)
  const displayError = error || (touched && touched[name] && validateField(value));

  return (
    <div className={`mb-6 ${className}`}>
      <FieldLabel 
        label={label}
        name={name}
        required={required}
        hasError={!!displayError}
      />
      <FieldInput
        type={type}
        name={name}
        value={value}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        error={!!displayError}
        options={options}
        step={step}
        rows={rows}
      />
      <FieldError error={displayError} />
    </div>
  );
}
