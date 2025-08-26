import React from 'react';

export function FieldError({ 
  error, 
  className = "" 
}) {
  if (!error) return null;

  return (
    <p className={`mt-2 text-sm text-red-600 font-black flex items-center ${className}`}>
      <span className="mr-1">⚠️</span>
      {error}
    </p>
  );
}
