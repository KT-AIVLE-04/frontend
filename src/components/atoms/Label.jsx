import React from 'react';

export function Label({ 
  children, 
  htmlFor, 
  required = false,
  className = "",
  variant = "default"
}) {
  const baseClasses = "block text-sm font-black text-gray-800 mb-2 tracking-wide";
  
  const variantClasses = {
    default: "",
    error: "text-red-600",
    success: "text-green-600"
  };

  return (
    <label htmlFor={htmlFor} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
      {required && <span className="text-red-500 ml-1 font-black">*</span>}
    </label>
  );
}
