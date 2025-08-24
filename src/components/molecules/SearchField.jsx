import { Search } from 'lucide-react';
import React from 'react';
import { IconButton, Input } from '../atoms';

export function SearchField({ 
  value, 
  onChange, 
  onSearch,
  placeholder = "검색...",
  className = "",
  disabled = false
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-500"/>
      </div>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 pr-12"
        disabled={disabled}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <IconButton
          icon={Search}
          variant="primary"
          size="small"
          onClick={handleSubmit}
          disabled={disabled}
          title="검색"
        />
      </div>
    </form>
  );
}
