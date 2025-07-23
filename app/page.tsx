'use client';
import { useEffect, useRef, useState } from 'react';
import './style.css';

const videoList = [
  {
    title: 'Homem com H',
    artist: 'Ney Matogrosso',
    src: '/video.mp4',
    thumbnail: '/HOMEM-COM-H.jpg',
  },
  {
    title: 'Poema',
    artist: 'Ney Matogrosso',
    src: '/poema.mp4',
    thumbnail: '/poema.jpeg',
  },
  {
    title: 'Sangue Latino',
    artist: 'Ney Matogrosso',
    src: '/sangue-latino.mp4',
    thumbnail: '/sangue-latino.jpeg',
  },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentVideo = videoList[currentVideoIndex];

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (delta: number) => {
    if (videoRef.current) {
      let newVolume = videoRef.current.volume + delta;
      newVolume = Math.max(0, Math.min(1, newVolume));
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnded = () => {
    const nextIndex = (currentVideoIndex + 1) % videoList.length;
    setCurrentVideoIndex(nextIndex);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Number(e.target.value);
    }
  };

  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play();
    }
  }, [currentVideoIndex]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="player-container">
      <div className="sidebar">
        {videoList.map((video, index) => (
          <div
            key={index}
            className={`video-card ${index === currentVideoIndex ? 'active' : ''}`}
            onClick={() => {
              setCurrentVideoIndex(index);
              setIsPlaying(true);
            }}
          >
            <img src={video.thumbnail} alt={video.title} />
            <h4>{video.title}</h4>
            <p>{video.artist}</p>
          </div>
        ))}
      </div>

      <div className="video-player">
        <video
          ref={videoRef}
          src={currentVideo.src}
          poster={currentVideo.thumbnail}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          controls={false}
          width="100%"
        />

        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="progress-bar"
        />

        <div className="time-info">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="controls">
          <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}>⏪</button>
          <button onClick={handlePlayPause}>{isPlaying ? '❚❚' : '▶️'}</button>
          <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}>⏩</button>
          <input
  type="range"
  min="0"
  max="1"
  step="0.01"
  defaultValue="1"
  onChange={(e) => {
    if (videoRef.current) {
      videoRef.current.volume = Number(e.target.value);
    }
  }}
  className="volume-slider"
/>

          <button onClick={toggleMute}>🔇</button>
        </div>
      </div>
    </div>
  );
}
