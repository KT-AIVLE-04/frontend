import React from 'react';
import { Label } from './Label';

export function FieldLabel({ 
  label, 
  name, 
  required = false, 
  hasError = false,
  className = "" 
}) {
  if (!label) return null;

  return (
    <Label 
      htmlFor={name} 
      required={required} 
      variant={hasError ? "error" : "default"}
      className={className}
    >
      {label}
    </Label>
  );
}
