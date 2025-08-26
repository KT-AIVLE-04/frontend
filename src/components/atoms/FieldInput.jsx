import React from 'react';
import { Input, Select, Textarea } from './index';

export function FieldInput({ 
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  readOnly = false,
  error = false,
  options = [],
  step,
  rows,
  className = ""
}) {
  const commonProps = {
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    required,
    readOnly,
    error
  };

  switch (type) {
    case 'select':
      return (
        <Select 
          {...commonProps}
          options={options}
          className={className}
        />
      );
    
    case 'textarea':
      return (
        <Textarea 
          {...commonProps}
          rows={rows}
          className={className}
        />
      );
    
    default:
      return (
        <Input 
          type={type}
          {...commonProps}
          step={step}
          className={className}
        />
      );
  }
}
