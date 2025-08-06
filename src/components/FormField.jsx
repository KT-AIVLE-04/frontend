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
  const inputClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? 'border-red-300' : 'border-gray-300'
  } ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`;

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
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 