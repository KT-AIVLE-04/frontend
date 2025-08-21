import React from 'react';

export function Button({ 
  children, 
  variant = "primary", 
  size = "medium",
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = "button",
  className = ""
}) {
  const baseClasses = "inline-flex items-center justify-center font-black rounded-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] transform hover:translate-x-0.5 hover:translate-y-0.5";
  
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-700 focus:ring-blue-200",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white border-2 border-gray-700 focus:ring-gray-200",
    outline: "border-2 border-gray-400 text-gray-700 bg-white hover:bg-gray-100 focus:ring-gray-200",
    danger: "bg-red-500 hover:bg-red-600 text-white border-2 border-red-700 focus:ring-red-200",
    success: "bg-green-500 hover:bg-green-600 text-white border-2 border-green-700 focus:ring-green-200"
  };

  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base", 
    large: "px-8 py-4 text-lg"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${className} ${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} }`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {Icon && !loading && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
} 