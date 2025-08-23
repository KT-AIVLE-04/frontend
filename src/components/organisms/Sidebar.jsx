import { BarChart3, LayoutDashboard, Library, LogOut, Newspaper, Share2, Store, Video } from 'lucide-react';
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
      id: 'post-management',
      label: '게시글 관리',
      icon: <Newspaper size={20} />
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
    <div className="bg-white border-gray-800 flex flex-col shadow-[4px_0px_0px_0px_rgba(0,0,0,0.8)]" style={{ width: '200px', backgroundColor: '#fff67d' }}>
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all duration-150 ${
                activePage === item.id
                  ? 'bg-blue-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]'
                  : 'text-gray-700 hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t-2 border-gray-800">
        <button
          onClick={() => onNavigate('logout')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-all duration-150"
        >
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
}
