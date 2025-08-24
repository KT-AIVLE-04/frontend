// ============================================================================
// 기본 색상 팔레트
// ============================================================================

// 메인 브랜드 색상
export const PRIMARY = '#3b82f6'; // blue-500

// 상태별 색상
export const SUCCESS = '#22c55e'; // green-500
export const WARNING = '#f59e0b'; // yellow-500
export const DANGER = '#ef4444';  // red-500

// 중성 색상
export const GRAY = {
  light: '#f3f4f6',   // gray-100
  medium: '#9ca3af',  // gray-400
  dark: '#374151'     // gray-700
};

// 보조 색상
export const PURPLE = '#a855f7'; // purple-500
export const ORANGE = '#f97316'; // orange-500
export const CYAN = '#06b6d4';   // cyan-500

// ============================================================================
// 플랫폼별 색상
// ============================================================================

export const PLATFORM_COLORS = {
  instagram: '#f97316', // orange-500
  facebook: '#3b82f6',  // blue-500
  youtube: '#ef4444',   // red-500
  kakao: '#fbbf24',     // yellow-400
  naver: '#22c55e',     // green-500
  google: '#6b7280'     // gray-500
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

// 플랫폼별 색상 가져오기
export const getPlatformColor = (platform) => {
  return PLATFORM_COLORS[platform] || PLATFORM_COLORS.instagram;
};

// ============================================================================
// 내보내기
// ============================================================================

export default {
  PRIMARY,
  SUCCESS,
  WARNING,
  DANGER,
  GRAY,
  PURPLE,
  ORANGE,
  CYAN,
  PLATFORM_COLORS,
  getPlatformColor
};
