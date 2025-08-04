export const TabMenu = ({ activeTab, setActiveTab, videoCount }) => {
  const tabs = [
    { id: 'videos', label: '숏폼/영상', count: videoCount },
    { id: 'images', label: '이미지', count: 0 },
    { id: 'posts', label: '게시글', count: 0 }
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </nav>
    </div>
  );
}; 