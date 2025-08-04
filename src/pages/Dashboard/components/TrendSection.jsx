import { TrendingUp } from 'lucide-react';

export const TrendSection = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp size={18} className="mr-2 text-red-500" />
        현재 트렌드
      </h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">인기 해시태그</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              #여름맞이
            </span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              #카페추천
            </span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              #맛집투어
            </span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              #신메뉴
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">인기 콘텐츠 유형</p>
          <p className="text-xs text-gray-600 mt-1">
            현재 15-30초 길이의 제품 리뷰 형식 숏폼이 가장 높은 참여율을
            보이고 있습니다.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">최적 게시 시간</p>
          <p className="text-xs text-gray-600 mt-1">
            평일 오후 6-8시, 주말 오전 10-12시에 게시하면 최대 도달률을
            기대할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}; 