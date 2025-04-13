'use client';

import { useState, useRef, useEffect } from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverArt: string;
  audioUrl: string;
  extraContent?: React.ReactNode;
}

interface MusicPlayerProps {
  playlist: Song[];
  initialSong?: number;
}

export default function MusicPlayer({ playlist, initialSong = 0 }: MusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSong);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = playlist[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => 
      prevIndex === playlist.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) => 
      prevIndex === 0 ? playlist.length - 1 : prevIndex - 1
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = event.currentTarget;
      const clickPosition = event.clientX - progressBar.getBoundingClientRect().left;
      const progressBarWidth = progressBar.offsetWidth;
      const percentage = (clickPosition / progressBarWidth) * 100;
      const newTime = (percentage / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(percentage);
    }
  };

  const handleSongSelect = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
      <div className="relative aspect-square mb-4">
        <img
          src={currentSong.coverArt}
          alt={`${currentSong.title} cover art`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-white">{currentSong.title}</h3>
        <p className="text-gray-400">{currentSong.artist}</p>
      </div>

      <div
        className="h-1 bg-gray-700 rounded-full mb-4 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-yellow-400 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex justify-center items-center gap-6">
        <button
          onClick={handlePrevious}
          className="text-white hover:text-yellow-400 transition"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handlePlayPause}
          className="bg-yellow-400 text-black rounded-full p-4 hover:bg-yellow-300 transition"
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleNext}
          className="text-white hover:text-yellow-400 transition"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-white font-semibold mb-2">Up Next</h3>
        <div className="space-y-2">
          {playlist.map((song, index) => (
            <div
              key={song.id}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                currentSongIndex === index ? 'bg-gray-700' : 'hover:bg-gray-700/50'
              }`}
              onClick={() => handleSongSelect(index)}
            >
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={song.coverArt}
                  alt={song.title}
                  className="w-10 h-10 rounded"
                  onError={(e) => { e.currentTarget.src = '/images/logo.png'; }}
                />
                <div>
                  <p className="text-white font-medium">{song.title}</p>
                  <p className="text-gray-400 text-sm">{song.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {song.extraContent}
                <span className="text-gray-400 text-sm">{song.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 