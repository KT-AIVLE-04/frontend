import React from "react";
import {
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Youtube,
  Facebook,
  Instagram,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Card } from "../../../components/molecules";
import { formatDateKorean } from "../../../utils/formatters";

export function PostCard({ post, onClick, onDelete }) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(post);
    }
  };

  const handleDeletePost = () => {
    if (onDelete) {
      onDelete(post.id);
    }
  };

  const handleLinkClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    const url = getOriginalPostUrl(post.snsType, post.snsPostId);
    if (url) {
      window.open(url, "_blank");
    }
  };

  const getSnsIcon = (snsType) => {
    const iconProps = { size: 12 };
    switch (snsType) {
      case "youtube":
        return <Youtube {...iconProps} className="text-red-500" />;
      case "instagram":
        return <Instagram {...iconProps} className="text-pink-500" />;
      case "facebook":
        return <Facebook {...iconProps} className="text-blue-600" />;
      default:
        return <ExternalLink {...iconProps} className="text-gray-500" />;
    }
  };

  const getSnsTypeLabel = (snsType) => {
    const labels = {
      youtube: "YouTube",
      instagram: "Instagram",
      facebook: "Facebook",
    };
    return labels[snsType];
  };

  const getOriginalPostUrl = (snsType, snsPostId) => {
    if (!snsPostId) return null;

    switch (snsType) {
      case "youtube":
        return `https://www.youtube.com/watch?v=${snsPostId}`;
      case "instagram":
        return `https://www.instagram.com/p/${snsPostId}`;
      case "facebook":
        return `https://www.facebook.com/posts/${snsPostId}`;
      default:
        return null;
    }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // 더미 데이터 생성
  const getDummyStats = (id) => {
    const seed = id || 1;
    return {
      viewCount: Math.floor(Math.random() * seed * 10000) + 1000,
      likeCount: Math.floor(Math.random() * seed * 500) + 50,
      commentCount: Math.floor(Math.random() * seed * 100) + 5,
    };
  };

  const dummyStats = getDummyStats(post.id);
  const viewCount = post.viewCount ?? dummyStats.viewCount;
  const likeCount = post.likeCount ?? dummyStats.likeCount;
  const commentCount = post.commentCount ?? dummyStats.commentCount;

  return (
    <Card variant="interactive" onClick={handleCardClick}>
      {/* 상단 액션 버튼들 - 호버시에만 표시 */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        {getOriginalPostUrl(post.snsType, post.snsPostId) && (
          <button
            onClick={handleLinkClick}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-lg"
            title="원본 게시물 보기"
          >
            <ExternalLink size={14} />
          </button>
        )}
        <button
          onClick={handleDeletePost}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg"
          title="삭제"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* 썸네일 이미지 */}
      {post.url && (
        <div className="aspect-video bg-gray-100">
          <img
            src={post.url}
            alt={post.title}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {getSnsIcon(post.snsType)}
          <span className="text-xs font-medium text-gray-600">
            {getSnsTypeLabel(post.snsType)}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2">
          {post.title}
        </h3>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-gray-500">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
        {/* 선 추가 */}
        <div className="h-px bg-gray-200 my-3" />

        {/* 통계 정보 */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <Eye size={12} className="text-emerald-500" />
            {formatNumber(viewCount)}
          </div>

          <div className="flex items-center gap-1">
            <Heart size={12} className="text-red-500" />
            {formatNumber(likeCount)}
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle size={12} className="text-blue-500" />
            {formatNumber(commentCount)}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Calendar size={12} />
          게시일 : {formatDateKorean(post.publishAt)}
        </div>
      </div>
    </Card>
  );
}
