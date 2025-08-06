import React from 'react';

export function IconButton({ 
  icon: Icon,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  className = "",
  title = ""
}) {
  const baseClasses = "inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
  
  const variantClasses = {
    primary: "text-blue-600 hover:text-blue-900 hover:bg-blue-50 focus:ring-blue-500",
    secondary: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500",
    danger: "text-red-600 hover:text-red-900 hover:bg-red-50 focus:ring-red-500",
    success: "text-green-600 hover:text-green-900 hover:bg-green-50 focus:ring-green-500"
  };

  const sizeClasses = {
    small: "p-1.5",
    medium: "p-2",
    large: "p-2.5"
  };

  const iconSizes = {
    small: 16,
    medium: 18,
    large: 20
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      <Icon size={iconSizes[size]} />
    </button>
  );
} 