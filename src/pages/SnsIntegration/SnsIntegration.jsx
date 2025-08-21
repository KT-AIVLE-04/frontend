import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Youtube,
  Instagram,
  Facebook,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  User,
  Unlink,
  Info,
} from "lucide-react";
import { snsApi } from "../../api/sns";

// 🧪 개발용 Mock 데이터
const MOCK_USER = { id: 1, memberId: 1, name: "테스트 사용자" };
const MOCK_STORE_ID = 1;

export function SnsIntegration() {
  const { user, selectedStoreId } = useSelector((state) => state.auth);

  // 개발용: 테스트 라우트에서 접근했는지 확인
  const isTestRoute = window.location.pathname.startsWith("/test/");
  const isDev = import.meta.env.DEV;
  const useMockData = isDev && (isTestRoute || !user || !selectedStoreId);

  const currentUser = useMockData ? MOCK_USER : user;
  const currentStoreId = useMockData ? MOCK_STORE_ID : selectedStoreId;

  const [connections, setConnections] = useState({
    youtube: { status: "disconnected", accountInfo: null, loading: false },
    instagram: { status: "disconnected", accountInfo: null, loading: false },
    facebook: { status: "disconnected", accountInfo: null, loading: false },
  });
  const [error, setError] = useState("");

  // SNS 플랫폼 정보
  const platforms = {
    youtube: {
      name: "YouTube",
      icon: Youtube,
      color: "red",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      buttonColor: "bg-red-600 hover:bg-red-700",
      description: "동영상/쇼츠",
    },
    instagram: {
      name: "Instagram",
      icon: Instagram,
      color: "pink",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
      description: "게시물/릴스",
    },
    facebook: {
      name: "Facebook",
      icon: Facebook,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      description: "게시물/릴스",
    },
  };

  // 컴포넌트 마운트 시 모든 연동 상태 확인
  useEffect(() => {
    if (currentStoreId) {
      checkAllConnections();
    }
  }, [currentStoreId]);

  // Mock 데이터 초기화
  useEffect(() => {
    if (useMockData) {
      setConnections({
        youtube: {
          status: "connected",
          accountInfo: {
            channelName: "테스트 카페 공식 채널",
            channelId: "UCtest123456789",
            subscriberCount: 1250,
          },
          loading: false,
        },
        instagram: {
          status: "disconnected",
          accountInfo: null,
          loading: false,
        },
        facebook: { status: "disconnected", accountInfo: null, loading: false },
      });
    }
  }, [useMockData]);

  // 모든 SNS 연동 상태 확인
  const checkAllConnections = async () => {
    if (useMockData) return;

    const platformKeys = Object.keys(platforms);

    for (const platform of platformKeys) {
      await checkConnectionStatus(platform);
    }
  };

  // 특정 SNS 연동 상태 확인
  const checkConnectionStatus = async (platform) => {
    if (useMockData) return;

    try {
      setConnections((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], loading: true },
      }));

      const response = await snsApi.account.getAccountInfo(
        platform,
        currentStoreId
      );

      setConnections((prev) => ({
        ...prev,
        [platform]: {
          status: "connected",
          accountInfo: response.data,
          loading: false,
        },
      }));
    } catch (error) {
      if (error.response?.status === 404) {
        setConnections((prev) => ({
          ...prev,
          [platform]: {
            status: "disconnected",
            accountInfo: null,
            loading: false,
          },
        }));
      } else {
        setConnections((prev) => ({
          ...prev,
          [platform]: {
            status: "error",
            accountInfo: null,
            loading: false,
          },
        }));
      }
    }
  };

  // SNS 계정 연동 시작
  const startIntegration = async (platform) => {
    if (!currentStoreId) {
      setError("스토어를 먼저 선택해주세요.");
      return;
    }

    try {
      setError("");
      setConnections((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], status: "connecting", loading: true },
      }));

      if (useMockData) {
        // 🧪 개발용: Mock API 호출로 실제 OAuth URL 받기
        try {
          const response = await fetch(`/api/sns/oauth/${platform}/url`, {
            headers: {
              "X-USER-ID": currentUser.id.toString(),
              "X-STORE-ID": currentStoreId.toString(),
            },
          });

          if (!response.ok) {
            throw new Error("OAuth URL 요청 실패");
          }

          const authUrl = await response.text();

          // 새 창에서 실제 OAuth 페이지 열기
          const authWindow = window.open(
            authUrl,
            `${platform}-auth`,
            "width=600,height=700,scrollbars=yes,resizable=yes"
          );

          // 테스트용: 창이 닫히면 Mock 연동 완료 시뮬레이션
          const checkAuth = setInterval(async () => {
            try {
              if (authWindow.closed) {
                clearInterval(checkAuth);
                setTimeout(() => {
                  setConnections((prev) => ({
                    ...prev,
                    [platform]: {
                      status: "connected",
                      accountInfo: {
                        channelName: `${platforms[platform].name} 테스트 계정`,
                        channelId: `${platform}_test_${Date.now()}`,
                        subscriberCount:
                          Math.floor(Math.random() * 5000) + 1000,
                      },
                      loading: false,
                    },
                  }));
                }, 1000);
              }
            } catch {
              // 크로스 오리진 에러는 무시
            }
          }, 1000);
        } catch (error) {
          console.error("Mock OAuth URL 요청 실패:", error);
          setConnections((prev) => ({
            ...prev,
            [platform]: { ...prev[platform], status: "error", loading: false },
          }));
          setError(
            `${platforms[platform].name} OAuth URL 요청에 실패했습니다.`
          );
        }
        return;
      }

      // OAuth URL 요청
      const response = await snsApi.oauth.getAuthUrl(platform, currentStoreId);
      const authUrl = response.data;

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
            }, 1000);
          }
        } catch {
          // 크로스 오리진 에러는 무시
        }
      }, 1000);

      // 10분 후 타임아웃
      setTimeout(() => {
        clearInterval(checkAuth);
        if (!authWindow.closed) {
          authWindow.close();
        }
        if (connections[platform].status === "connecting") {
          setConnections((prev) => ({
            ...prev,
            [platform]: { ...prev[platform], status: "error", loading: false },
          }));
          setError("인증 시간이 초과되었습니다. 다시 시도해주세요.");
        }
      }, 600000);
    } catch (err) {
      console.error("연동 실패:", err);
      setConnections((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], status: "error", loading: false },
      }));
      setError(
        `${platforms[platform].name} 연동 중 오류가 발생했습니다. 다시 시도해주세요.`
      );
    }
  };

  // 연결 해제
  const disconnectAccount = async (platform) => {
    if (
      !confirm(
        `정말로 ${platforms[platform].name} 계정 연동을 해제하시겠습니까?\n\n⚠️ 연동 해제 시 예약된 게시물이 취소될 수 있습니다.`
      )
    ) {
      return;
    }

    try {
      setConnections((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], loading: true },
      }));

      if (useMockData) {
        // 🧪 개발용: Mock 연동 해제
        setTimeout(() => {
          setConnections((prev) => ({
            ...prev,
            [platform]: {
              status: "disconnected",
              accountInfo: null,
              loading: false,
            },
          }));
        }, 1000);
        return;
      }

      // TODO: 실제 연결 해제 API 구현 필요
      setConnections((prev) => ({
        ...prev,
        [platform]: {
          status: "disconnected",
          accountInfo: null,
          loading: false,
        },
      }));
    } catch {
      setError(`${platforms[platform].name} 연결 해제 중 오류가 발생했습니다.`);
      setConnections((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], loading: false },
      }));
    }
  };

  const connectedCount = Object.values(connections).filter(
    (conn) => conn.status === "connected"
  ).length;

  if (!currentStoreId) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="text-center bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
          <AlertCircle size={48} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            스토어를 선택해주세요
          </h2>
          <p className="text-gray-600">
            SNS 계정 연동을 위해서는 먼저 스토어를 선택해야 합니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* 🧪 테스트 모드 표시 */}
      {useMockData && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              🧪
            </div>
            <div>
              <p className="text-sm font-bold text-blue-800">
                테스트 모드: Mock 데이터를 사용하여 SNS 연동 기능을 테스트
                중입니다.
              </p>
              <p className="text-xs text-blue-600">
                사용자: {currentUser?.name} | 스토어 ID: {currentStoreId}
              </p>
            </div>
          </div>
        </div>
      )}

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
            <div>
              <p className="text-red-800 font-medium">{error}</p>
              <button
                onClick={() => setError("")}
                className="text-red-600 text-sm underline mt-1 hover:text-red-700"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SNS 플랫폼 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(platforms).map(([key, platform]) => {
          const connection = connections[key];
          const IconComponent = platform.icon;
          const isConnected = connection.status === "connected";
          const isConnecting = connection.status === "connecting";
          const hasError = connection.status === "error";

          return (
            <div
              key={key}
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
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
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
                    className={`w-16 h-16 mx-auto rounded-2xl ${platform.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${
                        platform.color === "red"
                          ? "text-red-600"
                          : platform.color === "pink"
                          ? "text-pink-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {platform.description}
                  </p>
                </div>

                {/* 액션 버튼 */}
                <div className="space-y-3">
                  {isConnected ? (
                    <button
                      onClick={() => disconnectAccount(key)}
                      disabled={connection.loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 disabled:opacity-50 transition-all duration-200 font-medium"
                    >
                      <Unlink className="w-5 h-5" />
                      {connection.loading ? "처리 중..." : "연결 해제"}
                    </button>
                  ) : (
                    <button
                      onClick={() => startIntegration(key)}
                      disabled={
                        isConnecting ||
                        connection.loading ||
                        (key !== "youtube" && !useMockData)
                      }
                      className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 ${
                        key !== "youtube" && !useMockData
                          ? "bg-gray-400"
                          : platform.buttonColor
                      }`}
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          연결 중...
                        </>
                      ) : key !== "youtube" && !useMockData ? (
                        <>
                          <IconComponent className="w-5 h-5" />
                          준비 중
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
      <div className="mt-12">
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              SNS 계정 연동 방법
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">플랫폼 선택</h4>
              <p className="text-sm text-gray-600">
                연동하려는 SNS 플랫폼의 "연동하기" 버튼을 클릭하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">계정 로그인</h4>
              <p className="text-sm text-gray-600">
                새 창에서 해당 SNS 계정으로 로그인하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">권한 승인</h4>
              <p className="text-sm text-gray-600">
                콘텐츠 업로드 및 관리를 위한 권한을 승인하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                ✓
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">연동 완료</h4>
              <p className="text-sm text-gray-600">
                이제 간편하게 SNS 마케팅을 할 수 있어요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
