import React from 'react';

export function Input({ 
  type = "text",
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  className = "",
  readOnly = false,
  step,
  name,
  id
}) {
  const inputClasses = `w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 font-bold text-gray-800 placeholder-gray-500 bg-white ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-400 hover:border-blue-400'
  } ${readOnly ? 'bg-gray-200 cursor-not-allowed border-gray-300' : ''} ${className}`;

  return (
    <input 
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={inputClasses}
      readOnly={readOnly}
      step={step}
    />
  );
}
