
import { usePlayer } from "@/context/PlayerContext";
import PlayerControls from "./PlayerControls";
import TimerDisplay from "./TimerDisplay";
import { Icon } from "./Icon";
import { Layers, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Player = () => {
  const { state, toggleMixMode } = usePlayer();
  const { currentSound, currentBackground, isHidden } = state;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0" />
        
        {/* Background image */}
        <img
          src={currentBackground.url}
          alt={currentBackground.name}
          className="object-cover w-full h-full opacity-80"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 z-0" />
      </div>

      {/* Mode Selector and Sound Title */}
      {!isHidden && (
        <div className="absolute top-3 left-0 w-full text-center z-10">
          {/* Mode Switcher Tabs */}
          <div className="flex justify-center gap-3 mb-4">
            <button 
              onClick={() => state.isMixMode && toggleMixMode()}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full transition-colors",
                !state.isMixMode 
                  ? "bg-white/20 text-white" 
                  : "bg-transparent text-white/50 hover:text-white/70"
              )}
            >
              <PlayCircle size={18} />
              <span>Play</span>
            </button>

            <button 
              onClick={() => !state.isMixMode && toggleMixMode()}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full transition-colors",
                state.isMixMode 
                  ? "bg-white/20 text-white" 
                  : "bg-transparent text-white/50 hover:text-white/70"
              )}
            >
              <Layers size={18} />
              <span>Mix</span>
            </button>
          </div>

          {/* Sound Information Display */}
          {state.isMixMode ? (
            <p className="text-white/70 mt-1">
              {state.activeSounds.length} sound{state.activeSounds.length !== 1 ? 's' : ''} playing
            </p>
          ) : currentSound ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon name={currentSound.icon} size={20} className="text-white/70" />
                <span className="text-white text-lg font-light">{currentSound.name}</span>
              </div>
              <p className="text-white/70 mt-1">{currentSound.category}</p>
            </>
          ) : (
            <p className="text-white/70">Select a sound to begin</p>
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
