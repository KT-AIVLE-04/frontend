import { Upload, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { contentApi } from "../../api/content";
import { EmptyState, ErrorPage, LoadingSpinner } from "../../components";
import { Content } from "../../models";
import { SearchFilter, ContentCard } from "./components";
import { ContentDetail } from "./components/ContentDetail";

export function ContentManagement() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedContent, setSelectedContent] = useState(null);
  const [uploading, setUploading] = useState(false);
  // const [contentTypeFilter, setContentTypeFilter] = useState({
  //   videos: true,
  //   images: true,
  // });

  useEffect(() => {
    fetchContents();
  }, [sortBy]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);

      const getContentsResponse = await contentApi.getContents();
      const getContentsResponseData = getContentsResponse.data?.result || [];

      //   "result": [
      //   {
      //     "id": 0,
      //     "url": "string",
      //     "title": "string",
      //     "originalName": "string",
      //     "objectKey": "string",
      //     "contentType": "string",
      //     "createdAt": "2025-08-21T18:16:41.442Z",
      //     "updatedAt": "2025-08-21T18:16:41.442Z"
      //   }
      // ];
      const contentModels = Content.fromResponseArray(getContentsResponseData);
      setContents(contentModels);
    } catch (error) {
      console.error("콘텐츠 목록 로딩 실패:", error);
      setError("콘텐츠 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadContentResponse = await contentApi.uploadContent(file);
      const uploadContentResponseData = uploadContentResponse.data.result;
      const newContentModel = Content.fromResponse(uploadContentResponseData);
      setContents((prev) => [newContentModel, ...prev]);
      alert("파일이 성공적으로 업로드되었습니다.");
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      event.target.value = ""; // 파일 input 초기화
    }
  };

  const handleCardClick = async (contentId) => {
    try {
      const getContentResponse = await contentApi.getContent(contentId);
      const getContentResponseData = getContentResponse.data?.result || [];
      // "result": {
      //   "id": 0,
      //   "url": "string",
      //   "title": "string",
      //   "originalName": "string",
      //   "objectKey": "string",
      //   "contentType": "string",
      //   "width": 0,                //getContents는 없음
      //   "height": 0,               //getContents는 없음
      //   "durationSeconds": 0,      //getContents는 없음
      //   "bytes": 0,                //getContents는 없음
      //   "createdAt": "2025-08-22T07:04:57.455Z",
      //   "updatedAt": "2025-08-22T07:04:57.455Z"
      // },

      const contentModel = Content.fromResponse(getContentResponseData);
      setSelectedContent(contentModel);
    } catch (error) {
      console.error("콘텐츠 상세 조회 실패:", error);
      alert("콘텐츠 상세 조회에 실패했습니다.");
      setSelectedContent(null);
    }
  };

  const handleCloseDetail = () => {
    setSelectedContent(null);
  };

  const handleDelete = async (contentId) => {
    if (window.confirm("정말로 이 콘텐츠를 삭제하시겠습니까?")) {
      try {
        await contentApi.deleteContent(contentId);
        setContents((prev) => prev.filter((c) => c.id !== contentId));
        setSelectedContent(null);
        alert("콘텐츠가 삭제되었습니다.");
      } catch (error) {
        console.error("콘텐츠 삭제 실패:", error);
        alert("콘텐츠 삭제에 실패했습니다.");
      }
    }
  };

  const handleEdit = async (content) => {
    const newTitle = prompt("새 제목을 입력하세요:", content.title);
    if (newTitle && newTitle !== content.title) {
      try {
        const updateContentTitleResponse = await contentApi.updateContentTitle(
          content.id,
          newTitle
        );
        const updateContentTitleResponseData =
          updateContentTitleResponse.data.result;
        const updatedContentModel = Content.fromResponse(
          updateContentTitleResponseData
        );

        setContents((prev) =>
          prev.map((c) => (c.id === content.id ? updatedContentModel : c))
        );

        if (selectedContent && selectedContent.id === content.id) {
          setSelectedContent(updatedContentModel);
        }

        alert("제목이 수정되었습니다.");
      } catch (error) {
        console.error("제목 수정 실패:", error);
        alert("제목 수정에 실패했습니다.");
      }
    }
  };

  const handleDownload = (content) => {
    window.open(content.url, "_blank");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = contents;

    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setContents(filtered);
  };

  if (error) {
    return <ErrorPage title="콘텐츠 목록 로딩 실패" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-1 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">콘텐츠 관리</h1>

        {/* 파일 업로드 버튼 */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
            <Upload size={16} />
            {uploading ? "업로드 중..." : "파일 업로드"}
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onSearch={handleSearch}
      />

      {contents.length === 0 ? (
        <EmptyState
          icon={Video}
          title="콘텐츠가 없습니다"
          description="생성된 콘텐츠가 여기에 표시됩니다."
          actionText="파일 업로드하기"
          onAction={() => document.querySelector('input[type="file"]').click()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contents.map((content) => (
            <ContentCard
              content={content}
              onClick={() => handleCardClick(content.id)}
              onDownload={() => handleDownload(content)}
              onEdit={() => handleEdit(content)}
              onDelete={() => handleDelete(content.id)}
            />
          ))}
        </div>
      )}

      {/* 상세보기 컴포넌트 */}
      {selectedContent && (
        <ContentDetail
          content={selectedContent}
          onClose={handleCloseDetail}
          onDownload={() => handleDownload(selectedContent)}
          onEdit={() => handleEdit(selectedContent)}
          onDelete={() => handleDelete(selectedContent.id)}
        />
      )}
    </div>
  );
}
