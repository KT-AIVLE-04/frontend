import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useClickOutside } from '../../hooks';

export const Dropdown = ({
  trigger,
  children,
  className = "",
  dropdownClassName = "",
  placement = "bottom-left" // "bottom-left" | "bottom-right" | "top-left" | "top-right"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  const getPlacementClasses = () => {
    const placements = {
      'bottom-left': 'top-full left-0',
      'bottom-right': 'top-full right-0',
      'top-left': 'bottom-full left-0',
      'top-right': 'bottom-full right-0'
    };
    return placements[placement] || placements['bottom-left'];
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger || (
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <span>드롭다운</span>
            <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={`absolute z-50 mt-1 ${getPlacementClasses()} ${dropdownClassName}`}>
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-48">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ 
  children, 
  onClick, 
  className = "",
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};
