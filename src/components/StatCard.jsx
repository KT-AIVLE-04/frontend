import React from 'react';
import { Container } from './Container';

export function StatCard({ title, value, icon, change, trend, className = '' }) {
  return (
    <Container variant="hover" className={`p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-100 rounded-xl border-2 border-blue-300">
          {icon}
        </div>
        {change && (
          <div className={`flex items-center font-bold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <span className="text-xs font-black">{change}</span>
            {trend && (
              <>
                {trend === 'up' ? (
                  <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <p className="text-sm font-bold text-gray-600">{title}</p>
      <p className="text-2xl font-black mt-1 text-blue-600">{value}</p>
    </Container>
  );
} 