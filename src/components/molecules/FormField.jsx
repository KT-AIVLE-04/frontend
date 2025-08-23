import React from 'react';
import { Input, Label, Select, Textarea } from '../atoms';

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
  step,
  rows
}) {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <Select 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            readOnly={readOnly}
            options={options}
            error={error}
          />
        );
      
      case 'textarea':
        return (
          <Textarea 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            readOnly={readOnly}
            error={error}
            rows={rows}
          />
        );
      
      default:
        return (
          <Input 
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            readOnly={readOnly}
            error={error}
            step={step}
          />
        );
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <Label htmlFor={name} required={required} variant={error ? "error" : "default"}>
          {label}
        </Label>
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
