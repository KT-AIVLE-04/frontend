import { useCallback, useEffect, useState } from 'react';

export const useApi = (apiFunction, options = {}) => {
  const { onSuccess, onError, autoExecute = false, autoExecuteArgs = [] } = options;
  // 성공시 ({데이터,메세지}) 줌, 실패시 에러객체 제공
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      if (typeof response === 'object' && response?.data) {
        const {isSuccess, result, message} = response.data;
        if(isSuccess){
          setData(result);
          if(onSuccess){
            onSuccess(result, message);
          }
          return result;
        }
      }
      const errorMessage = message || '요청이 실패했습니다.';
      const apiError = new Error(errorMessage);
      apiError.response = response;
      throw apiError;
    } catch (err) {
      setError(err);
      if (onError) onError(err);
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
