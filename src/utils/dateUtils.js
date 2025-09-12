/**
 * 날짜 관련 유틸리티 함수들
 */

/**
 * 현재 날짜로부터 지정된 일수 전의 날짜를 YYYY-MM-DD 형식으로 반환
 * @param {number} daysAgo - 몇 일 전인지
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
export const getDateString = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

/**
 * dateRange 값에 따른 날짜 계산
 * @param {string} dateRange - 날짜 범위 ('today', 'yesterday', 'last7', 'last30')
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
export const getDateFromRange = (dateRange) => {
  switch (dateRange) {
    case 'today':
      return getDateString(0);
    case 'yesterday':
      return getDateString(1);
    case 'last7':
      return getDateString(7);
    case 'last30':
      return getDateString(30);
    default:
      return getDateString(1);
  }
};

/**
 * 날짜를 한국 시간대로 포맷팅
 * @param {string|Date} date - 날짜
 * @param {string} format - 포맷 ('date', 'datetime', 'time')
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatKoreanDate = (date, format = 'date') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options = {
    date: { year: 'numeric', month: 'long', day: 'numeric' },
    datetime: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    time: { hour: '2-digit', minute: '2-digit' }
  };

  return dateObj.toLocaleDateString('ko-KR', options[format]);
};

/**
 * 두 날짜 사이의 일수 차이 계산
 * @param {string|Date} date1 - 첫 번째 날짜
 * @param {string|Date} date2 - 두 번째 날짜
 * @returns {number} 일수 차이
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * 날짜를 한국 형식의 날짜시간 문자열로 포맷팅
 * @param {string|Date} dateString - 날짜 문자열 또는 Date 객체
 * @returns {string} YYYY.MM.DD HH:MM 형식의 문자열
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
