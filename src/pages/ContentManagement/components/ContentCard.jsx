import { Download, Edit, Trash2, Video, Image, Calendar } from "lucide-react";
import React from "react";
import { Card } from "../../../components/molecules";

export function ContentCard({
  content,
  onClick,
  onDownload,
  onEdit,
  onDelete,
}) {
  // contentType을 기반으로 미디어 타입 판단
  const isVideo = content.contentType?.startsWith("video/");
  const isImage = content.contentType?.startsWith("image/");

  // 카드 클릭 핸들러
  const handleCardClick = () => {
    if (onClick) {
      onClick(content.id);
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(content);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(content);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(content.id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMediaIcon = () => {
    const iconProps = { size: 12 };
    if (isVideo) {
      return <Video {...iconProps} className="text-red-500" />;
    } else if (isImage) {
      return <Image {...iconProps} className="text-green-500" />;
    }
    return <Image {...iconProps} className="text-gray-500" />;
  };

  const getMediaTypeLabel = () => {
    if (isVideo) return "Video";
    if (isImage) return "Image";
    return "Media";
  };

  return (
    <Card variant="interactive" onClick={handleCardClick}>
      {/* 상단 액션 버튼들 - 호버시에만 표시 */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-lg"
          title="다운로드"
        >
          <Download size={14} />
        </button>
        <button
          onClick={handleEdit}
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-1.5 shadow-lg"
          title="수정"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg"
          title="삭제"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* 썸네일 이미지 */}
      {content.url && (
        <div className="aspect-video bg-gray-100">
          <img
            src={content.url}
            alt={content.title || content.originalName}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {getMediaIcon()}
          <span className="text-xs font-medium text-gray-600">
            {getMediaTypeLabel()}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2">
          {content.title || content.originalName}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Calendar size={12} />
          생성일 : {formatDate(content.createdAt)}
        </div>
      </div>
    </Card>
  );
}

      <div className="p-4">
        {/* 제목과 미디어 타입 */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 truncate flex-1">
            {content.title}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            {getMediaIcon()}
            <span className="text-xs text-gray-500">{getMediaTypeLabel()}</span>
          </div>
        </div>

        {/* 파일 정보 */}
        <div className="space-y-1 text-xs text-gray-500">
          {content.bytes && (
            <div>파일 크기: {formatFileSize(content.bytes)}</div>
          )}
          {(content.width || content.height) && (
            <div>해상도: {content.width || 0} × {content.height || 0}</div>
          )}
        </div>

        {/* 생성일 */}
        <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
          <Calendar size={10} />
          <span>{formatDate(content.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}
