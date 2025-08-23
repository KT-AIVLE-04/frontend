import React from 'react';

export const Header = ({
  title,
  subtitle,
  actions,
  breadcrumb,
  className = "",
  variant = "default" // "default" | "compact" | "hero"
}) => {
  const getVariantClasses = () => {
    const variants = {
      default: "py-6",
      compact: "py-4",
      hero: "py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
    };
    return variants[variant] || variants.default;
  };

  return (
    <header className={`${getVariantClasses()} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        {breadcrumb && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumb.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-2 text-gray-400">/</span>
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className={variant === "hero" ? "text-white/80" : "text-gray-900"}>
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            {title && (
              <h1 className={`text-2xl font-bold ${variant === "hero" ? "text-white" : "text-gray-900"} ${variant === "hero" ? "text-3xl" : ""}`}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className={`mt-1 text-sm ${variant === "hero" ? "text-white/80" : "text-gray-500"}`}>
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-3 ml-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// 페이지 헤더 (제목 + 액션)
export const PageHeader = ({ title, subtitle, actions, className = "" }) => {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};
