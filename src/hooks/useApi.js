import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../utils';

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
 * @returns {ApiError|null} returns.error - API 에러 객체 (message, status 포함)
 * @returns {Function} returns.execute - API 실행 함수 (...args) => Promise<any>
 * @returns {Function} returns.reset - 상태 초기화 함수 () => void
 */
export const useApi = (apiFunction, options = {}) => {
  const { onSuccess, onError, autoExecute = false, autoExecuteArgs = [] } = options;
  // 성공시 ({데이터,메세지}) 줌, 실패시 에러객체 제공
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasAutoExecuted = useRef(false);

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
      throw new ApiError(errorMessage, 400);
    } catch (err) {
      console.log("useApierr", err);
      let apiError;
      
      if (err.response?.data?.isSuccess === false) {
        apiError = new ApiError(err.response.data.message || '요청이 실패했습니다.', err.response.status);
      } else if (err.response) {
        apiError = new ApiError(err.response.data?.message || '요청이 실패했습니다.', err.response.status);
      } else {
        apiError = new ApiError(err.message || '요청이 실패했습니다.', err.status||500);
      }
      setError(apiError);
      if (onError) onError(apiError);
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
    if (autoExecute && !hasAutoExecuted.current) {
      hasAutoExecuted.current = true;
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
