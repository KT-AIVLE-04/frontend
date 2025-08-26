import React from 'react';

export function Select({ 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  className = "",
  readOnly = false,
  name,
  id,
  options = []
}) {
  const selectClasses = `w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 font-bold text-gray-800 bg-white ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-400 hover:border-blue-400'
  } ${readOnly ? 'bg-gray-200 cursor-not-allowed border-gray-300' : ''} ${className}`;

  return (
    <select 
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      className={selectClasses}
      required={required}
      disabled={readOnly}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
