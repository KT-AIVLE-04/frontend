import { useCallback } from 'react';

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
