import { useCallback, useEffect, useState } from 'react';

export const useApi = (apiFunction, options = {}) => {
  const { onSuccess, onError, autoExecute = false, autoExecuteArgs = [] } = options;
  
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
          
          // onSuccess 콜백 실행
          if (onSuccess) {
            onSuccess(parsedData, response);
          }
          
          return parsedData;
        }
        
        // 실패 응답인 경우 에러 처리
        if (response.isSuccess === false) {
          const errorMessage = response.message || '요청이 실패했습니다.';
          const apiError = new Error(errorMessage);
          apiError.response = response;
          setError(apiError);
          
          // onError 콜백 실행
          if (onError) {
            onError(apiError, response);
          }
          
          throw apiError;
        }
      }
      
      // 기존 형식 그대로 반환 (하위 호환성)
      setData(response);
      
      // onSuccess 콜백 실행
      if (onSuccess) {
        onSuccess(response, response);
      }
      
      return response;
    } catch (err) {
      setError(err);
      
      // onError 콜백 실행
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  // autoExecute가 true인 경우 컴포넌트 마운트 시 자동 실행
  useEffect(() => {
    if (autoExecute) {
      execute(...autoExecuteArgs);
    }
  }, [autoExecute, autoExecuteArgs, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};
