import React from 'react';

export function Card({ 
  children, 
  className = "", 
  variant = "default",
  onClick,
  hover = false,
  ...props 
}) {
  const baseClasses = "bg-white rounded-2xl border-2 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]";
  
  const variantClasses = {
    default: "",
    hover: "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-150 transform hover:translate-x-0.5 hover:translate-y-0.5",
    interactive: "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-150 transform hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
  };

  const hoverClass = hover ? "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-150 transform hover:translate-x-0.5 hover:translate-y-0.5" : "";
  const cursorClass = onClick ? "cursor-pointer" : "";

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClass} ${cursorClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
