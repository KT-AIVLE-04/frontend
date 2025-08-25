import React from 'react';

export function Textarea({ 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  className = "",
  readOnly = false,
  name,
  id,
  rows = 3
}) {
  const textareaClasses = `w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 font-bold text-gray-800 placeholder-gray-500 bg-white resize-none ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-400 hover:border-blue-400'
  } ${readOnly ? 'bg-gray-200 cursor-not-allowed border-gray-300' : ''} ${className}`;

  return (
    <textarea 
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className={textareaClasses}
      readOnly={readOnly}
    />
  );
}
