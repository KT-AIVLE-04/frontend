/**
 * 업종 상수 정의 - 백엔드 Industry enum과 일치
 */
export const INDUSTRY_LABELS = {
  RESTAURANT: "음식점",
  CAFE: "카페",
  FASHION: "패션",
  BEAUTY: "뷰티",
  TECH: "테크",
};

// FormField용 options 형태로도 export
export const INDUSTRY_OPTIONS = [
  ...Object.entries(INDUSTRY_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
  { value: "OTHER", label: "기타" },
];
