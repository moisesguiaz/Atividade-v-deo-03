'use client';
import { useState, useRef, useEffect } from 'react';
import './style.css';

const videos = [
  {
    title: 'Homem com H',
    artist: 'Ney Matogrosso',
    src: '/video.mp4',
    poster: '/HOMEM-COM-H.jpg',
  },
  {
    title: 'Poema',
    artist: 'Ney Matogrosso',
    src: '/poema.mp4',
    poster: '/poema.jpeg',
  },
  {
    title: 'Sangue Latino',
    artist: 'Ney Matogrosso',
    src: '/sangue-latino.mp4',
    poster: '/sangue-latino.jpeg',
  },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
  
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const setDurationOnLoad = () => setDuration(video.duration);
  
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadedmetadata', setDurationOnLoad);
  
  
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadedmetadata', setDurationOnLoad);
    
    };
  }, []);
  

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  const handleSelectVideo = (video: typeof currentVideo) => {
    setCurrentVideo(video);
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const handleVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = false;
    }
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="main-container">
      <div className="video-list">
        <h3>Playlist</h3>
        {videos.map((video, index) => (
          <div key={index} className="video-card" onClick={() => handleSelectVideo(video)}>
            <img src={video.poster} alt={video.title} />
            <h4>{video.title}</h4>
            <p>{video.artist}</p>
          </div>
        ))}
      </div>

      <div className="player-container">
        <div className="image-container">
          <video ref={videoRef} poster={currentVideo.poster}>
            <source src={currentVideo.src} type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
        </div>

        {/* ⏱ Barra de Progresso */}
        <div className="progress-bar">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
          />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="controls">
          <button className="circle" onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}>⏪</button>
          <button className="circle play" onClick={handlePlayPause}>
            {isPlaying ? '❚❚' : '►'}
          </button>
          <button className="circle" onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}>⏩</button>

          {/* 🔊 Volume */}
          <div className="volume-container">
            <button onClick={toggleMute}>{videoRef.current?.muted ? '🔇' : '🔊'}</button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeSlider}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
