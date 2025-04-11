
import { usePlayer } from "@/context/PlayerContext";
import PlayerControls from "./PlayerControls";
import TimerDisplay from "./TimerDisplay";

const Player = () => {
  const { state } = usePlayer();
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

      {/* Sound Title */}
      {!isHidden && currentSound && (
        <div className="absolute top-12 left-0 w-full text-center z-10">
          <h1 className="text-white text-3xl font-light">{currentSound.category}</h1>
          <p className="text-white/70 mt-1">{currentSound.name}</p>
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
