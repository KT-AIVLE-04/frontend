import { Download, Edit, Share2, Trash2 } from "lucide-react";
import React from "react";
import { IconButton } from "../atoms";
import { Card } from "../molecules";

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
      className="overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
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
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {content.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{formatDate(content.createdAt)}</span>
          <span>{content.contentType || content.type}</span>
        </div>

        {showActions && (
          <div className="flex justify-between">
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
