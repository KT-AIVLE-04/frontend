/**
 * 포맷팅 유틸리티 함수들
 */

// 전화번호 포맷팅 함수
export const formatPhoneNumber = (value) => {
  if (!value) return "";

  const numbers = value.replace(/[^\d]/g, "");

  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else if (numbers.length <= 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
      7,
      11
    )}`;
  }
};

// 사업자등록번호 포맷팅 함수
export const formatBusinessNumber = (value) => {
  if (!value) return "";

  const numbers = value.replace(/[^\d]/g, "");

  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(
      5,
      10
    )}`;
  }
};

// 날짜 포맷팅 함수 (YYYY-MM-DD)
export const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// 날짜 포맷팅 함수 (한국어)
export const formatDateKorean = (date) => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 시간 포맷팅 함수
export const formatTime = (date) => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

// 날짜시간 포맷팅 함수
export const formatDateTime = (date) => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  // 한국 시간대(KST)로 명시적 변환
  return d.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 파일 크기 포맷팅 함수
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 숫자 포맷팅 함수 (천 단위 콤마)
export const formatNumber = (number) => {
  if (number === null || number === undefined) return "";
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 통화 포맷팅 함수
export const formatCurrency = (amount, currency = "KRW") => {
  if (amount === null || amount === undefined) return "";

  const formatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: currency,
  });

  return formatter.format(amount);
};

// 퍼센트 포맷팅 함수
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return "";
  return `${(value * 100).toFixed(decimals)}%`;
};

// 카드 번호 포맷팅 함수
export const formatCardNumber = (value) => {
  if (!value) return "";

  const numbers = value.replace(/[^\d]/g, "");
  const groups = numbers.match(/.{1,4}/g);

  return groups ? groups.join("-") : numbers;
};

// 주민등록번호 포맷팅 함수
export const formatResidentNumber = (value) => {
  if (!value) return "";

  const numbers = value.replace(/[^\d]/g, "");

  if (numbers.length <= 6) {
    return numbers;
  } else {
    return `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`;
  }
};

// URL 정규화 함수
export const normalizeUrl = (url) => {
  if (!url) return "";

  // http:// 또는 https://가 없으면 추가
  if (!url.match(/^https?:\/\//)) {
    url = "https://" + url;
  }

  return url;
};

// 텍스트 자르기 함수
export const truncateText = (text, maxLength, suffix = "...") => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + suffix;
};

// 카멜케이스를 스네이크케이스로 변환
export const camelToSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

// 스네이크케이스를 카멜케이스로 변환
export const snakeToCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

// 첫 글자 대문자로 변환
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// 모든 단어 첫 글자 대문자로 변환
export const capitalizeWords = (str) => {
  if (!str) return "";
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};
