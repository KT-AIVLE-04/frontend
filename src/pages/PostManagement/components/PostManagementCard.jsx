import { Trash2, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import React from "react";
import { Container } from "../../../components/Container";

export function PostManagementCard({ content, onClick, onDelete }) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(content);
    }
  };

  // 플랫폼 아이콘 매핑
  const getPlatformIcon = (platform) => {
    const icons = {
      youtube: "📺",
      instagram: "📷",
      facebook: "👥",
    };
    return icons[platform] || "📱";
  };

  // 상태 아이콘 및 색상 매핑
  const getStatusInfo = (status) => {
    const statusMap = {
      completed: {
        icon: CheckCircle,
        color: "text-green-500",
        bg: "bg-green-50",
        text: "업로드 완료",
      },
      scheduled: {
        icon: Clock,
        color: "text-blue-500",
        bg: "bg-blue-50",
        text: "예약됨",
      },
      failed: {
        icon: XCircle,
        color: "text-red-500",
        bg: "bg-red-50",
        text: "실패",
      },
    };
    return statusMap[status] || statusMap.completed;
  };

  const statusInfo = getStatusInfo(content.status || "completed");
  const StatusIcon = statusInfo.icon;

  return (
    <Container
      variant="hover"
      className="overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={content.thumbnailUrl || content.thumbnail}
          alt={content.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-150"
        />
        {content.duration && (
          <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-3 py-1.5 rounded-full border-2 border-gray-600 font-bold">
            {content.duration}
          </div>
        )}

        {/* 플랫폼 아이콘 */}
        <div className="absolute top-2 left-2 flex gap-1">
          {content.platforms ? (
            content.platforms.map((platform, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-sm"
                title={platform}
              >
                {getPlatformIcon(platform)}
              </div>
            ))
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-sm">
              {getPlatformIcon("youtube")}
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3
          className="font-black mb-3 line-clamp-2 text-gray-800 group-hover:text-blue-700 transition-colors"
          title={content.title}
        >
          {content.title}
        </h3>

        <div className="flex items-center text-sm text-gray-600 mb-3 font-bold">
          <span className="font-black">{content.author || content.store}</span>
          <span className="mx-2">•</span>
          <span>{content.createdAt}</span>
        </div>

        {/* 상태 표시 */}
        <div
          className={`flex items-center mb-3 px-3 py-1.5 rounded-full ${statusInfo.bg} w-fit`}
        >
          <StatusIcon size={16} className={`mr-2 ${statusInfo.color}`} />
          <span className={`text-sm font-bold ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>

        {/* 통계 정보 */}
        {(content.views || content.likes || content.comments) && (
          <div className="flex items-center text-xs text-gray-500 mb-3 gap-4">
            {content.views && (
              <span>조회수 {content.views.toLocaleString()}</span>
            )}
            {content.likes && <span>좋아요 {content.likes}</span>}
            {content.comments && <span>댓글 {content.comments}</span>}
          </div>
        )}

        {/* 액션 버튼들 - 삭제만 유지 */}
        <div className="flex justify-between items-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-bold px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
            상세 보기
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(content.id);
            }}
            className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 border-2 border-transparent hover:border-red-200"
            title="삭제"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </Container>
  );
}
