import { TrendingUp } from 'lucide-react';
import { Card } from '../../../components';

export const TrendSection = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center">
        <TrendingUp size={20} className="mr-3 text-red-500" />
        현재 트렌드
      </h2>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">인기 해시태그</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-blue-100 px-3 py-2 rounded-full border-2 border-blue-300 font-bold text-blue-700">
              #여름맞이
            </span>
            <span className="text-xs bg-green-100 px-3 py-2 rounded-full border-2 border-green-300 font-bold text-green-700">
              #카페추천
            </span>
            <span className="text-xs bg-purple-100 px-3 py-2 rounded-full border-2 border-purple-300 font-bold text-purple-700">
              #맛집투어
            </span>
            <span className="text-xs bg-orange-100 px-3 py-2 rounded-full border-2 border-orange-300 font-bold text-orange-700">
              #신메뉴
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700 mb-2">인기 콘텐츠 유형</p>
          <p className="text-xs text-gray-600 font-bold">
            현재 15-30초 길이의 제품 리뷰 형식 숏폼이 가장 높은 참여율을
            보이고 있습니다.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700 mb-2">최적 게시 시간</p>
          <p className="text-xs text-gray-600 font-bold">
            평일 오후 6-8시, 주말 오전 10-12시에 게시하면 최대 도달률을
            기대할 수 있습니다.
          </p>
        </div>
      </div>
    </Card>
  );
}; 