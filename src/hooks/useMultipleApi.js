import { useCallback, useEffect, useState } from 'react';

export const useMultipleApi = (apiFunctions = {}, options = {}) => {
  const { onSuccess, onError, autoExecute = false, initialApiFunctions = null } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({}); // 개별 API 에러들을 관리
  const [results, setResults] = useState({});

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
          let result = response;
          if (response && typeof response === 'object') {
            if (response.isSuccess === true && response.result !== undefined) {
              result = response.result;
            } else if (response.isSuccess === false) {
              const errorMessage = response.message || '요청이 실패했습니다.';
              const apiError = new Error(errorMessage);
              apiError.response = response;
              throw apiError;
            }
          }
          return { key, result, status: 'fulfilled' };
        }).catch(err => ({ key, error: err, status: 'rejected' }))
      );

      const responses = await Promise.allSettled(promises);
      
      // 결과와 에러를 분리해서 처리
      const resultsMap = {};
      const errorsMap = {};

      responses.forEach(({ key, result, error, status }) => {
        if (status === 'fulfilled') {
          resultsMap[key] = result;
        } else {
          errorsMap[key] = error;
        }
      });

      setResults(resultsMap);
      setErrors(errorsMap);
      
      // onSuccess 콜백 실행
      if (onSuccess && Object.keys(errorsMap).length === 0) {
        onSuccess(resultsMap);
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
          
          // 백엔드 응답 형식 파싱
          let result = response;
          if (response && typeof response === 'object') {
            if (response.isSuccess === true && response.result !== undefined) {
              result = response.result;
            } else if (response.isSuccess === false) {
              const errorMessage = response.message || '요청이 실패했습니다.';
              const apiError = new Error(errorMessage);
              apiError.response = response;
              throw apiError;
            }
          }
          
          resultsMap[key] = result;
        } catch (err) {
          // 개별 API 실패 시에도 다른 API는 계속 실행
          errorsMap[key] = err;
        }
      }

      setResults(resultsMap);
      setErrors(errorsMap);
      
      // onSuccess 콜백 실행
      if (onSuccess && Object.keys(errorsMap).length === 0) {
        onSuccess(resultsMap);
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

  const executeWithRetry = useCallback(async (customApiCalls = null, maxRetries = 3) => {
    const apiCalls = customApiCalls || apiFunctions;
    if (!apiCalls || Object.keys(apiCalls).length === 0) {
      console.warn('useMultipleApi: 실행할 API 함수가 없습니다.');
      return { results: {}, errors: {} };
    }

    setLoading(true);
    setError(null);
    setErrors({});
    
    const executeWithRetryForApi = async (apiFunction, retries = 0) => {
      try {
        return await apiFunction();
      } catch (err) {
        if (retries < maxRetries) {
          // 지수 백오프: 1초, 2초, 4초...
          const delay = Math.pow(2, retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return executeWithRetryForApi(apiFunction, retries + 1);
        }
        throw err;
      }
    };

    try {
      const apiEntries = Object.entries(apiCalls);
      const promises = apiEntries.map(([key, apiFunction]) => 
        executeWithRetryForApi(apiFunction).then(response => {
          // 백엔드 응답 형식 파싱
          let result = response;
          if (response && typeof response === 'object') {
            if (response.isSuccess === true && response.result !== undefined) {
              result = response.result;
            } else if (response.isSuccess === false) {
              const errorMessage = response.message || '요청이 실패했습니다.';
              const apiError = new Error(errorMessage);
              apiError.response = response;
              throw apiError;
            }
          }
          return { key, result, status: 'fulfilled' };
        }).catch(err => ({ key, error: err, status: 'rejected' }))
      );

      const responses = await Promise.allSettled(promises);
      
      // 결과와 에러를 분리해서 처리
      const resultsMap = {};
      const errorsMap = {};

      responses.forEach(({ key, result, error, status }) => {
        if (status === 'fulfilled') {
          resultsMap[key] = result;
        } else {
          errorsMap[key] = error;
        }
      });

      setResults(resultsMap);
      setErrors(errorsMap);

      // onSuccess 콜백 실행
      if (onSuccess && Object.keys(errorsMap).length === 0) {
        onSuccess(resultsMap);
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
    if (autoExecute) {
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
    executeMultiple,    // 병렬 실행 (Promise.allSettled 방식) - 모든 결과를 받음
    executeSequential,  // 순차 실행
    executeWithRetry,   // 재시도 로직 포함
    clearResults
  };
};
