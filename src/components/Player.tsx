
import { usePlayer } from "@/context/PlayerContext";
import PlayerControls from "./PlayerControls";
import TimerDisplay from "./TimerDisplay";
import { Icon } from "./Icon";

const Player = () => {
  const { state } = usePlayer();
  const { currentSound, currentBackground, isHidden, isMixMode, useBackgroundFromSound } = state;

  // Determine which background image to use
  const backgroundImage = (!isMixMode && currentSound?.backgroundUrl && useBackgroundFromSound) 
    ? currentSound.backgroundUrl
    : currentBackground.url;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0" />
        
        {/* Background image */}
        <img
          src={backgroundImage}
          alt={currentBackground.name}
          className="object-cover w-full h-full opacity-80"
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
              <div className="flex items-center justify-center gap-1 mb-1">
                <Icon name={currentSound.icon} size={16} className="text-white/70" />
                <span className="text-white text-base font-light">{currentSound.name}</span>
              </div>
              <p className="text-white/70 text-xs mt-1">{currentSound.category}</p>
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
