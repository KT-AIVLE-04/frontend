import { BarChart3, Frown, Meh, MessageSquare, Smile } from 'lucide-react';
import { ProgressBar } from '../../../components';

export const EmotionAnalysis = ({ emotionAnalysis }) => {
  if (!emotionAnalysis || !emotionAnalysis.emotionSummary) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <BarChart3 size={18} className="mr-2 text-purple-600" />
          댓글 감정분석
        </h2>
        <div className="text-center text-gray-500 py-8">
          <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
          <p>감정분석 데이터가 없습니다.</p>
          <p className="text-sm mt-2">게시물을 선택하면 감정분석 결과를 확인할 수 있습니다.</p>
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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
        <BarChart3 size={18} className="mr-2 text-purple-600" />
        댓글 감정분석
      </h2>
      
      {/* 전체 통계 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {emotionSummary.positiveCount || 0}
          </div>
          <div className="text-sm text-green-700">긍정적</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {emotionSummary.neutralCount || 0}
          </div>
          <div className="text-sm text-gray-700">중립적</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {emotionSummary.negativeCount || 0}
          </div>
          <div className="text-sm text-red-700">부정적</div>
        </div>
      </div>

      {/* 감정 분포 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">감정 분포</h3>
        <div className="space-y-3">
          {sentimentData.map((item) => (
            <div key={item.sentiment} className="flex items-center">
              <div className="flex items-center w-20">
                {getSentimentIcon(item.sentiment)}
                <span className="text-sm text-gray-600">
                  {getSentimentLabel(item.sentiment)}
                </span>
              </div>
              <div className="flex-1 mx-3">
                <ProgressBar
                  progress={item.percentage}
                  color={getSentimentColor(item.sentiment)}
                  height="h-2"
                />
              </div>
              <div className="w-16 text-right">
                <span className="text-sm font-medium text-gray-900">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 키워드 분석 */}
      {keywords && (keywords.positive?.length > 0 || keywords.negative?.length > 0) && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">주요 키워드</h3>
          
          {keywords.positive && keywords.positive.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-green-600 font-medium mb-2">긍정적 키워드</div>
              <div className="flex flex-wrap gap-1">
                {keywords.positive.slice(0, 5).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {keywords.negative && keywords.negative.length > 0 && (
            <div>
              <div className="text-xs text-red-600 font-medium mb-2">부정적 키워드</div>
              <div className="flex flex-wrap gap-1">
                {keywords.negative.slice(0, 5).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 요약 정보 */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg">
        <div className="text-sm text-purple-900">
          <div className="font-medium mb-1">분석 요약</div>
          <div className="text-xs">
            총 {total}개의 댓글을 분석한 결과, 
            {emotionSummary.positiveCount > emotionSummary.negativeCount ? 
              '전반적으로 긍정적인 반응' : 
              emotionSummary.negativeCount > emotionSummary.positiveCount ? 
              '전반적으로 부정적인 반응' : 
              '중립적인 반응'
            }을 보이고 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
};
