import { useCallback } from 'react';

/**
 * 확인 다이얼로그를 위한 커스텀 훅
 * @returns {Object} 확인 관련 함수들
 * @returns {Function} returns.confirm - 확인 다이얼로그 함수 (options) => Promise<boolean>
 * @param {Object} options - 확인 다이얼로그 옵션
 * @param {string} [options.title='확인'] - 다이얼로그 제목
 * @param {string} [options.message='정말로 진행하시겠습니까?'] - 다이얼로그 메시지
 * @param {Function} [options.onConfirm] - 확인 시 실행할 함수
 * @param {Function} [options.onCancel] - 취소 시 실행할 함수
 */
export const useConfirm = () => {
  const confirm = useCallback((options) => {
    const {
      title = '확인',
      message = '정말로 진행하시겠습니까?',
      onConfirm,
      onCancel
    } = options;

    return new Promise((resolve) => {
      const result = window.confirm(message);
      if (result) {
        if (onConfirm) onConfirm();
        resolve(true);
      } else {
        if (onCancel) onCancel();
        resolve(false);
      }
    });
  }, []);

  return {
    confirm
  };
};
