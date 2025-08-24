import { useCallback, useState } from 'react';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      
      // 백엔드 응답 형식 파싱
      if (response && typeof response === 'object') {
        // 성공 응답인 경우 result만 추출
        if (response.isSuccess === true && response.result !== undefined) {
          const parsedData = response.result;
          setData(parsedData);
          return parsedData;
        }
        
        // 실패 응답인 경우 에러 처리
        if (response.isSuccess === false) {
          const errorMessage = response.message || '요청이 실패했습니다.';
          const apiError = new Error(errorMessage);
          apiError.response = response;
          setError(apiError);
          throw apiError;
        }
      }
      
      // 기존 형식 그대로 반환 (하위 호환성)
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};
