import { Image as ImageIcon, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
// import { contentApi } from '../../api/content'; // Temporarily disable real API call
import { EmptyStateBox, ErrorPage, LoadingSpinner, PostCard } from '../../components';
import { SearchFilter, TabMenu, VideoDetail } from './components';

// --- Mock Data for UI Development ---
const mockContents = [
  {
    id: 1,
    type: 'video',
    title: '고양이',
    thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJfl0dmkj_SzuQJmL_P4TRJ2SlMKYOy-fQjQ&s',
    author: '유저 1',
    views: 1500,
    createdAt: '2024-08-17',
    description: '첫 번째 목업 비디오에 대한 상세 설명입니다. 아주 긴 설명이 여기에 들어갈 수 있습니다. 이 설명은 여러 줄에 걸쳐 표시될 수 있습니다.',
    likes: 120,
    comments: 45
  },
  {
    id: 2,
    type: 'video',
    title: '휴머노이드 로봇',
    thumbnailUrl: 'https://www.cio.com/wp-content/uploads/2025/02/3830961-0-03900400-1740373791-shutterstock_2482705481.jpg?resize=1536%2C864&quality=50&strip=all',
    author: '유저 2',
    views: 2300,
    createdAt: '2024-08-16',
    description: '두 번째 목업 비디오에 대한 상세 설명입니다.',
    likes: 89,
    comments: 23
  },
  {
    id: 3,
    type: 'video',
    title: '옵티머스',
    thumbnailUrl: 'https://cdn.irobotnews.com/news/photo/202312/33502_71613_246.png',
    author: '유저 1',
    views: 800,
    createdAt: '2024-08-15',
    description: '세 번째 목업 비디오에 대한 상세 설명입니다.',
    likes: 67,
    comments: 12
  },
  {
    id: 4,
    type: 'video',
    title: '강아지',
    thumbnailUrl: 'https://cdn.pixabay.com/photo/2024/02/26/19/39/monochrome-image-8598798_1280.jpg',
    author: '유저 3',
    views: 5000,
    createdAt: '2024-08-14',
    description: '네 번째 목업 비디오에 대한 상세 설명입니다.',
    likes: 234,
    comments: 78
  },
];
// --- End of Mock Data ---

export function PostManagement() {
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchContents();
  }, [activeTab, sortBy]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      setVideos(mockContents);
    } catch (error) {
      console.error('콘텐츠 목록 로딩 실패:', error);
      setError('콘텐츠 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
  };

  const handleDelete = async (contentId) => {
    if (window.confirm(`(목업) 정말로 콘텐츠 ID ${contentId}를 삭제하시겠습니까?`)) {
      console.log(`Deleted content ${contentId}`);
      setVideos(prevVideos => prevVideos.filter(v => v.id !== contentId));
      if (selectedPost && selectedPost.id === contentId) {
        handleCloseDetail();
      }
    }
  };

  const handleEdit = (contentId) => {
    console.log(`Edit content ${contentId}`);
    alert(`(목업) 콘텐츠 ID ${contentId} 수정`);
  };

  const handleDownload = (contentId) => {
    console.log(`Download content ${contentId}`);
    alert(`(목업) 콘텐츠 ID ${contentId} 다운로드`);
  };

  const handleShare = (contentId) => {
    console.log(`Share content ${contentId}`);
    alert(`(목업) 콘텐츠 ID ${contentId} 공유`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = mockContents.filter(content =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setVideos(filtered);
    console.log(`Searching for: ${searchTerm}`);
  };

  if (error) {
    return <ErrorPage title="콘텐츠 목록 로딩 실패" message={error}/>;
  }

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <div className="flex-1 w-full relative">
      <h1 className="text-2xl font-bold mb-6">게시물 관리</h1>

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

      {videos.length === 0 && activeTab === 'videos' ? (
        <EmptyStateBox
          icon={Video}
          title="비디오가 없습니다"
          description="생성된 비디오가 여기에 표시됩니다."
        />
      ) : null}

      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <PostCard
              key={video.id}
              content={video}
              onClick={() => handleCardClick(video)}
              onEdit={() => handleEdit(video.id)}
              onDelete={() => handleDelete(video.id)}
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

      {selectedPost && (
        <VideoDetail
          video={selectedPost}
          onClose={handleCloseDetail}
          handleDownload={handleDownload}
          handleEdit={handleEdit}
          handleShare={handleShare}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}