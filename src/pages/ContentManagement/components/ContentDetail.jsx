import React from "react";
import {
  Calendar,
  Tag,
  ExternalLink,
  Youtube,
  Instagram,
  X,
  Trash2,
  Download,
  Edit,
  Play,
  Video,
  Image,
} from "lucide-react";
import { formatDateTime } from "../../../utils/formatters";
import { isVideoFile, isImageFile } from "../../../utils/media";

export function ContentDetail({
  content,
  onClose,
  onDownload,
  onEdit,
  onDelete,
}) {
  if (!content) {
    return null;
  }

  const handleDeleteContent = () => {
    if (onDelete) {
      onDelete(content.id);
    }
  };

  const handleCloseDetail = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(content.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(content.id);
    }
  };

  const getContentTypeIcon = (content) => {
    const iconProps = { size: 20 };

    if (
      isVideoFile(
        content.originalName,
        content.contentType,
        content.url,
        content.type
      )
    ) {
      return <Video {...iconProps} className="text-red-500" />;
    } else if (
      isImageFile(
        content.originalName,
        content.contentType,
        content.url,
        content.type
      )
    ) {
      return <Image {...iconProps} className="text-green-500" />;
    } else {
      return <ExternalLink {...iconProps} className="text-gray-500" />;
    }
  };

  const isContentModified = () => {
    if (!content.updatedAt || !content.createdAt) return false;
    const createdDate = new Date(content.createdAt);
    const updatedDate = new Date(content.updatedAt);
    return updatedDate.getTime() !== createdDate.getTime();
  };

  const isVideo = isVideoFile(
    content.originalName,
    content.contentType,
    content.url,
    content.type
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <div className="flex items-center gap-3">
            {getContentTypeIcon(content)}
            <span className="text-lg font-semibold text-gray-900">
              콘텐츠 상세보기
            </span>
          </div>
          <button
            onClick={handleCloseDetail}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* 왼쪽: 미디어 영역 */}
          <div className="lg:w-7/12 bg-gray-100 flex items-center justify-center relative">
            {content.url ? (
              <div className="w-full h-full min-h-[300px] lg:min-h-[500px] relative">
                {isVideo ? (
                  <div className="w-full h-full relative bg-black flex items-center justify-center">
                    <video
                      className="w-full h-full object-contain"
                      controls
                      preload="none"
                      onLoadedMetadata={() =>
                        console.log("비디오 로드 성공:", content.url)
                      }
                      onError={(e) => {
                        console.error("비디오 로드 실패:", content.url);
                        console.error("Error:", e);
                      }}
                      onCanPlay={() => console.log("비디오 재생 준비 완료")}
                    >
                      <source
                        src={content.url}
                        type={content.contentType || "video/mp4"}
                      />
                      {/* 대체 텍스트와 다운로드 링크 */}
                      <div className="text-white text-center p-4">
                        <p className="mb-2">비디오를 재생할 수 없습니다.</p>
                        <a
                          href={content.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline"
                        >
                          직접 다운로드하여 재생하기
                        </a>
                      </div>
                    </video>

                    {/* 비디오 정보 오버레이 */}
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm">
                      {content.width}×{content.height} •{" "}
                      {content.durationSeconds}초
                    </div>
                  </div>
                ) : (
                  <img
                    src={content.url}
                    alt={content.title || "콘텐츠 이미지"}
                    className="w-full h-full object-contain"
                    onLoad={() => console.log("이미지 로드 성공:", content.url)}
                    onError={(e) => {
                      console.error("이미지 로드 실패:", content.url);
                      console.error("Error:", e);
                    }}
                  />
                )}

                {/* 비디오일 때만 재생 버튼 오버레이 */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <button className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-4 transition-all duration-200">
                      <Play
                        className="w-12 h-12 text-white"
                        fill="currentColor"
                      />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full min-h-[300px] lg:min-h-[500px] flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <p>미디어를 불러올 수 없습니다.</p>
                  <p className="text-sm mt-2">
                    URL: {content.url || "URL 없음"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 정보 영역 */}
          <div className="lg:w-5/12 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              {/* 제목 */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {content.title}
              </h2>

              {/* 생성 정보 */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">생성 정보</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar size={16} className="text-gray-400" />
                  생성일 : {formatDateTime(content.createdAt)}
                </div>

                {/* 수정일 - 실제로 수정되었을 때만 표시 */}
                {isContentModified() && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar size={16} className="text-gray-400" />
                    수정일 : {formatDateTime(content.updatedAt)}
                  </div>
                )}

                {/* 콘텐츠 타입 */}
                {content.contentType && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Tag size={16} className="text-gray-400" />
                    콘텐츠 타입 : {content.contentType}
                  </div>
                )}

                {/* 해상도 정보 */}
                {(content.width || content.height) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <ExternalLink size={16} className="text-gray-400" />
                    해상도 : {content.width || 0} × {content.height || 0}
                  </div>
                )}
              </div>
            </div>

            {/* 하단 액션 버튼들 */}
            <div className="border-t border-gray-300 p-4">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
                >
                  <Download size={16} />
                  다운로드
                </button>

                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors font-medium"
                >
                  <Edit size={16} />
                  수정
                </button>

                <button
                  onClick={handleDeleteContent}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
                >
                  <Trash2 size={16} />
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
