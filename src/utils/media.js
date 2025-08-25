/**
 * 미디어 관련 유틸리티 함수들
 */

/**
 * 파일명에서 확장자를 추출합니다
 * @param {string} filename - 파일명
 * @returns {string|undefined} - 소문자 확장자
 */
export const getFileExtension = (filename) => {
  return filename?.toLowerCase().split(".").pop();
};

/**
 * 비디오 파일인지 확인합니다
 * @param {string} filename - 원본 파일명
 * @param {string} contentType - MIME 타입
 * @param {string} url - 파일 URL
 * @param {string} type - 콘텐츠 타입
 * @returns {boolean} - 비디오 파일 여부
 */
export const isVideoFile = (filename, contentType, url, type) => {
  const videoExtensions = ["mp4", "avi", "mov", "webm", "mkv", "flv", "m4v"];
  const extension = getFileExtension(filename) || getFileExtension(url);

  return (
    contentType?.includes("video") ||
    videoExtensions.includes(extension) ||
    type === "video" ||
    type === "content"
  );
};

/**
 * 이미지 파일인지 확인합니다
 * @param {string} filename - 원본 파일명
 * @param {string} contentType - MIME 타입
 * @param {string} url - 파일 URL
 * @param {string} type - 콘텐츠 타입
 * @returns {boolean} - 이미지 파일 여부
 */
export const isImageFile = (filename, contentType, url, type) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
  const extension = getFileExtension(filename) || getFileExtension(url);

  return (
    contentType?.includes("image") ||
    imageExtensions.includes(extension) ||
    type === "image"
  );
};

/**
 * 미디어 타입을 감지합니다
 * @param {Object} content - 콘텐츠 객체
 * @returns {string} - 'video', 'image', 'unknown'
 */
export const detectMediaType = (content) => {
  const { originalName, contentType, url, type } = content;

  if (isVideoFile(originalName, contentType, url, type)) {
    return "video";
  }

  if (isImageFile(originalName, contentType, url, type)) {
    return "image";
  }

  return "unknown";
};

/**
 * 파일 크기를 사람이 읽기 쉬운 형태로 변환합니다
 * @param {number} bytes - 바이트 단위 크기
 * @returns {string} - 포맷된 크기 문자열
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * 비디오 duration을 포맷합니다
 * @param {number} seconds - 초 단위 시간
 * @returns {string} - 포맷된 시간 문자열 (예: "1:30", "10:05")
 */
export const formatDuration = (seconds) => {
  if (!seconds) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
