"use client";

import { useState, useEffect, useRef } from "react";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Assuming the user will place elevator_music.mp3 in public/audio/
    audioRef.current = new Audio('/audio/elevator_music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Background subtle volume

    // Playback may fail without user interaction.
    // However, if the user interacts with the app, we can try to play it.
    const handleInitialInteraction = () => {
      if (!isPlaying && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay was blocked
        });
        window.removeEventListener('click', handleInitialInteraction);
        window.removeEventListener('keydown', handleInitialInteraction);
      }
    };

    window.addEventListener('click', handleInitialInteraction);
    window.addEventListener('keydown', handleInitialInteraction);

    return () => {
      window.removeEventListener('click', handleInitialInteraction);
      window.removeEventListener('keydown', handleInitialInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
         setIsPlaying(true);
      }).catch(err => console.log('Audio playback prevented', err));
    }
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-9999 bg-white border-4 border-yellow-400 text-yellow-500 hover:bg-yellow-50 active:scale-95 p-3 rounded-full shadow-lg transition-all flex items-center justify-center"
      title={isPlaying ? "Silenciar Música" : "Reproducir Música"}
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 14v-4a2 2 0 012-2h3l4-4v16l-4-4H7a2 2 0 01-2-2z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h2.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      )}
    </button>
  );
}
