import { Frown, Meh, MessageSquare, Smile } from 'lucide-react';
import { ProgressBar } from '../../../components';

export const CommentSentiment = ({ commentSentiment }) => {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <Smile size={16} className="text-green-500 mr-2" />;
      case 'neutral':
        return <Meh size={16} className="text-gray-500 mr-2" />;
      case 'negative':
        return <Frown size={16} className="text-red-500 mr-2" />;
      default:
        return null;
    }
  };

  const getSentimentLabel = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '긍정적';
      case 'neutral':
        return '중립적';
      case 'negative':
        return '부정적';
      default:
        return sentiment;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'green';
      case 'neutral':
        return 'gray';
      case 'negative':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <MessageSquare size={18} className="mr-2 text-purple-600" />
        댓글 감성 분석
      </h2>
      <div className="space-y-4">
        {commentSentiment.map((item) => (
          <div key={item.sentiment}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                {getSentimentIcon(item.sentiment)}
                <span className="text-sm font-medium capitalize">
                  {getSentimentLabel(item.sentiment)}
                </span>
              </div>
              <div className="text-sm font-medium">
                {item.count} ({item.percentage}%)
              </div>
            </div>
            <ProgressBar 
              percentage={item.percentage}
              color={getSentimentColor(item.sentiment)}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium mb-2">주요 키워드</h3>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            맛있어요 (45)
          </span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            좋아요 (32)
          </span>
          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            보통 (18)
          </span>
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
            비싸요 (12)
          </span>
        </div>
      </div>
    </div>
  );
}; 