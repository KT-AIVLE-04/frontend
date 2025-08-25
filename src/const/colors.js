// ============================================================================
// 기본 색상 팔레트
// ============================================================================

// 메인 브랜드 색상
export const PRIMARY = '#b5b5ff';
export const SECONDARY = '#f38380';
export const ACCENT = '#eec64a';

// 상태별 색상
export const SUCCESS = '#64d97b';
export const WARNING = '#f59e0b';
export const DANGER = '#ef4444';

// 중성 색상
export const TEXT = '#040324';
export const BG = '#f7f7fe';

// ============================================================================
// 색상 변형 (투명도별)
// ============================================================================

// 텍스트 색상 변형
export const TEXT_VARIANTS = {
  5: 'hsl(242, 85%, 8%, 5%)',
  10: 'hsl(242, 85%, 8%, 10%)',
  15: 'hsl(242, 85%, 8%, 15%)',
  20: 'hsl(242, 85%, 8%, 20%)',
  25: 'hsl(242, 85%, 8%, 25%)',
  30: 'hsl(242, 85%, 8%, 30%)',
  35: 'hsl(242, 85%, 8%, 35%)',
  40: 'hsl(242, 85%, 8%, 40%)',
  45: 'hsl(242, 85%, 8%, 45%)',
  50: 'hsl(242, 85%, 8%, 50%)',
  55: 'hsl(242, 85%, 8%, 55%)',
  60: 'hsl(242, 85%, 8%, 60%)',
  65: 'hsl(242, 85%, 8%, 65%)',
  70: 'hsl(242, 85%, 8%, 70%)',
  75: 'hsl(242, 85%, 8%, 75%)',
  80: 'hsl(242, 85%, 8%, 80%)',
  85: 'hsl(242, 85%, 8%, 85%)',
  90: 'hsl(242, 85%, 8%, 90%)',
  95: 'hsl(242, 85%, 8%, 95%)'
};

// Primary 색상 변형
export const PRIMARY_VARIANTS = {
  5: 'hsl(240, 100%, 85%, 5%)',
  10: 'hsl(240, 100%, 85%, 10%)',
  15: 'hsl(240, 100%, 85%, 15%)',
  20: 'hsl(240, 100%, 85%, 20%)',
  25: 'hsl(240, 100%, 85%, 25%)',
  30: 'hsl(240, 100%, 85%, 30%)',
  35: 'hsl(240, 100%, 85%, 35%)',
  40: 'hsl(240, 100%, 85%, 40%)',
  45: 'hsl(240, 100%, 85%, 45%)',
  50: 'hsl(240, 100%, 85%, 50%)',
  55: 'hsl(240, 100%, 85%, 55%)',
  60: 'hsl(240, 100%, 85%, 60%)',
  65: 'hsl(240, 100%, 85%, 65%)',
  70: 'hsl(240, 100%, 85%, 70%)',
  75: 'hsl(240, 100%, 85%, 75%)',
  80: 'hsl(240, 100%, 85%, 80%)',
  85: 'hsl(240, 100%, 85%, 85%)',
  90: 'hsl(240, 100%, 85%, 90%)',
  95: 'hsl(240, 100%, 85%, 95%)'
};

// Secondary 색상 변형
export const SECONDARY_VARIANTS = {
  5: 'hsl(2, 83%, 73%, 5%)',
  10: 'hsl(2, 83%, 73%, 10%)',
  15: 'hsl(2, 83%, 73%, 15%)',
  20: 'hsl(2, 83%, 73%, 20%)',
  25: 'hsl(2, 83%, 73%, 25%)',
  30: 'hsl(2, 83%, 73%, 30%)',
  35: 'hsl(2, 83%, 73%, 35%)',
  40: 'hsl(2, 83%, 73%, 40%)',
  45: 'hsl(2, 83%, 73%, 45%)',
  50: 'hsl(2, 83%, 73%, 50%)',
  55: 'hsl(2, 83%, 73%, 55%)',
  60: 'hsl(2, 83%, 73%, 60%)',
  65: 'hsl(2, 83%, 73%, 65%)',
  70: 'hsl(2, 83%, 73%, 70%)',
  75: 'hsl(2, 83%, 73%, 75%)',
  80: 'hsl(2, 83%, 73%, 80%)',
  85: 'hsl(2, 83%, 73%, 85%)',
  90: 'hsl(2, 83%, 73%, 90%)',
  95: 'hsl(2, 83%, 73%, 95%)'
};

