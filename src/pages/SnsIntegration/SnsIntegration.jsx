import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Youtube,
  Instagram,
  Facebook,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Unlink,
  X,
} from "lucide-react";
import { snsApi } from "../../api/sns";
import { SnsIntegrationGuide } from "./components";

// 상수 정의
const AUTH_TIMEOUT = 300000; // 5분
const POLLING_INTERVAL = 1000; // 1초
const CONNECTION_CHECK_DELAY = 1000; // 1초

const PLATFORMS = {
  youtube: {
    name: "YouTube",
    icon: Youtube,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    buttonColor: "bg-red-500 hover:bg-red-600",
    description: "동영상/쇼츠",
  },
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    buttonColor: "bg-pink-500 hover:bg-pink-600",
    description: "게시물/릴스",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    description: "게시물/릴스",
  },
};

const INITIAL_CONNECTION_STATE = {
  status: "disconnected",
  accountInfo: null,
  loading: false,
};

export function SnsIntegration() {
  const { selectedStoreId } = useSelector((state) => state.auth);

  const [connections, setConnections] = useState({
    youtube: { ...INITIAL_CONNECTION_STATE },
    instagram: { ...INITIAL_CONNECTION_STATE },
    facebook: { ...INITIAL_CONNECTION_STATE },
  });
  const [error, setError] = useState("");

  // Helper 함수: 연결 상태 업데이트
  const updateConnectionState = (platform, updates) => {
    setConnections((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], ...updates },
    }));
  };

  // 특정 SNS 연동 상태 확인
  const checkConnectionStatus = async (platform, isInitialCheck = false) => {
    try {
      updateConnectionState(platform, { loading: true });

      const response = await snsApi.account.getAccountInfo(platform);

      updateConnectionState(platform, {
        status: "connected",
        accountInfo: response.data,
        loading: false,
      });
    } catch (error) {
      const status =
        error.response?.status === 404 || isInitialCheck
          ? "disconnected"
          : "error";

      updateConnectionState(platform, {
        status,
        accountInfo: null,
        loading: false,
      });
    }
  };

  // SNS 계정 연동 시작
  const startIntegration = async (platform) => {
    if (!selectedStoreId) {
      setError("스토어를 먼저 선택해주세요.");
      return;
    }

    try {
      setError("");
      updateConnectionState(platform, {
        status: "connecting",
        loading: true,
      });

      // OAuth URL 요청
      const response = await snsApi.oauth.getAuthUrl(platform);
      const authUrl = response.data.result;

      // 새 창에서 인증 페이지 열기
      const authWindow = window.open(
        authUrl,
        `${platform}-auth`,
        "width=600,height=700,scrollbars=yes,resizable=yes"
      );

      // 인증 완료 체크 (폴링)
      const checkAuth = setInterval(async () => {
        try {
          if (authWindow.closed) {
            clearInterval(checkAuth);
            setTimeout(() => {
              checkConnectionStatus(platform);
            }, CONNECTION_CHECK_DELAY);
          }
        } catch {
          // 크로스 오리진 에러는 무시
        }
      }, POLLING_INTERVAL);

      // 타임아웃 처리
      setTimeout(() => {
        clearInterval(checkAuth);
        if (!authWindow.closed) {
          authWindow.close();
        }
        if (connections[platform].status === "connecting") {
          updateConnectionState(platform, {
            status: "error",
            loading: false,
          });
          setError("인증 시간이 초과되었습니다. 다시 시도해주세요.");
        }
      }, AUTH_TIMEOUT);
    } catch (err) {
      console.error("연동 실패:", err);
      updateConnectionState(platform, {
        status: "error",
        loading: false,
      });
      setError(
        `${PLATFORMS[platform].name} 연동 중 오류가 발생했습니다. 다시 시도해주세요.`
      );
    }
  };

  // 연결 해제
  const disconnectAccount = async (platform) => {
    try {
      updateConnectionState(platform, { loading: true });

      // TODO: 실제 연결 해제 API 구현 필요
      updateConnectionState(platform, {
        status: "disconnected",
        accountInfo: null,
        loading: false,
      });
    } catch {
      setError(`${PLATFORMS[platform].name} 연결 해제 중 오류가 발생했습니다.`);
      updateConnectionState(platform, { loading: false });
    }
  };

  // 연결된 계정 수 계산
  const connectedCount = Object.values(connections).filter(
    (conn) => conn.status === "connected"
  ).length;

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">SNS 계정 연동</h1>
        <p className="text-gray-600 text-lg">
          소셜 미디어 플랫폼을 연동하여 마케팅 자동화를 시작하세요
        </p>

        {/* 연동 현황 */}
        {connectedCount > 0 && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            {connectedCount}개 계정 연동됨
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex items-center justify-between w-full">
              <p className="text-red-800 font-medium">{error}</p>
              <button
                onClick={() => setError("")}
                className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                aria-label="에러 메시지 닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SNS 플랫폼 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(PLATFORMS).map(([platform, platformValue]) => {
          const connection = connections[platform];
          const IconComponent = platformValue.icon;
          const isConnected = connection.status === "connected";
          const isConnecting = connection.status === "connecting";
          const hasError = connection.status === "error";

          return (
            <div
              platform={platform}
              className={`group relative bg-white rounded-2xl shadow-md border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isConnected
                  ? "border-green-300 shadow-green-100"
                  : hasError
                  ? "border-red-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* 연결 상태 배지 */}
              <div className="absolute -top-2 -right-2 z-10">
                {isConnected && (
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    연결됨
                  </div>
                )}
                {isConnecting && (
                  <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    연결 중
                  </div>
                )}
                {hasError && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    실패
                  </div>
                )}
              </div>

              {/* 카드 콘텐츠 */}
              <div className="p-8">
                {/* 플랫폼 아이콘 & 이름 */}
                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl ${platformValue.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${platformValue.color}`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {platformValue.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {platformValue.description}
                  </p>
                </div>

                {/* 액션 버튼 */}
                <div className="space-y-3">
                  {isConnected ? (
                    <button
                      onClick={() => disconnectAccount(platform)}
                      disabled={connection.loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 disabled:opacity-50 transition-all duration-200 font-medium"
                    >
                      <Unlink className="w-5 h-5" />
                      {connection.loading ? "처리 중..." : "연결 해제"}
                    </button>
                  ) : (
                    <button
                      onClick={() => startIntegration(platform)}
                      disabled={isConnecting || connection.loading}
                      className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 ${platformValue.buttonColor}`}
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          연결 중...
                        </>
                      ) : (
                        <>
                          <IconComponent className="w-5 h-5" />
                          연동하기
                          <ExternalLink className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 연동 안내 */}
      <SnsIntegrationGuide />
    </div>
  );
}
