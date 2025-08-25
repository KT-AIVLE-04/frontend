import { useEffect, useMemo, useState } from 'react';

/**
 * 검색과 필터링을 위한 커스텀 훅
 * @param {Array} data - 검색할 데이터 배열
 * @param {string[]} searchFields - 검색할 필드명들
 * @param {Object} options - 검색 옵션
 * @param {number} [options.debounceDelay=300] - 디바운스 지연 시간 (ms)
 * @param {boolean} [options.caseSensitive=false] - 대소문자 구분 여부
 * @param {boolean} [options.exactMatch=false] - 정확한 일치 여부
 * @returns {Object} 검색 상태와 함수들
 * @returns {string} returns.searchTerm - 현재 검색어
 * @returns {string} returns.debouncedSearchTerm - 디바운스된 검색어
 * @returns {Object} returns.filters - 현재 필터들
 * @returns {Array} returns.filteredData - 필터링된 데이터
 * @returns {Function} returns.updateSearchTerm - 검색어 업데이트 함수 (term) => void
 * @returns {Function} returns.updateFilter - 필터 업데이트 함수 (key, value) => void
 * @returns {Function} returns.clearFilters - 필터 초기화 함수 () => void
 * @returns {Function} returns.clearSearch - 검색어 초기화 함수 () => void
 * @returns {Function} returns.clearAll - 모든 검색/필터 초기화 함수 () => void
 * @returns {boolean} returns.hasActiveFilters - 활성 필터 존재 여부
 */
export const useSearch = (data, searchFields = [], options = {}) => {
  const {
    debounceDelay = 300,
    caseSensitive = false,
    exactMatch = false
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // 디바운스 구현
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    let filtered = data;

    // 검색어 필터링
    if (debouncedSearchTerm.trim()) {
      const searchValue = caseSensitive ? debouncedSearchTerm : debouncedSearchTerm.toLowerCase();
      
      filtered = filtered.filter(item => {
        return searchFields.some(field => {
          const fieldValue = item[field];
          if (!fieldValue) return false;
          
          const itemValue = caseSensitive ? fieldValue : fieldValue.toLowerCase();
          
          if (exactMatch) {
            return itemValue === searchValue;
          }
          
          return itemValue.includes(searchValue);
        });
      });
    }

    // 추가 필터 적용
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        filtered = filtered.filter(item => {
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }
          return item[key] === value;
        });
      }
    });

    return filtered;
  }, [data, debouncedSearchTerm, filters, searchFields, caseSensitive, exactMatch]);

  const updateSearchTerm = (term) => {
    setSearchTerm(term);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearAll = () => {
    setSearchTerm('');
    setFilters({});
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    filters,
    filteredData,
    updateSearchTerm,
    updateFilter,
    clearFilters,
    clearSearch,
    clearAll,
    hasActiveFilters: searchTerm.trim() !== '' || Object.values(filters).some(v => v !== null && v !== undefined && v !== '')
  };
};
