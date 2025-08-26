import { useEffect, useState } from 'react';

/**
 * 윈도우 크기와 반응형 상태를 관리하는 커스텀 훅
 * @returns {Object} 윈도우 크기와 반응형 상태
 * @returns {number} returns.width - 윈도우 너비
 * @returns {number} returns.height - 윈도우 높이
 * @returns {boolean} returns.isMobile - 모바일 여부 (width < 768px)
 * @returns {boolean} returns.isTablet - 태블릿 여부 (768px <= width < 1024px)
 * @returns {boolean} returns.isDesktop - 데스크톱 여부 (width >= 1024px)
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 반응형 브레이크포인트 체크
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop
  };
};
