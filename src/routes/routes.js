export const ROUTES = {
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  CONTENT_CREATION: '/content-creation',
  CONTENT_MANAGEMENT: '/content-management',
  STORE_MANAGEMENT: '/store-management',
  SNS_INTEGRATION: '/sns-integration',
  LOGIN: '/login',
  REGISTER: '/register'
}

export const NAV_ITEMS = {
  DASHBOARD: 'dashboard',
  ANALYTICS: 'analytics',
  CONTENT_CREATION: 'content-creation',
  CONTENT_MANAGEMENT: 'content-management',
  STORE_MANAGEMENT: 'store-management',
  SNS_INTEGRATION: 'sns-integration'
}

export const ROUTE_MAPPING = {
  [NAV_ITEMS.DASHBOARD]: ROUTES.DASHBOARD,
  [NAV_ITEMS.ANALYTICS]: ROUTES.ANALYTICS,
  [NAV_ITEMS.CONTENT_CREATION]: ROUTES.CONTENT_CREATION,
  [NAV_ITEMS.CONTENT_MANAGEMENT]: ROUTES.CONTENT_MANAGEMENT,
  [NAV_ITEMS.STORE_MANAGEMENT]: ROUTES.STORE_MANAGEMENT,
  [NAV_ITEMS.SNS_INTEGRATION]: ROUTES.SNS_INTEGRATION
} 