import { Frown, Meh, MessageSquare, Smile, TrendingUp } from 'lucide-react';
import { ProgressBar } from '../../../components';

export const EmotionAnalysis = ({ emotionAnalysis }) => {
  if (!emotionAnalysis || !emotionAnalysis.emotionSummary) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <MessageSquare size={18} className="mr-2 text-purple-600" />
          댓글 감정분석
        </h2>
        <div className="text-center text-gray-500 py-8">
          감정분석 데이터가 없습니다.
        </div>
      </div>
    );
  }

  const { emotionSummary, keywords } = emotionAnalysis;
  const total = emotionSummary.totalCount || 0;

  const getSentimentData = () => {
    const data = [];
    
    if (emotionSummary.positiveCount > 0) {
      data.push({
        sentiment: 'positive',
        count: emotionSummary.positiveCount,
        percentage: total > 0 ? Math.round((emotionSummary.positiveCount / total) * 100) : 0
      });
    }
    
    if (emotionSummary.neutralCount > 0) {
      data.push({
        sentiment: 'neutral',
        count: emotionSummary.neutralCount,
        percentage: total > 0 ? Math.round((emotionSummary.neutralCount / total) * 100) : 0
      });
    }
    
    if (emotionSummary.negativeCount > 0) {
      data.push({
        sentiment: 'negative',
        count: emotionSummary.negativeCount,
        percentage: total > 0 ? Math.round((emotionSummary.negativeCount / total) * 100) : 0
      });
    }
    
    return data;
  };

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

  const sentimentData = getSentimentData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <MessageSquare size={18} className="mr-2 text-purple-600" />
        댓글 감정분석
      </h2>
      
      {/* 전체 통계 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp size={16} className="mr-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">전체 댓글</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{total.toLocaleString()}개</span>
        </div>
      </div>

      {/* 감정별 분석 */}
      <div className="space-y-4 mb-6">
        {sentimentData.map((item) => (
          <div key={item.sentiment}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                {getSentimentIcon(item.sentiment)}
                <span className="text-sm font-medium capitalize">
                  {getSentimentLabel(item.sentiment)}
                </span>
              </div>
              <div className="text-sm font-medium">
                {item.count.toLocaleString()} ({item.percentage}%)
              </div>
            </div>
            <ProgressBar 
              percentage={item.percentage}
              color={getSentimentColor(item.sentiment)}
            />
          </div>
        ))}
      </div>

      {/* 키워드 분석 */}
      {keywords && (keywords.positive?.length > 0 || keywords.negative?.length > 0) && (
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium mb-3">주요 키워드</h3>
          
          {/* 긍정 키워드 */}
          {keywords.positive && keywords.positive.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center mb-2">
                <Smile size={14} className="text-green-500 mr-1" />
                <span className="text-xs font-medium text-green-700">긍정 키워드</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.positive.slice(0, 5).map((keyword, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 부정 키워드 */}
          {keywords.negative && keywords.negative.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <Frown size={14} className="text-red-500 mr-1" />
                <span className="text-xs font-medium text-red-700">부정 키워드</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.negative.slice(0, 5).map((keyword, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
