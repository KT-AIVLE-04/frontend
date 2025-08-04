import { CheckCircle, Clock, Upload } from 'lucide-react';

export const ContentStatus = ({ contentStatus }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock size={24} className="text-yellow-500" />;
      case 'completed':
        return <CheckCircle size={24} className="text-green-500" />;
      case 'failed':
        return <Upload size={24} className="text-red-500" />;
      default:
        return <Clock size={24} className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
        return '콘텐츠를 생성하고 있습니다...';
      case 'completed':
        return '콘텐츠 생성이 완료되었습니다!';
      case 'failed':
        return '콘텐츠 생성에 실패했습니다.';
      default:
        return '상태를 확인하고 있습니다...';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {getStatusIcon(contentStatus?.status)}
        <h3 className={`mt-4 text-lg font-semibold ${getStatusColor(contentStatus?.status)}`}>
          {getStatusText(contentStatus?.status)}
        </h3>
        {contentStatus?.status === 'processing' && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${contentStatus.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {contentStatus.progress || 0}% 완료
            </p>
          </div>
        )}
        {contentStatus?.status === 'completed' && (
          <p className="text-sm text-gray-500 mt-2">
            잠시 후 콘텐츠 관리 페이지로 이동합니다.
          </p>
        )}
      </div>
    </div>
  );
}; 