export const DateRangeSelector = ({ dateRange, setDateRange }) => {
  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-500 mr-2">기간:</span>
      <select 
        value={dateRange} 
        onChange={(e) => setDateRange(e.target.value)}
        className="pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="last7">최근 7일</option>
        <option value="last30">최근 30일</option>
        <option value="last90">최근 90일</option>
        <option value="custom">사용자 지정</option>
      </select>
    </div>
  );
}; 