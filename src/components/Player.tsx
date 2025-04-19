
import { usePlayer } from "@/context/PlayerContext";
import { useEffect, useState } from "react";
import PlayerControls from "./PlayerControls";
import TimerDisplay from "./TimerDisplay";

const Player = () => {
  const { state } = usePlayer();
  const { currentSound, currentBackground, isHidden, isMixMode, useBackgroundFromSound } = state;
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Determine which background image to use
  const backgroundImage = (!isMixMode && currentSound?.backgroundUrl && useBackgroundFromSound) 
    ? currentSound.backgroundUrl
    : currentBackground.url;

  if (isLoading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="animate-pulse text-white/50 text-xl font-light">
          Loading Serene Sounds...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Image with fadeIn effect */}
      <div className="absolute inset-0 z-0 animate-fade-in">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0" />
        
        {/* Background image */}
        <img
          src={backgroundImage}
          alt={currentBackground.name}
          className="object-cover w-full h-full opacity-80 transition-opacity duration-1000"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 z-0" />
      </div>

      {/* Sound Information Display */}
      {!isHidden && (
        <div className="absolute top-3 left-0 w-full text-center z-10">
          {state.isMixMode ? (
            <p className="text-white/70 text-sm mt-1">
              {state.activeSounds.length} sound{state.activeSounds.length !== 1 ? 's' : ''} playing
            </p>
          ) : currentSound ? (
            <>
              <span className="text-white text-base font-light">{currentSound.name}</span>
            </>
          ) : (
            <p className="text-white/70 text-sm">Select a sound to begin</p>
          )}
        </div>
      )}

      {/* Timer Display */}
      <TimerDisplay />

      {/* Player Controls */}
      <PlayerControls />
    </div>
  );
};

export default Player;
