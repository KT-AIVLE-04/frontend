import { useCallback, useEffect, useState } from 'react';

/**
 * API 호출을 위한 커스텀 훅
 * @param {Function} apiFunction - 호출할 API 함수
 * @param {Object} options - 옵션 객체
 * @param {Function} [options.onSuccess] - 성공 시 콜백 함수 (data, message) => void
 * @param {Function} [options.onError] - 실패 시 콜백 함수 (error) => void
 * @param {boolean} [options.autoExecute=false] - 컴포넌트 마운트 시 자동 실행 여부
 * @param {Array} [options.autoExecuteArgs=[]] - 자동 실행 시 전달할 인자들
 * @returns {Object} API 상태와 함수들
 * @returns {any} returns.data - API 응답 데이터
 * @returns {boolean} returns.loading - 로딩 상태
 * @returns {Error|null} returns.error - 에러 객체
 * @returns {Function} returns.execute - API 실행 함수 (...args) => Promise<any>
 * @returns {Function} returns.reset - 상태 초기화 함수 () => void
 */
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
