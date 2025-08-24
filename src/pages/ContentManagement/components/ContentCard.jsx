import { Download, Edit, Trash2 } from "lucide-react";
import React from "react";
import { Card } from "../../../components/molecules";

export function ContentCard({
  content,
  onClick,
  onDownload,
  onEdit,
  onDelete,
  showActions = true,
}) {
  // contentType을 기반으로 미디어 타입 판단
  const isVideo = content.contentType?.startsWith("video/");
  // const isImage = content.contentType?.startsWith("image/");

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
          src={content.url}
          alt={content.title || content.originalName}
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
        <h3
          className="font-black mb-3 line-clamp-2 text-gray-800 group-hover:text-blue-700 transition-colors"
          title={content.title || content.originalName}
        >
          {content.title || content.originalName}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-3 font-bold">
          <span className="font-black">{content.originalName}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(content.createdAt)}</span>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 mb-4 font-bold">
          <div>{content.contentType || "미디어"}</div>
          <div>
            <span
              className={`px-2 py-1 text-xs font-black rounded-full border-2 ${
                isVideo
                  ? "bg-blue-500 text-white border-blue-700"
                  : "bg-green-500 text-white border-green-700"
              }`}
            >
              {isVideo ? "영상" : "이미지"}
            </span>
          </div>
        </div>

        {showActions && (
          <div className="flex justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(content.id);
              }}
              className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50 border-2 border-transparent hover:border-blue-200"
            >
              <Download size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(content.id);
              }}
              className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-200"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(content.id);
              }}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 border-2 border-transparent hover:border-red-200"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