// Accent 색상 변형
export const ACCENT_VARIANTS = {
  5: 'hsl(45, 83%, 61%, 5%)',
  10: 'hsl(45, 83%, 61%, 10%)',
  15: 'hsl(45, 83%, 61%, 15%)',
  20: 'hsl(45, 83%, 61%, 20%)',
  25: 'hsl(45, 83%, 61%, 25%)',
  30: 'hsl(45, 83%, 61%, 30%)',
  35: 'hsl(45, 83%, 61%, 35%)',
  40: 'hsl(45, 83%, 61%, 40%)',
  45: 'hsl(45, 83%, 61%, 45%)',
  50: 'hsl(45, 83%, 61%, 50%)',
  55: 'hsl(45, 83%, 61%, 55%)',
  60: 'hsl(45, 83%, 61%, 60%)',
  65: 'hsl(45, 83%, 61%, 65%)',
  70: 'hsl(45, 83%, 61%, 70%)',
  75: 'hsl(45, 83%, 61%, 75%)',
  80: 'hsl(45, 83%, 61%, 80%)',
  85: 'hsl(45, 83%, 61%, 85%)',
  90: 'hsl(45, 83%, 61%, 90%)',
  95: 'hsl(45, 83%, 61%, 95%)'
};

// ============================================================================
// 버튼 색상
// ============================================================================

export const BUTTON_COLORS = {
  primary: {
    bg: PRIMARY,
    text: TEXT,
    hover: PRIMARY_VARIANTS[80],
    active: PRIMARY_VARIANTS[90]
  },
  secondary: {
    bg: SECONDARY_VARIANTS[30],
    text: TEXT,
    hover: SECONDARY_VARIANTS[40],
    active: SECONDARY_VARIANTS[50]
  },
  accent: {
    bg: ACCENT,
    text: TEXT,
    hover: ACCENT_VARIANTS[80],
    active: ACCENT_VARIANTS[90]
  },
  success: {
    bg: SUCCESS,
    text: '#ffffff',
    hover: '#4ade80',
    active: '#22c55e'
  },
  danger: {
    bg: DANGER,
    text: '#ffffff',
    hover: '#f87171',
    active: '#dc2626'
  }
};

// ============================================================================
// 플랫폼별 색상
// ============================================================================

export const PLATFORM_COLORS = {
  instagram: '#f97316',
  facebook: '#3b82f6',
  youtube: '#ef4444',
  kakao: '#fbbf24',
  naver: '#22c55e',
  google: '#6b7280'
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

// 플랫폼별 색상 가져오기
export const getPlatformColor = (platform) => {
  return PLATFORM_COLORS[platform] || PLATFORM_COLORS.instagram;
};

// 색상 변형 가져오기
export const getColorVariant = (color, variant) => {
  const variants = {
    text: TEXT_VARIANTS,
    primary: PRIMARY_VARIANTS,
    secondary: SECONDARY_VARIANTS,
    accent: ACCENT_VARIANTS
  };
  return variants[color]?.[variant] || variants.text[variant];
};

// ============================================================================
// 내보내기
// ============================================================================

export default {
  PRIMARY,
  SECONDARY,
  ACCENT,
  SUCCESS,
  WARNING,
  DANGER,
  TEXT,
  BG,
  TEXT_VARIANTS,
  PRIMARY_VARIANTS,
  SECONDARY_VARIANTS,
  ACCENT_VARIANTS,
  BUTTON_COLORS,
  PLATFORM_COLORS,
  getPlatformColor,
  getColorVariant
};
