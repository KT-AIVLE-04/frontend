import { Image as ImageIcon, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { contentApi } from '../../api/content';
import { ContentCard, EmptyStateBox, ErrorPage, LoadingSpinner } from '../../components';
import { SearchFilter, TabMenu } from './components';

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
        fetchContents();
      } catch (error) {
        console.error('콘텐츠 삭제 실패:', error);
        alert('콘텐츠 삭제에 실패했습니다.');
      }
    }
  };

  const handleDownload = async (contentId) => {
    try {
      const response = await contentApi.downloadContent(contentId);
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
    return <ErrorPage title="콘텐츠 목록 로딩 실패" message={error}/>;
  }

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <div className="flex-1 w-full">
      <h1 className="text-2xl font-bold mb-6">콘텐츠 관리</h1>

      <TabMenu 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        videoCount={videos.length} 
      />

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onSearch={handleSearch}
      />

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
        <EmptyStateBox
          icon={ImageIcon}
          title="이미지가 없습니다"
          description="생성된 이미지가 여기에 표시됩니다"
          actionText="이미지 생성하기"
          onAction={() => {}}
        />
      )}

      {activeTab === 'posts' && (
        <EmptyStateBox
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