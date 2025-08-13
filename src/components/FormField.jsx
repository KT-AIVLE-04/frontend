import React from 'react';

export function FormField({ 
  label, 
  name, 
  type = "text",
  value, 
  onChange, 
  placeholder, 
  required = false,
  error,
  options = [],
  className = "",
  readOnly = false,
  step
}) {
  const inputClasses = `w-full px-5 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 font-bold text-gray-800 placeholder-gray-500 bg-white ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-400 hover:border-blue-400'
  } ${readOnly ? 'bg-gray-200 cursor-not-allowed border-gray-300' : ''}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select 
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
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
      
      case 'textarea':
        return (
          <textarea 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={3}
            className={inputClasses}
            readOnly={readOnly}
          />
        );
      
      default:
        return (
          <input 
            type={type}
            name={name}
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
  };

  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-black text-gray-800 mb-2 tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-1 font-black">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="mt-2 text-sm text-red-600 font-black flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
} 