import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routes';

export function PageNavigation({ title, showBack = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: '대시보드', route: ROUTES.DASHBOARD },
    { name: '콘텐츠 제작', route: ROUTES.CONTENT_CREATION },
    { name: '콘텐츠 관리', route: ROUTES.CONTENT_MANAGEMENT },
    { name: '성과 분석', route: ROUTES.ANALYTICS },
    { name: 'SNS 연동', route: ROUTES.SNS_INTEGRATION },
    { name: '매장 관리', route: ROUTES.STORE_MANAGEMENT },
  ];

  const isActive = (route) => location.pathname === route;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex space-x-3">
          {navigationItems.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.8)] transform hover:translate-x-0.5 hover:translate-y-0.5 ${
                isActive(item.route)
                  ? 'text-white bg-[#d3b4ff] border-2 border-purple-600'
                  : 'text-gray-700 hover:text-gray-900 border-2 border-gray-400 hover:border-[#d3b4ff]'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 