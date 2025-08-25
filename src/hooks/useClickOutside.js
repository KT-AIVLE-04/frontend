import { useEffect, useRef } from 'react';

/**
 * 요소 외부 클릭을 감지하는 커스텀 훅
 * @param {Function} handler - 외부 클릭 시 실행할 함수 (event) => void
 * @returns {React.RefObject} ref - 요소에 연결할 ref 객체
 */
export const useClickOutside = (handler) => {
  const ref = useRef();

  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
};
