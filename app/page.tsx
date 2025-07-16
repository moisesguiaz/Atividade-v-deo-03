'use client';
import { useRef, useState, useEffect } from 'react';
import './style.css';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <div className="player-container">
      <div className="image-container">
        <video ref={videoRef} width="100%" poster="/HOMEM-COM-H.jpg" controls>
          <source src="/video.mp4" type="video/mp4" />
          Seu navegador não suporta o elemento de vídeo.
        </video>
      </div>
      <div className="song-info">
        <h3>Homem com H</h3>
        <p>Ney Matogrosso</p>
      </div>
      <div className="controls">
        <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}>&laquo;</button>
        <button className="play" onClick={handlePlayPause}>
        {isPlaying ? '❚❚' : '►'}
        </button>
        <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}>&raquo;</button>
        <button
          className="volume"
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = !videoRef.current.muted;
            }
          }}
        >
          &#128266;
        </button>
      </div>
    </div>
  );
}
