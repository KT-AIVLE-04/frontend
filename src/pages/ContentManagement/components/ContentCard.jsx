import { Download, Edit, Share2, Trash2 } from "lucide-react";
import React from "react";
import { IconButton } from "../../../components/atoms";
import { Card } from "../../../components/molecules";

export function ContentCard({
  content,
  onClick,
  onDownload,
  onEdit,
  onShare,
  onDelete,
  showActions = true,
}) {
  // contentType을 기반으로 미디어 타입 판단
  const isVideo =
    content.contentType?.startsWith("video/") || content.type === "video";
  const isImage =
    content.contentType?.startsWith("image/") || content.type === "image";

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 카드 클릭 핸들러
  const handleCardClick = () => {
    if (onClick) {
      onClick(content);
    }
  };

  return (
    <Card
      variant="hover"
      className="overflow-hidden group cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      <div className="relative flex-shrink-0">
        <img
          src={content.url || content.thumbnailUrl || content.thumbnail}
          alt={content.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-150"
        />

        {/* 영상인 경우 재생 버튼 오버레이 */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {content.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="font-semibold">{formatDate(content.createdAt)}</span>
          <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
            {content.contentType || content.type}
          </span>
        </div>

        {/* 파일 크기 정보 추가 */}
        {content.size && (
          <div className="text-xs text-gray-500 mb-4">
            파일 크기: {formatFileSize(content.size)}
          </div>
        )}

        {showActions && (
          <div className="flex justify-between mt-auto">
            <IconButton
              icon={Download}
              variant="secondary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(content.id);
              }}
              title="다운로드"
            />
            <IconButton
              icon={Share2}
              variant="secondary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(content.id);
              }}
              title="공유"
            />
            <IconButton
              icon={Edit}
              variant="secondary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(content.id);
              }}
              title="편집"
            />
            <IconButton
              icon={Trash2}
              variant="danger"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(content.id);
              }}
              title="삭제"
            />
          </div>
        )}
      </div>
    </Card>
  );
}

// 파일 크기 포맷팅 함수
function formatFileSize(bytes) {
  if (!bytes) return '';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
