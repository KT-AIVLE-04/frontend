import React from 'react';

export const Tabs = ({
  tabs = [],
  activeTab,
  onTabChange,
  className = "",
  tabClassName = "",
  activeTabClassName = "",
  variant = "default" // "default" | "pills" | "underline"
}) => {
  const getVariantClasses = () => {
    const variants = {
      default: {
        container: "border-b border-gray-200",
        tab: "px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent",
        activeTab: "border-blue-500 text-blue-600"
      },
      pills: {
        container: "bg-gray-100 p-1 rounded-lg",
        tab: "px-3 py-1.5 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900",
        activeTab: "bg-white text-gray-900 shadow-sm"
      },
      underline: {
        container: "",
        tab: "px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 relative",
        activeTab: "text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
      }
    };
    return variants[variant] || variants.default;
  };

  const variantClasses = getVariantClasses();

  return (
    <div className={`${variantClasses.container} ${className}`}>
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              ${variantClasses.tab}
              ${activeTab === tab.id ? variantClasses.activeTab : ''}
              ${tabClassName}
              ${activeTab === tab.id ? activeTabClassName : ''}
            `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            {tab.count && (
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export const TabPanel = ({ 
  children, 
  tabId, 
  activeTab, 
  className = "" 
}) => {
  if (tabId !== activeTab) return null;

  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  );
};
