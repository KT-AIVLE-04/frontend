import { Upload } from 'lucide-react';
import React from 'react';

export const ContentHeader = ({ 
  uploading, 
  onFileUpload 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">콘텐츠 관리</h1>
      <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
        <Upload size={16} />
        {uploading ? '업로드 중...' : '파일 업로드'}
        <input
          type="file"
          className="hidden"
          accept="image/*,video/*"
          onChange={onFileUpload}
          disabled={uploading}
        />
      </label>
    </div>
  );
};
