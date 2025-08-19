import { Container } from '../../../components/Container';

export const TabMenu = ({ activeTab, setActiveTab, videoCount }) => {
  const tabs = [
    { id: 'videos', label: '숏폼/영상', count: videoCount },
    { id: 'images', label: '이미지', count: 0 },
    { id: 'posts', label: '게시글', count: 0 }
  ];

  return (
    <Container className="mb-6 p-4">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 rounded-xl font-black text-sm transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white border-2 border-blue-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]'
                : 'text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </nav>
    </Container>
  );
}; 