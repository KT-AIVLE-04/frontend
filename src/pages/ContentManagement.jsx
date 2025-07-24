import { ChevronDown, Filter, Image as ImageIcon, Search, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { contentApi } from '../api/content';
import { ContentCard, ErrorPage, LoadingSpinner } from '../components';

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchContents();
  }, [activeTab, sortBy]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        type: activeTab === 'videos' ? 'video' : activeTab === 'images' ? 'image' : 'post',
        sortBy,
        search: searchTerm
      };
      
      const response = await contentApi.getContents(params);
      setVideos(response.data?.result || []);
    } catch (error) {
      console.error('콘텐츠 목록 로딩 실패:', error);
      setError('콘텐츠 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) {
      try {
        await contentApi.deleteContent(contentId);
        fetchContents(); // 목록 새로고침
      } catch (error) {
        console.error('콘텐츠 삭제 실패:', error);
        alert('콘텐츠 삭제에 실패했습니다.');
      }
    }
  };

  const handleDownload = async (contentId) => {
    try {
      const response = await contentApi.downloadContent(contentId);
      // 다운로드 로직 (실제로는 파일 다운로드 처리)
      console.log('다운로드 완료:', response.data);
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('다운로드에 실패했습니다.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchContents();
  };

  if (error) {
    return <ErrorPage title="콘텐츠 목록 로딩 실패" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">콘텐츠 관리</h1>
      
      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('videos')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'videos' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            숏폼/영상 ({videos.length})
          </button>
          <button 
            onClick={() => setActiveTab('images')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'images' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            이미지 (0)
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'posts' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            게시글 (0)
          </button>
        </nav>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <form onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="콘텐츠 검색..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </form>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter size={16} className="mr-2" />
            필터
            <ChevronDown size={16} className="ml-1" />
          </button>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">최신순</option>
            <option value="popular">인기순</option>
            <option value="views">조회수순</option>
          </select>
        </div>
      </div>

      {/* 콘텐츠 목록 */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <ContentCard
              key={video.id}
              content={video}
              onDownload={handleDownload}
              onShare={() => {}}
              onEdit={() => {}}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {activeTab === 'images' && (
        <EmptyState
          icon={ImageIcon}
          title="이미지가 없습니다"
          description="생성된 이미지가 여기에 표시됩니다"
          actionText="이미지 생성하기"
          onAction={() => {}}
        />
      )}

      {activeTab === 'posts' && (
        <EmptyState
          icon={Video}
          title="게시글이 없습니다"
          description="생성된 게시글이 여기에 표시됩니다"
          actionText="게시글 생성하기"
          onAction={() => {}}
        />
      )}
    </div>
  );
} 