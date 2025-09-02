import React, { useEffect } from "react";
import {
  Calendar,
  Tag,
  ExternalLink,
  Youtube,
  Facebook,
  Instagram,
  Eye,
  Heart,
  MessageCircle,
  X,
  Trash2,
} from "lucide-react";
import { formatDateTime_forPost } from "../../../utils/formatters";
import { analyticsApi } from "../../../api/analytics";
import { useApi } from "../../../hooks";

export function PostDetail({ post, onClose, onDelete }) {
  const {
    data: metricsData,
    loading: metricsLoading,
    execute: executeMetrics,
  } = useApi(analyticsApi.getRealtimePostMetrics);

  useEffect(() => {
    if (!post?.snsType || !post?.id) return;
    executeMetrics(post.snsType, post.id);
  }, [post?.snsType, post?.id, executeMetrics]);

  if (!post) {
    return null;
  }

  const handleDeletePost = () => {
    if (onDelete) {
      onDelete(post.id);
    }
  };

  const handleCloseDetail = () => {
    if (onClose) {
      onClose();
    }
  };

  const getSnsIcon = (snsType) => {
    const iconProps = { size: 20 };
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

  const getOriginalPostUrl = (snsType, snsPostId) => {
    if (!snsPostId) return null;

    switch (snsType) {
      case "youtube":
        return `https://www.${snsType}.com/watch?v=${snsPostId}`;
      case "instagram":
        return `https://www.${snsType}.com/p/${snsPostId}`;
      case "facebook":
        return `https://www.${snsType}.com/posts/${snsPostId}`;
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

  console.log("@@ metricsData", metricsData);
  const viewCount = metricsLoading
    ? "..."
    : metricsData?.views?.toLocaleString() || "222";
  const likeCount = metricsLoading
    ? "..."
    : metricsData?.likes?.toLocaleString() || "333";
  const commentCount = metricsLoading
    ? "..."
    : metricsData?.comments?.toLocaleString() || "444";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <div className="flex items-center gap-3">
            {getSnsIcon(post.snsType)}
            <span className="text-lg font-semibold text-gray-900">
              게시물 상세보기
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
          {/* 왼쪽: 이미지 영역 */}
          <div className="lg:w-7/12 bg-gray-100 flex items-center justify-center">
            {post.url && (
              <div className="w-full h-full min-h-[300px] lg:min-h-[500px]">
                <img
                  src={post.url}
                  alt={post.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* 오른쪽: 정보 영역 */}
          <div className="lg:w-5/12 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              {/* 제목 */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h2>

              {/* 설명 */}
              <p className="text-gray-700 leading-relaxed mb-6">
                {post.description}
              </p>

              {/* 태그 */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-300">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag size={16} />
                    태그
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 통계 정보 */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">통계</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1 gap-1">
                      <Eye size={16} className="text-emerald-500" />
                      <span className="text-xs text-gray-500">조회수</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatNumber(viewCount)}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1 gap-1">
                      <Heart size={16} className="text-red-500" />
                      <span className="text-xs text-gray-500">좋아요</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatNumber(likeCount)}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1 gap-1">
                      <MessageCircle size={16} className="text-blue-500" />
                      <span className="text-xs text-gray-500">댓글</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatNumber(commentCount)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 게시 정보 */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">게시 정보</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  {formatDateTime_forPost(post.publishAt)}
                </div>
              </div>
            </div>

            {/* 하단 액션 버튼들 */}
            <div className="border-t border-gray-300 p-4">
              <div className="flex gap-3">
                {getOriginalPostUrl(post.snsType, post.snsPostId) && (
                  <button
                    onClick={() => {
                      const url = getOriginalPostUrl(
                        post.snsType,
                        post.snsPostId
                      );
                      if (url) {
                        window.open(url, "_blank");
                      }
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    <ExternalLink size={16} />
                    원본 보기
                  </button>
                )}

                <button
                  onClick={handleDeletePost}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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
