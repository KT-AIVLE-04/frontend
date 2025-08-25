import React from "react";

export function Card({
  children,
  className = "",
  variant = "default",
  onClick,
  ...props
}) {
  const baseClasses =
    "bg-white rounded-xl shadow-sm border-2 border-gray-200 group overflow-hidden relative";

  const variantClasses = {
    default: "",
    hover: "hover:border-gray-300 hover:shadow-lg transition-shadow",
    interactive:
      "hover:border-gray-300 hover:shadow-lg transition-shadow cursor-pointer",
  };

  const cursorClass = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${cursorClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
