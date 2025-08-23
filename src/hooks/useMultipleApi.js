import { useCallback, useState } from 'react';

export const useMultipleApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({});

  const executeMultiple = useCallback(async (apiCalls) => {
    setLoading(true);
    setError(null);
    
    try {
      // apiCalls는 { key: apiFunction, ... } 형태
      const apiEntries = Object.entries(apiCalls);
      const promises = apiEntries.map(([key, apiFunction]) => 
        apiFunction().then(result => ({ key, result }))
      );

      const responses = await Promise.all(promises);
      
      // 결과를 key-value 형태로 변환
      const resultsMap = responses.reduce((acc, { key, result }) => {
        acc[key] = result;
        return acc;
      }, {});

      setResults(resultsMap);
      return resultsMap;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeSequential = useCallback(async (apiCalls) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultsMap = {};
      
      for (const [key, apiFunction] of Object.entries(apiCalls)) {
        try {
          const result = await apiFunction();
          resultsMap[key] = result;
        } catch (err) {
          // 개별 API 실패 시에도 다른 API는 계속 실행
          resultsMap[key] = { error: err };
        }
      }

      setResults(resultsMap);
      return resultsMap;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeWithRetry = useCallback(async (apiCalls, maxRetries = 3) => {
    setLoading(true);
    setError(null);
    
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
        executeWithRetryForApi(apiFunction).then(result => ({ key, result }))
      );

      const responses = await Promise.all(promises);
      
      const resultsMap = responses.reduce((acc, { key, result }) => {
        acc[key] = result;
        return acc;
      }, {});

      setResults(resultsMap);
      return resultsMap;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults({});
    setError(null);
  }, []);

  return {
    loading,
    error,
    results,
    executeMultiple,    // 병렬 실행 (Promise.all)
    executeSequential,  // 순차 실행
    executeWithRetry,   // 재시도 로직 포함
    clearResults
  };
};
