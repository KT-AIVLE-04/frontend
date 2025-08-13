/**
 * 포맷팅 관련 유틸 함수들
 */

/**
 * 연락처 포맷팅 함수 - 정규식 /^(0\d{1,2})-\d{3,4}-\d{4}$/ 형식에 맞춤
 * @param {string} value - 입력된 연락처 값
 * @returns {string} 포맷팅된 연락처
 */
export const formatContactNumber = (value) => {
  const numbers = value.replace(/[^\d]/g, '');

  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 5) {
    // 02-123 형태
    return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
  } else if (numbers.length <= 9) {
    // 02-123-4567 형태 (중간 3자리)
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
  } else if (numbers.length <= 10) {
    // 02-1234-5678 형태 (중간 4자리)
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else if (numbers.length <= 11) {
    // 010-123-4567 형태 (중간 3자리)
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  } else {
    // 010-1234-5678 형태 (중간 4자리)
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
};

/**
 * 연락처 유효성 검사 함수
 * @param {string} phoneNumber - 검사할 연락처
 * @returns {boolean} 유효성 여부
 */
export const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(0\d{1,2})-\d{3,4}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
};
