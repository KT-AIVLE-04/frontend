import { ChevronDown, Search, X } from "lucide-react";
import { Card } from "../../../components/molecules";

export const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  onSearch,
}) => {
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(e);
    }
  };

  return (
    <Card className="p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-4 h-[56px]">
        {/* 검색 입력 영역 */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search
                  size={20}
                  className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="콘텐츠 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white
                         placeholder-gray-400 transition-all duration-200 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            정렬 :
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 
                       text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                       cursor-pointer min-w-[120px]"
            >
              <option value="recent">최신순</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
