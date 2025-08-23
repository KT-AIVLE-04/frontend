import React from "react";
import { Trash2, Eye, Calendar, User, X } from "lucide-react";

export function PostDetail({ post, onClose, handleDelete }) {
  if (!post) {
    return null;
  }

  const onDeleteClick = () => {
    if (handleDelete) {
      handleDelete(post.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-2 md:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col lg:flex-row animate-in fade-in zoom-in duration-300">
        {/* 왼쪽: 비디오 영역 */}
        <div className="lg:w-2/3 bg-black flex items-center justify-center relative">
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="max-w-full max-h-full object-contain"
          />

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 오른쪽: 정보 영역 */}
        <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col justify-between bg-white dark:bg-gray-800">
          <div className="flex-1">
            {/* 제목 */}
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h2>

            {/* 메타 정보 */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <User className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-medium">{post.author}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Calendar className="w-5 h-5 mr-3 text-green-500" />
                <span>{post.createdAt}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Eye className="w-5 h-5 mr-3 text-purple-500" />
                <span>조회수 {post.views?.toLocaleString()}</span>
              </div>
            </div>

            {/* 설명 */}
            {post.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  설명
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {post.description}
                </p>
              </div>
            )}

            {/* 통계 정보 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {post.views?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  조회수
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {post.likes || "0"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  좋아요
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {post.comments || "0"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  댓글
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼 - 삭제만 유지 */}
          <div className="mt-8">
            <button
              onClick={onDeleteClick}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" /> 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
