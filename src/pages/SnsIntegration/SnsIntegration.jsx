import {
    AlertCircle,
    CheckCircle,
    ExternalLink,
    Facebook,
    Instagram,
    RefreshCw,
    Unlink,
    X,
    Youtube,
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { snsApi } from "../../api/sns";
import { useNotification } from "../../hooks";
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

  // 에러 상태 추가
  const [error, setError] = useState("");

  // 새로운 훅들 사용
  const { success, error: showError } = useNotification();

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
        accountInfo: response.data.result, // result 객체를 저장
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

  // 컴포넌트 마운트 시 모든 플랫폼 연동 상태 확인
  React.useEffect(() => {
    Object.keys(PLATFORMS).forEach((platform) => {
      checkConnectionStatus(platform, true);
    });
  }, [selectedStoreId]);

  // 연결된 계정 수 계산
  const connectedCount = Object.values(connections).filter(
    (conn) => conn.status === "connected"
  ).length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">SNS 계정 연동</h1>
        <p className="text-gray-600 text-lg mb-4">
          소셜 미디어 플랫폼을 연동하여 마케팅 자동화를 시작하세요
        </p>

        {/* 연동 현황 */}
        {connectedCount > 0 && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
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
              key={platform}
              className={`group relative bg-white rounded-2xl shadow-md border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isConnected
                  ? "border-emerald-300 shadow-emerald-100"
                  : hasError
                  ? "border-red-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* 연결 상태 배지 */}
              <div className="absolute -top-2 -right-2 z-10">
                {isConnected && (
                  <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
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
              <div className={`${isConnected ? "p-6" : "p-8"}`}>
                {/* 플랫폼 아이콘 & 이름 */}
                <div className={`text-center ${isConnected ? "mb-4" : "mb-8"}`}>
                  <div
                    className={`w-20 h-20 mx-auto rounded-2xl ${platformValue.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent
                      className={`w-10 h-10 ${platformValue.color}`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {platformValue.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {platformValue.description}
                  </p>
                </div>

                {/* 연결된 계정 정보는 연동된 경우에만 표시 */}
                {isConnected && connection.accountInfo && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      연결된 계정
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">계정명:</span>
                        <span className="font-medium text-gray-900">
                          {connection.accountInfo.snsAccountName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">계정 ID:</span>
                        <span className="font-medium text-gray-900">
                          {connection.accountInfo.snsAccountId}
                        </span>
                      </div>
                      {connection.accountInfo.follower > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">팔로워:</span>
                          <span className="font-medium text-gray-900">
                            {connection.accountInfo.follower.toLocaleString()}명
                          </span>
                        </div>
                      )}
                      {connection.accountInfo.postCount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">게시물:</span>
                          <span className="font-medium text-gray-900">
                            {connection.accountInfo.postCount.toLocaleString()}
                            개
                          </span>
                        </div>
                      )}
                      {connection.accountInfo.viewCount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">조회수:</span>
                          <span className="font-medium text-gray-900">
                            {connection.accountInfo.viewCount.toLocaleString()}
                            회
                          </span>
                        </div>
                      )}
                      {connection.accountInfo.snsAccountUrl && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">채널:</span>
                          <a
                            href={
                              // URL이 완전한 형태가 아니면 플랫폼에 맞게 변환
                              connection.accountInfo.snsAccountUrl.startsWith(
                                "http"
                              )
                                ? connection.accountInfo.snsAccountUrl
                                : platform === "youtube"
                                ? `https://youtube.com/${connection.accountInfo.snsAccountUrl}`
                                : platform === "instagram"
                                ? `https://instagram.com/${connection.accountInfo.snsAccountUrl.replace(
                                    "@",
                                    ""
                                  )}`
                                : platform === "facebook"
                                ? `https://facebook.com/${connection.accountInfo.snsAccountUrl}`
                                : connection.accountInfo.snsAccountUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                          >
                            방문하기
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {connection.accountInfo.snsAccountDescription && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <span className="text-gray-600 text-xs">설명:</span>
                          <p className="text-gray-900 text-xs mt-1 line-clamp-2">
                            {connection.accountInfo.snsAccountDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="space-y-3">
                  {isConnected ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => checkConnectionStatus(platform)}
                        disabled={connection.loading}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 font-medium text-sm"
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${
                            connection.loading ? "animate-spin" : ""
                          }`}
                        />
                        {connection.loading ? "확인 중..." : "새로고침"}
                      </button>
                      <button
                        onClick={() => disconnectAccount(platform)}
                        disabled={connection.loading}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-all duration-200 font-medium text-sm"
                      >
                        <Unlink className="w-4 h-4" />
                        {connection.loading ? "처리 중..." : "연결 해제"}
                      </button>
                    </div>
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
