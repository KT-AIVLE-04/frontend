import { CheckCircle, Clock, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useShortformGeneration } from "../../context/ShortformGenerationContext";
import { shortApi } from "../../../../api/short";
import { VideoPreview } from "./VideoPreview";

export const ShortsGeneration = ({ setContentType }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);

  const {
    jobId,
    jobStatus,
    setJobStatus,
    progress,
    setProgress,
    videoUrl,
    videoKey,
    setVideoKey,
    setVideoUrl,
    jobError,
    setJobError,
    setActiveStep,
    resetToInputStep,
  } = useShortformGeneration();

  useEffect(() => {
    if (
      jobId &&
      (jobStatus === "QUEUED" || jobStatus === "RUNNING" || !jobStatus)
    ) {
      const interval = setInterval(async () => {
        try {
          const getJobStatusResponse = await shortApi.getJobStatus(jobId);
          console.log("Job 상태 조회 응답:", getJobStatusResponse);

          if (getJobStatusResponse.data.isSuccess) {
            const getJobStatusResponseData = getJobStatusResponse.data.result;

            setJobStatus(getJobStatusResponseData.status);
            setProgress(getJobStatusResponseData.progress || 0);

            if (getJobStatusResponseData.status === "SUCCEEDED") {
              setVideoKey(getJobStatusResponseData.key);
              setVideoUrl(getJobStatusResponseData.videoUrl);
              clearInterval(interval);
              console.log(
                "비디오 생성 완료:",
                getJobStatusResponseData.key,
                getJobStatusResponseData.videoUrl
              );
            } else if (
              getJobStatusResponseData.status === "FAILED" ||
              getJobStatusResponseData.status === "CANCELED"
            ) {
              setJobError(
                getJobStatusResponseData.error || "작업이 실패했습니다."
              );
              clearInterval(interval);
              console.error("작업 실패:", getJobStatusResponseData.error);
            }
          }
        } catch (error) {
          console.error("Job 상태 확인 실패:", error);
          // 네트워크 에러 등의 경우 폴링을 계속 시도
        }
      }, 3000); // 3초마다 상태 확인

      setPollingInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [
    jobId,
    jobStatus,
    setJobStatus,
    setProgress,
    videoKey,
    setVideoKey,
    setVideoUrl,
    setJobError,
  ]);

  // 컴포넌트 언마운트 시 폴링 정리
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleRegenerate = () => {
    const userConfirmed = window.confirm(
      "정보 입력 단계로 돌아가시겠습니까?\n\n매장 정보와 광고 정보를 수정하고 시나리오를 다시 생성할 수 있습니다."
    );

    if (userConfirmed) {
      resetToInputStep();
    }
  };

  const handleSave = async () => {
    if (!videoUrl) {
      alert("저장할 비디오가 없습니다.");
      return;
    }

    if (isSaving || isSaved) {
      return;
    }

    try {
      setIsSaving(true);
      console.log("숏폼 저장 시작 - VideoKey:", videoKey);
      const response = await shortApi.saveShorts(videoKey);
      console.log("숏폼 저장 성공:", response.data);
      alert("숏폼이 성공적으로 저장되었습니다!");
      setIsSaved(true);
    } catch (error) {
      console.error("숏폼 저장 실패:", error);
      alert("숏폼 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  // 에러 상태 처리
  if (jobStatus === "FAILED" || jobStatus === "CANCELED" || jobError) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">콘텐츠 생성</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <h3 className="text-lg font-medium mb-2 text-red-800">
            콘텐츠 생성에 실패했습니다
          </h3>
          <p className="text-sm text-red-600 mb-6">
            {jobError || "알 수 없는 오류가 발생했습니다."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setActiveStep(2)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              시나리오 다시 선택
            </button>
            <button
              onClick={handleRegenerate}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              처음부터 다시 시작
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 비디오 생성 완료 시 VideoPreview 표시
  if (jobStatus === "SUCCEEDED" && videoUrl) {
    return (
      <VideoPreview
        videoUrl={videoUrl}
        onRegenerate={handleRegenerate}
        onSave={handleSave}
        isSaving={isSaving}
        isSaved={isSaved}
      />
    );
  }

  // 생성 중 상태 표시
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">콘텐츠 생성</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Sparkles size={48} className="text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">
          AI가 숏폼을 생성하고 있습니다
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          선택한 시나리오를 바탕으로 고품질 숏폼을 제작 중입니다. 잠시만
          기다려주세요.
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 max-w-md mx-auto">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mb-8">
          {progress}% 완료 ({jobStatus || "대기 중"})
        </p>

        <div className="flex flex-col items-center space-y-2 max-w-xs mx-auto">
          <div className="flex items-center w-full">
            <CheckCircle size={16} className="text-green-500 mr-2" />
            <span className="text-sm">시나리오 분석 완료</span>
          </div>
          <div className="flex items-center w-full">
            <CheckCircle size={16} className="text-green-500 mr-2" />
            <span className="text-sm">영상 소재 준비 완료</span>
          </div>
          <div
            className={`flex items-center w-full ${
              progress > 50 ? "text-green-600" : "text-blue-500"
            }`}
          >
            {progress > 50 ? (
              <CheckCircle size={16} className="text-green-500 mr-2" />
            ) : (
              <Clock size={16} className="text-blue-500 mr-2" />
            )}
            <span className="text-sm">
              영상 렌더링 {progress > 50 ? "완료" : "중..."}
            </span>
          </div>
          <div
            className={`flex items-center w-full ${
              progress === 100 ? "text-green-600" : "text-gray-400"
            }`}
          >
            {progress === 100 ? (
              <CheckCircle size={16} className="text-green-500 mr-2" />
            ) : (
              <Clock size={16} className="mr-2" />
            )}
            <span className="text-sm">
              최종 처리 {progress === 100 ? "완료" : "대기 중"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
