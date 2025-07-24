import { BarChart3, LayoutDashboard, Library, LogOut, Share2, Store, Video } from 'lucide-react';
import React from 'react';

export function Sidebar({ activePage, onNavigate }) {
  const navItems = [
    {
      id: 'dashboard',
      label: '대시보드',
      icon: <LayoutDashboard size={20} />
    },
    {
      id: 'store-management',
      label: '매장 관리',
      icon: <Store size={20} />
    },
    {
      id: 'content-creation',
      label: '콘텐츠 제작',
      icon: <Video size={20} />
    },
    {
      id: 'content-management',
      label: '콘텐츠 관리',
      icon: <Library size={20} />
    },
    {
      id: 'sns-integration',
      label: 'SNS 연동',
      icon: <Share2 size={20} />
    },
    {
      id: 'analytics',
      label: '성과 분석',
      icon: <BarChart3 size={20} />
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">콘텐츠 플랫폼</h1>
      </div>
      <nav className="flex-1 pt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => onNavigate(item.id)}
                className={`flex items-center w-full px-4 py-3 text-left ${
                  activePage === item.id 
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button 
          className="flex items-center text-gray-600 hover:text-red-600" 
          onClick={() => onNavigate('login')}
        >
          <LogOut size={20} className="mr-2" />
          로그아웃
        </button>
      </div>
    </div>
  );
} 