import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Save } from 'lucide-react';

export const VideoPreview = ({ videoUrl, onRegenerate, onSave, isSaving = false, isSaved = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateTime = () => {
        if (!isDragging) {
          setCurrentTime(video.currentTime);
        }
      };
      const updateDuration = () => setDuration(video.duration);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      
      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateDuration);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      
      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', updateDuration);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, [isDragging]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoLoad = () => {
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    
    if (video && duration > 0) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleSeek(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">생성된 영상</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="aspect-[9/16] max-w-sm mx-auto bg-black rounded-lg overflow-hidden relative mb-6">
          {videoError ? (
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center">
                <div className="text-red-400 mb-2">⚠️</div>
                <p className="text-sm">영상을 불러올 수 없습니다</p>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                id="preview-video"
                src={videoUrl}
                className="w-full h-full object-cover"
                onLoadedData={handleVideoLoad}
                onError={handleVideoError}
                onEnded={handleVideoEnd}
                controls={false}
                preload="metadata"
              />
              
              {/* 커스텀 플레이 버튼 */}
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={handlePlayPause}
              >
                {!isPlaying && (
                  <div className="bg-black bg-opacity-50 rounded-full p-4">
                    <Play size={32} className="text-white" />
                  </div>
                )}
              </div>
              
              {/* 일시정지 버튼 (재생 중일 때) */}
              {isPlaying && (
                <div 
                  className="absolute top-4 right-4 cursor-pointer"
                  onClick={handlePlayPause}
                >
                  <div className="bg-black bg-opacity-50 rounded-full p-2">
                    <Pause size={20} className="text-white" />
                  </div>
                </div>
              )}
              
              {/* 재생바 컨트롤 */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-2 text-white text-xs">
                  <span>{formatTime(currentTime)}</span>
                  <div 
                    ref={progressRef}
                    className="flex-1 h-2 bg-white/30 rounded-full cursor-pointer relative"
                    onMouseDown={handleMouseDown}
                  >
                    <div 
                      className="h-full bg-white rounded-full relative transition-all duration-75"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    >
                      <div 
                        className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-transform ${
                          isDragging ? 'scale-125' : ''
                        }`}
                      ></div>
                    </div>
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-2">
            AI가 생성한 광고 영상입니다
          </p>
          <p className="text-xs text-gray-500">
            마음에 들지 않으시면 다시 생성하거나 수정할 수 있습니다
          </p>
        </div>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} />
            다시 생성하기
          </button>
          
          <button
            onClick={onSave}
            disabled={isSaving || isSaved}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
              isSaved 
                ? 'bg-green-600 text-white cursor-not-allowed opacity-80' 
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <Save size={16} />
            {isSaving ? '저장 중...' : isSaved ? '저장완료' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  );
};