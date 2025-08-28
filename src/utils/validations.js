/**
 * 폼 검증 스키마 상수 정의
 */

// 이메일 검증 함수
export const validateEmail = (value) => {
  if (!value) return '이메일을 입력해주세요.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '올바른 이메일 형식을 입력해주세요.';
  return '';
};

// 비밀번호 검증 함수
export const validatePassword = (value) => {
  if (!value) return '비밀번호를 입력해주세요.';
  if (value.length < 6) return '비밀번호는 6자 이상이어야 합니다.';
  if (!/(?=.*[a-zA-Z])/.test(value)) return '비밀번호는 영문자를 포함해야 합니다.';
  if (!/(?=.*[0-9])/.test(value)) return '비밀번호는 숫자를 포함해야 합니다.';
  return '';
};

// 이름 검증 함수
export const validateName = (value) => {
  if (!value) return '이름을 입력해주세요.';
  if (value.length < 2) return '이름은 2자 이상이어야 합니다.';
  if (value.length > 20) return '이름은 20자 이하여야 합니다.';
  if (!/^[가-힣a-zA-Z\s]+$/.test(value)) return '이름은 한글, 영문, 공백만 입력 가능합니다.';
  return '';
};

// 전화번호 검증 함수
export const validatePhone = (value) => {
  if (!value) return '전화번호를 입력해주세요.';
  
  // 정규식 패턴: ^(0\d{1,2})-\d{3,4}-\d{4}$
  const phonePattern = /^(0\d{1,2})-\d{3,4}-\d{4}$/;
  
  if (!phonePattern.test(value)) {
    return '올바른 전화번호 형식을 입력해주세요. (예: 02-1234-5678, 010-1234-5678)';
  }
  
  return '';
};

// 필수 입력 검증 함수
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') return `${fieldName}을(를) 입력해주세요.`;
  return '';
};

// 최소 길이 검증 함수
export const validateMinLength = (value, minLength, fieldName) => {
  if (!value) return '';
  if (value.length < minLength) return `${fieldName}은(는) ${minLength}자 이상이어야 합니다.`;
  return '';
};

// 최대 길이 검증 함수
export const validateMaxLength = (value, maxLength, fieldName) => {
  if (!value) return '';
  if (value.length > maxLength) return `${fieldName}은(는) ${maxLength}자 이하여야 합니다.`;
  return '';
};

// 숫자 검증 함수
export const validateNumber = (value, fieldName) => {
  if (!value) return '';
  if (!/^\d+$/.test(value)) return `${fieldName}은(는) 숫자만 입력 가능합니다.`;
  return '';
};

// URL 검증 함수
export const validateUrl = (value) => {
  if (!value) return '';
  try {
    new URL(value);
    return '';
  } catch {
    return '올바른 URL 형식을 입력해주세요.';
  }
};

// 로그인 폼 검증 스키마
export const LOGIN_VALIDATION_SCHEMA = {
  email: validateEmail,
  password: (value) => {
    if (!value) return '비밀번호를 입력해주세요.';
    if (value.length < 6) return '비밀번호는 6자 이상이어야 합니다.';
    return '';
  }
};

// 회원가입 폼 검증 스키마
export const REGISTER_VALIDATION_SCHEMA = {
  name: validateName,
  email: validateEmail,
  phoneNumber: validatePhone,
  age: (value) => validateRequired(value, '연령대'),
  password: validatePassword
};

// 매장 정보 폼 검증 스키마
export const STORE_VALIDATION_SCHEMA = {
  name: (value) => {
    if (!value) return '매장명을 입력해주세요.';
    if (value.length < 2) return '매장명은 2자 이상이어야 합니다.';
    if (value.length > 50) return '매장명은 50자 이하여야 합니다.';
    return '';
  },
  industry: (value) => validateRequired(value, '업종'),
  address: (value) => validateRequired(value, '주소'),
  phoneNumber: validatePhone,
};

// 콘텐츠 폼 검증 스키마
export const CONTENT_VALIDATION_SCHEMA = {
  title: (value) => {
    if (!value) return '제목을 입력해주세요.';
    if (value.length < 2) return '제목은 2자 이상이어야 합니다.';
    if (value.length > 100) return '제목은 100자 이하여야 합니다.';
    return '';
  },
  description: (value) => {
    if (!value) return '';
    if (value.length > 1000) return '설명은 1000자 이하여야 합니다.';
    return '';
  },
  tags: (value) => {
    if (!value || value.length === 0) return '';
    if (value.length > 10) return '태그는 최대 10개까지 입력 가능합니다.';
    return '';
  }
};

// SNS 연동 폼 검증 스키마
export const SNS_VALIDATION_SCHEMA = {
  platform: (value) => validateRequired(value, 'SNS 플랫폼'),
  accountId: (value) => {
    if (!value) return '계정 ID를 입력해주세요.';
    if (value.length < 3) return '계정 ID는 3자 이상이어야 합니다.';
    if (value.length > 30) return '계정 ID는 30자 이하여야 합니다.';
    return '';
  },
  accessToken: (value) => validateRequired(value, '액세스 토큰')
};

// 검색 필터 검증 스키마
export const SEARCH_VALIDATION_SCHEMA = {
  keyword: (value) => {
    if (!value) return '';
    if (value.length > 50) return '검색어는 50자 이하여야 합니다.';
    return '';
  },
  dateFrom: (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '올바른 날짜를 입력해주세요.';
    return '';
  },
  dateTo: (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '올바른 날짜를 입력해주세요.';
    return '';
  }
};

// 콘텐츠 생성 폼 검증 스키마
export const CONTENT_CREATION_VALIDATION_SCHEMA = {
  brandConcepts: (value) => {
    if (!value || value.length === 0) return '브랜드 컨셉을 입력해주세요.';
    return '';
  },
  referenceFiles: (value) => {
    if (!value || value.length === 0) return '참고 파일을 업로드해주세요.';
    return '';
  },
  adType: (value) => {
    if (!value) return '광고 유형을 선택해주세요.';
    return '';
  },
  adPlatform: (value) => {
    if (!value) return '광고 플랫폼을 선택해주세요.';
    return '';
  },
  adTarget: (value) => {
    if (!value || !value.trim()) return '타겟을 입력해주세요.';
    return '';
  },
  adDuration: (value) => {
    if (!value) return '광고 기간을 선택해주세요.';
    return '';
  },
  additionalInfo: (value) => {
    if (!value || !value.trim()) return '추가 정보를 입력해주세요.';
    return '';
  }
};

// 통합 검증 함수
export const validateField = (value, fieldName, validators) => {
  for (const validator of validators) {
    const error = validator(value, fieldName);
    if (error) return error;
  }
  return '';
};

// 폼 전체 검증 함수
export const validateForm = (values, schema) => {
  const errors = {};
  let isValid = true;

  Object.keys(schema).forEach(fieldName => {
    const value = values[fieldName];
    const validator = schema[fieldName];
    const error = validator(value);
    
    if (error) {
      errors[fieldName] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
