import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../components";
import { SNS_TYPES, SNS_TYPE_LABELS } from "../../models/SnsAccount";
import { ROUTES } from "../../routes/routes";
import {
  AccountAnalytics,
  ContentPerformanceSection,
  PostAnalytics,
} from "./components";

export function Analytics() {
  const navigate = useNavigate();
  const { connections } = useSelector((state) => state.sns);

  const [selectedSnsType, setSelectedSnsType] = useState(SNS_TYPES.YOUTUBE);

  // SNS 타입별 아이콘과 라벨 헬퍼 함수
  const getSnsTypeInfo = (snsType) => {
    const icons = {
      [SNS_TYPES.YOUTUBE]: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
          alt="YouTube"
          className="w-5 h-5 mr-2"
        />
      ),
      [SNS_TYPES.INSTAGRAM]: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
          alt="Instagram"
          className="w-5 h-5 mr-2"
        />
      ),
      [SNS_TYPES.FACEBOOK]: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
          alt="Facebook"
          className="w-5 h-5 mr-2"
        />
      ),
    };

    return {
      icon: icons[snsType] || "📱",
      label: SNS_TYPE_LABELS[snsType] || snsType,
    };
  };

  // 현재 선택된 SNS 계정 정보
  const currentConnection = connections[selectedSnsType];

  // SNS 계정 연결 상태 확인
  if (currentConnection?.status === "disconnected") {
    return (
      <div className="flex-1 w-full p-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 shadow-lg">
            <div className="text-yellow-600 text-6xl mb-4 animate-bounce">
              🔗
            </div>
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">
              SNS 계정 연결이 필요합니다
            </h2>
            <p className="text-yellow-700 mb-6 text-lg">
              {SNS_TYPE_LABELS[selectedSnsType]} 계정을 연결해야 분석 데이터를
              확인할 수 있습니다.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate(ROUTES.SNS_INTEGRATION.route)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                SNS 계정 연결하기
              </button>
              <div className="text-sm text-yellow-600">
                연결 후 분석 데이터를 실시간으로 확인할 수 있습니다
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SNS 계정 연결 에러
  if (currentConnection?.status === "error") {
    return (
      <div className="flex-1 w-full p-6">
        <div className="max-w-2xl mx-auto">
          <Alert
            type="error"
            title="SNS 계정 연결 오류"
            message={
              currentConnection.error ||
              "SNS 계정 정보를 불러오는 중 오류가 발생했습니다."
            }
          />
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate(ROUTES.SNS_INTEGRATION.route)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              SNS 계정 관리
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full p-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">성과 분석</h1>
          {currentConnection?.accountInfo && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <span className="mr-2">
                {getSnsTypeInfo(selectedSnsType).icon}
              </span>
              <span className="font-medium">
                {currentConnection.accountInfo.snsAccountName || "연결된 계정"}
              </span>
              <span className="mx-2">•</span>
              <span className="text-green-600 font-medium">연결됨</span>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          {/* SNS 타입 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">플랫폼:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {Object.values(SNS_TYPES).map((snsType) => (
                <button
                  key={snsType}
                  onClick={() => setSelectedSnsType(snsType)}
                  className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    selectedSnsType === snsType
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="flex items-center">
                    {getSnsTypeInfo(snsType).icon}
                    {getSnsTypeInfo(snsType).label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3개 섹션으로 나누어진 분석 */}
      <div className="space-y-6">
        {/* 1. 계정 분석 섹션 */}
        <AccountAnalytics selectedSnsType={selectedSnsType} />

        {/* 2. 포스트 분석 섹션 */}
        <PostAnalytics selectedSnsType={selectedSnsType} />

        {/* 3. 콘텐츠 성과 분석 섹션 */}
        <ContentPerformanceSection selectedSnsType={selectedSnsType} />
      </div>
    </div>
  );
}
