// src/pages/ContentManagement/components/VideoDetail.jsx

import {
  Download,
  Edit,
  Play,
  Trash2,
  User,
} from 'lucide-react';
import React from 'react';

export function VideoDetail({ video, onClose, handleDownload, handleEdit, handleDelete }) {
  if (!video) {
    return null;
  }

  const isVideo = video.type === 'video';

  const onDownloadClick = () => {
    if (handleDownload) {
      handleDownload(video.id);
    }
  };

  const onEditClick = () => {
    if (handleEdit) {
      handleEdit(video.id);
    }
  };

  const onDeleteClick = () => {
    if (handleDelete) {
      handleDelete(video.id);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col lg:flex-row animate-in fade-in zoom-in duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
                 {/* Close Button */}
         <button
           onClick={onClose}
           className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200"
         >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        {/* Media Player Section */}
        <div className="flex-1 min-w-0 bg-black flex items-center justify-center relative min-h-[400px] lg:min-h-[600px]">
          {isVideo ? (
            <>
              {/* 비디오 재생 버튼 오버레이 */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all duration-200 backdrop-blur-sm">
                  <Play className="w-12 h-12 text-white" fill="currentColor" />
                </button>
              </div>
              <video
                controls
                poster={video.thumbnailUrl}
                className="w-full h-full object-cover"
                style={{ maxHeight: '600px' }}
              >
                <source src={video.url || video.thumbnailUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </>
          ) : (
            /* 이미지 표시 */
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-contain"
              style={{ maxHeight: '600px' }}
            />
          )}
        </div>

                 {/* Content Details and Actions Section */}
         <div className="w-full lg:w-80 p-6 lg:p-8 flex flex-col justify-between bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
           <div>
                         <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3 break-words">
                {video.title}
              </h2>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <User className="w-4 h-4 mr-1" />
                <span className="font-medium">{video.author}</span>
              </div>
            </div>

             <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
               {video.description || `${isVideo ? '비디오' : '이미지'}에 대한 설명이 없습니다.`}
             </p>
           </div>

           {/* Action Buttons */}
           <div className="space-y-3">
             <button
               onClick={onDownloadClick}
               className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
             >
               <Download className="w-4 h-4 mr-2" /> 다운로드
             </button>
             <button
               onClick={onEditClick}
               className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
             >
               <Edit className="w-4 h-4 mr-2" /> 수정
             </button>
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