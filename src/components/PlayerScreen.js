import React, { useState, useRef, useEffect } from 'react';
import TimecodeList from './TimecodeList';

const PlayerScreen = ({ videoFile, timecodes, updateTimecodeResponse, onExport }) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTimecode, setActiveTimecode] = useState(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16/9);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoFile && (!videoElement.src || !videoElement.src.includes(videoFile))) {
      videoElement.src = `file://${videoFile}`;
    }
  }, [videoFile]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);

      if (activeTimecode !== null) {
        const activeTC = timecodes.find(t => t.id === activeTimecode);
        if (activeTC && videoElement.currentTime >= activeTC.endSeconds) {
          videoElement.pause();
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (videoElement.videoWidth && videoElement.videoHeight) {
        setVideoAspectRatio(videoElement.videoWidth / videoElement.videoHeight);
      }
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoFile, activeTimecode, timecodes]);

  const playTimecode = (id) => {
    const timecode = timecodes.find(t => t.id === id);
    if (timecode) {
      const videoElement = videoRef.current;
      videoElement.currentTime = timecode.startSeconds;
      videoElement.play()
        .then(() => {
          setActiveTimecode(id);
        })
        .catch(error => {
          console.error('Ошибка воспроизведения:', error);
        });
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="player-screen">
      <div className={`player-container ${videoAspectRatio <= 1 ? 'square-video' : ''}`}>
        <div className="video-section">
          <div className="fixed-video-container">
            <div className="video-header">
              <h2>Просмотр</h2>
              <div className="current-time-display">
                {formatTime(currentTime)}
              </div>
            </div>

            <div className="video-wrapper" style={{ aspectRatio: videoAspectRatio }}>
              <video
                ref={videoRef}
                controls
              />
            </div>

            <div className="preview-section">
              <div>&copy; {new Date().getFullYear()} <a href="https://edwardcode.net/" target="_blank">Eduard Ilin</a></div>
            </div>
          </div>
        </div>

        <div className="timecodes-section">
          <div className="timecodes-header">
            <h3>Метки</h3>
            <button className="export-button" onClick={onExport}>
              Экспорт в CSV
            </button>
          </div>

          <TimecodeList
            timecodes={timecodes}
            activeTimecode={activeTimecode}
            onPlay={playTimecode}
            updateResponse={updateTimecodeResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerScreen;
