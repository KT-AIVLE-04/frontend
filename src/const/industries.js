/**
 * 업종 상수 정의
 */
export const INDUSTRY_LABELS = {
  'AGRICULTURE': '농업, 임업 및 어업',
  'MINING': '광업',
  'MANUFACTURING': '제조업',
  'ELECTRICITY': '전기, 가스, 증기 및 공기조절',
  'WATER': '수도, 하수, 폐기물 관리',
  'CONSTRUCTION': '건설업',
  'RETAIL': '도매 및 소매업',
  'TRANSPORT': '운수 및 창고업',
  'FOOD': '숙박 및 음식점업',
  'ICT': '정보통신업',
  'FINANCE': '금융 및 보험업',
  'REAL_ESTATE': '부동산업',
  'PROFESSIONAL': '전문, 과학 및 기술 서비스업',
  'BUSINESS': '사업시설관리 및 지원 서비스업',
  'PUBLIC': '공공행정, 국방',
  'EDUCATION': '교육서비스업',
  'HEALTH': '보건 및 사회복지 서비스업',
  'CULTURE': '예술, 스포츠 및 여가',
  'PERSONAL': '수리 및 기타 개인 서비스업',
  'HOUSEHOLD': '가구 내 고용활동 등',
  'FOREIGN': '국제 및 외국기관',
  'ETC': '기타'
};

// FormField용 options 형태로도 export
export const INDUSTRY_OPTIONS = Object.entries(INDUSTRY_LABELS).map(([value, label]) => ({
  value,
  label
})); 