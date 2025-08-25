import { useCallback } from 'react';

/**
 * 알림을 위한 커스텀 훅
 * @returns {Object} 알림 관련 함수들
 * @returns {Function} returns.addNotification - 알림 추가 함수 (notification) => void
 * @returns {Function} returns.success - 성공 알림 함수 (message, options?) => void
 * @returns {Function} returns.error - 에러 알림 함수 (message, options?) => void
 * @returns {Function} returns.warning - 경고 알림 함수 (message, options?) => void
 * @returns {Function} returns.info - 정보 알림 함수 (message, options?) => void
 * @param {Object} notification - 알림 객체
 * @param {string} notification.type - 알림 타입 ('success', 'error', 'warning', 'info')
 * @param {string} notification.message - 알림 메시지
 */
export const useNotification = () => {
  const addNotification = useCallback((notification) => {
    const { type, message } = notification;
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    alert(`${icons[type] || icons.info} ${message}`);
  }, []);

  const success = useCallback((message, options = {}) => {
    return addNotification({ type: 'success', message, ...options });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    return addNotification({ type: 'error', message, ...options });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    return addNotification({ type: 'warning', message, ...options });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    return addNotification({ type: 'info', message, ...options });
  }, [addNotification]);

  return {
    addNotification,
    success,
    error,
    warning,
    info
  };
};
