
import { usePlayer } from "@/context/PlayerContext";
import PlayerControls from "./PlayerControls";
import TimerDisplay from "./TimerDisplay";
import { useEffect } from "react";

const Player = () => {
  const { state } = usePlayer();
  const { currentSound, currentBackground, isHidden, isMixMode, useBackgroundFromSound } = state;

  // Determine which background image to use
  const backgroundImage = (!isMixMode && currentSound?.backgroundUrl && useBackgroundFromSound) 
    ? currentSound.backgroundUrl
    : currentBackground.url;

  // Update document title based on current sound
  useEffect(() => {
    if (currentSound && state.isPlaying) {
      document.title = `Playing: ${currentSound.name} | Serene Soundscapes`;
    } else {
      document.title = "Serene Soundscapes Player";
    }
  }, [currentSound, state.isPlaying]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Image with smooth transition */}
      <div className="absolute inset-0 z-0">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0" />
        
        {/* Background image with animation */}
        <img
          src={backgroundImage}
          alt={currentBackground.name}
          className="object-cover w-full h-full opacity-80 transition-opacity duration-1000"
          loading="eager"
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
