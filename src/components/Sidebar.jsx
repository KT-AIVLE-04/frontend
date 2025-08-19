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
      id: 'post-management',
      label: '게시글 관리',
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
    <div className="bg-white border-gray-800 flex flex-col shadow-[4px_0px_0px_0px_rgba(0,0,0,0.8)]" style={{ width: '200px', backgroundColor: '#fff67d' }}>
      <nav className="flex-1 pt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => onNavigate(item.id)}
                className={`flex items-center w-full px-4 py-3 text-left font-bold transition-all duration-150 ${
                  activePage === item.id 
                    ? 'bg-blue-100 text-black' 
                    : 'text-gray-700 hover:bg-blue-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t-2" style={{backgroundColor: '#ffb8b8'}}>
        <button 
          className="flex items-center text-gray-700 hover:text-red-600 font-bold transition-colors duration-150" 
          onClick={() => onNavigate('login')}
        >
          <LogOut size={20} className="mr-2" />
          로그아웃
        </button>
      </div>
    </div>
  );
} 