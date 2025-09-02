export const ROUTES = {
  ANALYTICS: {
    route: "/analytics",
    krName: "성과 분석",
    inMenu: true,
  },
  AI_REPORT: {
    route: "/analytics/ai-report/:snsType/:postId",
    krName: "AI 분석 보고서",
    inMenu: false,
  },
  AI_REPORT_WEBSOCKET: {
    route: "/analytics/ai-report-ws/:snsType/:postId",
    krName: "AI 분석 보고서 (실시간)",
    inMenu: false,
  },
  CONTENT_CREATION: {
    route: "/content-creation",
    krName: "콘텐츠 제작",
    inMenu: true,
  },
  CONTENT_MANAGEMENT: {
    route: "/content-management",
    krName: "콘텐츠 관리",
    inMenu: true,
  },
  POST_MANAGEMENT: {
    route: "/post-management",
    krName: "게시물 관리",
    inMenu: true,
  },
  SNS_INTEGRATION: {
    route: "/sns-integration",
    krName: "SNS 연동",
    inMenu: true,
  },
  STORE_MANAGEMENT: {
    route: "/store-management",
    krName: "매장 관리",
    inMenu: true,
  },
  STORE_UPDATE: {
    route: "/store-update",
    krName: "매장 등록/수정",
    inMenu: false,
  },
  LOGIN: {
    route: "/login",
    krName: "로그인",
    inMenu: false,
  },
  REGISTER: {
    route: "/register",
    krName: "회원가입",
    inMenu: false,
  },
  STORE_SELECTION: {
    route: "/store-selection",
    krName: "매장 선택",
    inMenu: false,
  },
};

// 메뉴에 표시할 항목들만 필터링
export const getMenuItems = () =>
  Object.entries(ROUTES)
    .filter(([, route]) => route.inMenu)
    .map(([key, route]) => ({ key, ...route }));
