import { ChevronDown, Filter, Search } from 'lucide-react';
import { Container } from '../../../components/Container';

export const SearchFilter = ({ searchTerm, setSearchTerm, sortBy, setSortBy, onSearch }) => {
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
          <button
            className="flex items-center px-4 py-3 border-2 border-gray-400 rounded-2xl bg-white text-sm font-black text-gray-700 hover:bg-gray-100 transition-all duration-150">
            <Filter size={16} className="mr-2"/>
            필터
            <ChevronDown size={16} className="ml-1"/>
          </button>
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
    </Container>
  );
}; 