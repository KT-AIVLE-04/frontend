import React from "react";
import { Trash2, Calendar, Hash, X, Play } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">게시물 상세</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* 왼쪽: 미디어 영역 */}
          <div className="lg:w-1/2 bg-gray-100">
            <div className="aspect-video relative">
              <img
                src={post.url}
                alt={post.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-3 shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                  <Play className="w-6 h-6 text-gray-700 ml-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 정보 영역 */}
          <div className="lg:w-1/2 p-6">
            <div className="space-y-6">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <p className="text-gray-900 leading-relaxed">{post.title}</p>
              </div>

              {/* 설명 */}
              {post.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명
                  </label>
                  <p className="text-gray-900 leading-relaxed">
                    {post.description}
                  </p>
                </div>
              )}

              {/* 해시태그 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  태그
                </label>
                <p className="text-gray-900">{post.tags || "태그 없음"}</p>
              </div>

              {/* 발행일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  발행일
                </label>
                <p className="text-gray-900">
                  {post.publishAt
                    ? new Date(post.publishAt).toLocaleDateString("ko-KR")
                    : "미정"}
                </p>
              </div>
            </div>

            {/* 삭제 버튼 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={onDeleteClick}
                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
