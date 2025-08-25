import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 여러 API를 동시에 또는 순차적으로 호출하는 커스텀 훅
 * @param {Object} apiFunctions - API 함수들 { key: () => Promise }
 * @param {Object} options - 옵션 객체
 * @param {Function} [options.onSuccess] - 모든 API 성공 시 콜백 (results, messages) => void
 * @param {Function} [options.onError] - 에러 발생 시 콜백 (errors, results?) => void
 * @param {boolean} [options.autoExecute=false] - 컴포넌트 마운트 시 자동 실행 여부
 * @param {Object} [options.initialApiFunctions] - 초기 실행할 API 함수들
 * @returns {Object} API 상태와 함수들
 * @returns {boolean} returns.loading - 로딩 상태
 * @returns {Error|null} returns.error - 전체 에러
 * @returns {Object} returns.errors - 개별 API 에러들 { key: Error }
 * @returns {Object} returns.results - API 결과들 { key: { result, message } }
 * @returns {Function} returns.executeMultiple - 병렬 실행 함수 (customApiCalls?) => Promise
 * @returns {Function} returns.executeSequential - 순차 실행 함수 (customApiCalls?) => Promise
 */
export const useMultipleApi = (apiFunctions = {}, options = {}) => {
  const { onSuccess, onError, autoExecute = false, initialApiFunctions = null } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({}); // 개별 API 에러들을 관리
  const [results, setResults] = useState({});
  const hasAutoExecuted = useRef(false);

  const executeMultiple = useCallback(async (customApiCalls = null) => {
    const apiCalls = customApiCalls || apiFunctions;
    if (!apiCalls || Object.keys(apiCalls).length === 0) {
      console.warn('useMultipleApi: 실행할 API 함수가 없습니다.');
      return { results: {}, errors: {} };
    }

    setLoading(true);
    setError(null);
    setErrors({});
    
    try {
      // apiCalls는 { key: apiFunction, ... } 형태
      const apiEntries = Object.entries(apiCalls);
      const promises = apiEntries.map(([key, apiFunction]) => 
        apiFunction().then(response => {
          // 백엔드 응답 형식 파싱
          if (typeof response === 'object' && response?.data) {
            const {isSuccess, result, message} = response.data;
            if(isSuccess){
              return { key, result, message, status: 'fulfilled' };
            }
          }
          const errorMessage = message || '요청이 실패했습니다.';
          const apiError = new Error(errorMessage);
          apiError.response = response;
          throw apiError;
        }).catch(err => ({ key, error: err, status: 'rejected' }))
      );

      const responses = await Promise.allSettled(promises);
      
      // 결과와 에러를 분리해서 처리
      const resultsMap = {};
      const errorsMap = {};

      responses.forEach(({ key, result, message, error, status }) => {
        if (status === 'fulfilled') {
          resultsMap[key] = { result, message };
        } else {
          errorsMap[key] = error;
        }
      });

      setResults(resultsMap);
      setErrors(errorsMap);
      
      // onSuccess 콜백 실행
      if (onSuccess && Object.keys(errorsMap).length === 0) {
        const messages = {};
        Object.entries(resultsMap).forEach(([key, value]) => {
          messages[key] = value.message;
        });
        onSuccess(resultsMap, messages);
      }
      
      // onError 콜백 실행 (에러가 하나라도 있으면)
      if (onError && Object.keys(errorsMap).length > 0) {
        onError(errorsMap, resultsMap);
      }

      return { results: resultsMap, errors: errorsMap };
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
  }, [apiFunctions, onSuccess, onError]);

  const executeSequential = useCallback(async (customApiCalls = null) => {
    const apiCalls = customApiCalls || apiFunctions;
    if (!apiCalls || Object.keys(apiCalls).length === 0) {
      console.warn('useMultipleApi: 실행할 API 함수가 없습니다.');
      return { results: {}, errors: {} };
    }

    setLoading(true);
    setError(null);
    setErrors({});
    
    try {
      const resultsMap = {};
      const errorsMap = {};
      
      for (const [key, apiFunction] of Object.entries(apiCalls)) {
        try {
          const response = await apiFunction();
          if (typeof response === 'object' && response?.data) {
            const {isSuccess, result, message} = response.data;
            if(isSuccess){
              resultsMap[key] = { result, message };
            } else {
              const errorMessage = message || '요청이 실패했습니다.';
              const apiError = new Error(errorMessage);
              apiError.response = response;
              throw apiError;
            }
          }
        } catch (err) {
          // 개별 API 실패 시에도 다른 API는 계속 실행
          errorsMap[key] = err;
        }
      }

      setResults(resultsMap);
      setErrors(errorsMap);
      
      // onSuccess 콜백 실행
      if (onSuccess && Object.keys(errorsMap).length === 0) {
        const messages = {};
        Object.entries(resultsMap).forEach(([key, value]) => {
          messages[key] = value.message;
        });
        onSuccess(resultsMap, messages);
      }
      
      // onError 콜백 실행 (에러가 하나라도 있으면)
      if (onError && Object.keys(errorsMap).length > 0) {
        onError(errorsMap, resultsMap);
      }

      return { results: resultsMap, errors: errorsMap };
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
  }, [apiFunctions, onSuccess, onError]);



  const clearResults = useCallback(() => {
    setResults({});
    setErrors({});
    setError(null);
  }, []);

  // autoExecute가 true인 경우 컴포넌트 마운트 시 자동 실행
  useEffect(() => {
    if (autoExecute && !hasAutoExecuted.current) {
      hasAutoExecuted.current = true;
      const functionsToExecute = initialApiFunctions || apiFunctions;
      if (Object.keys(functionsToExecute).length > 0) {
        executeMultiple(functionsToExecute);
      }
    }
  }, [autoExecute, initialApiFunctions, apiFunctions, executeMultiple]);

  return {
    loading,
    error,
    errors,        // 개별 API 에러들
    results,
    executeMultiple,    // 병렬 실행 Promise.allSettled 방식
    executeSequential,  // 순차 실행
    clearResults
  };
};
