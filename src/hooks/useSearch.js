import { useEffect, useMemo, useState } from 'react';

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
