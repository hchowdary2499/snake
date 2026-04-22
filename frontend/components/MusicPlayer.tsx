import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

interface MusicPlayerProps {
  autoPlay?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ autoPlay = false }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  // Handle initial autoplay
  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Autoplay prevented by browser:", err);
        setIsPlaying(false);
      });
    }
  }, [autoPlay]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border border-neon-pink/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,0,255,0.15)] relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-neon-pink/20 to-neon-purple/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 -z-10"></div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-neon-cyan flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.4)]">
            <Music className={`w-6 h-6 text-neon-cyan ${isPlaying ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg tracking-wide drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
              {currentTrack.title}
            </h3>
            <p className="text-neon-pink text-sm font-medium drop-shadow-[0_0_2px_rgba(255,0,255,0.8)]">
              {currentTrack.artist}
            </p>
          </div>
        </div>
        <button 
          onClick={toggleMute}
          className="text-gray-400 hover:text-neon-cyan transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          className="h-2 w-full bg-gray-800 rounded-full cursor-pointer overflow-hidden border border-gray-700"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_#fff]"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-8">
        <button 
          onClick={handlePrev}
          className="text-gray-300 hover:text-neon-pink hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] transition-all transform hover:scale-110"
        >
          <SkipBack className="w-8 h-8 fill-current" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-800 border-2 border-neon-green text-neon-green shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] hover:bg-gray-700 transition-all transform hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>
        
        <button 
          onClick={handleNext}
          className="text-gray-300 hover:text-neon-pink hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] transition-all transform hover:scale-110"
        >
          <SkipForward className="w-8 h-8 fill-current" />
        </button>
      </div>
    </div>
  );
};
