import { ChevronDown, Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { Container } from '../../../components/Container';

export const SearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  sortBy, 
  setSortBy, 
  onSearch,
  contentTypeFilter,
  setContentTypeFilter 
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const handleContentTypeChange = (type) => {
    setContentTypeFilter(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <Container className="mb-6 p-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500"/>
            </div>
            <form onSubmit={onSearch}>
              <input
                type="text"
                placeholder="콘텐츠 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border-2 border-gray-400 rounded-2xl w-full focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 font-bold text-gray-700"
              />
            </form>
          </div>
        </div>

        <div className="flex space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center px-4 py-3 border-2 border-gray-400 rounded-2xl bg-white text-sm font-black text-gray-700 hover:bg-gray-100 transition-all duration-150">
              <Filter size={16} className="mr-2"/>
              필터
              <ChevronDown size={16} className="ml-1"/>
            </button>
            
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border-2 border-gray-400 rounded-2xl shadow-lg z-10">
                <div className="p-4">
                  <div className="text-sm font-black text-gray-700 mb-3">콘텐츠 타입</div>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contentTypeFilter.videos}
                        onChange={() => handleContentTypeChange('videos')}
                        className="mr-3 w-4 h-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-bold text-gray-700">숏폼/영상</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contentTypeFilter.images}
                        onChange={() => handleContentTypeChange('images')}
                        className="mr-3 w-4 h-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-bold text-gray-700">이미지</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <select
            className="px-4 py-3 border-2 border-gray-400 rounded-2xl bg-white text-sm font-black text-gray-700 hover:bg-gray-100 transition-all duration-150"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">최신순</option>
            <option value="popular">인기순</option>
            <option value="views">조회수순</option>
          </select>
        </div>
      </div>
      
      {/* 필터 드롭다운 외부 클릭 시 닫기 */}
      {showFilterDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowFilterDropdown(false)}
        />
      )}
    </Container>
  );
}; 