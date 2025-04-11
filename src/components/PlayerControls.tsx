
import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { 
  Play, Pause, Timer, Image, Eye, EyeOff, 
  RefreshCcw, ChevronDown
} from "lucide-react";
import { sounds } from "@/data/soundData";
import SoundIcon from "./SoundIcon";
import TimerModal from "./TimerModal";
import BackgroundGallery from "./BackgroundGallery";
import ExploreModal from "./ExploreModal";
import { cn } from "@/lib/utils";

const PlayerControls = () => {
  const { state, togglePlayPause, toggleHideInterface, resetTimer } = usePlayer();
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isBackgroundGalleryOpen, setIsBackgroundGalleryOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  
  // Only show these elements when interface is not hidden
  if (state.isHidden) {
    return (
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        <div className="flex gap-3">
          <button
            onClick={toggleHideInterface}
            className="control-button w-12 h-12"
            title="Show interface"
          >
            <Eye className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Sound Category Grid */}
      <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
          {sounds.map(sound => (
            <SoundIcon key={sound.id} sound={sound} />
          ))}
        </div>
      </div>
      
      {/* Main Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        {/* Primary Controls */}
        <div className="flex gap-4 items-center">
          {/* Left Controls */}
          <div className="flex gap-2">
            {/* Timer Button */}
            <button
              onClick={() => setIsTimerModalOpen(true)}
              className="control-button"
              title="Set timer"
            >
              <Timer className="w-5 h-5" />
            </button>
            
            {/* Reset Button (only when timer is active) */}
            {state.timer.isActive && (
              <button
                onClick={resetTimer}
                className="control-button"
                title="Reset timer"
              >
                <RefreshCcw className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center",
              state.isPlaying 
                ? "bg-white text-black hover:bg-white/90"
                : "bg-player-medium text-white hover:bg-player-light border border-white/10"
            )}
            title={state.isPlaying ? "Pause" : "Play"}
          >
            {state.isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7" />
            )}
          </button>
          
          {/* Right Controls */}
          <div className="flex gap-2">
            {/* Hide Interface Button */}
            <button
              onClick={toggleHideInterface}
              className="control-button"
              title="Hide interface"
            >
              <EyeOff className="w-5 h-5" />
            </button>
            
            {/* Background Gallery Button */}
            <button
              onClick={() => setIsBackgroundGalleryOpen(true)}
              className="control-button"
              title="Background gallery"
            >
              <Image className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Explore Button */}
        <button
          onClick={() => setIsExploreModalOpen(true)}
          className="bg-player-medium/80 hover:bg-player-medium text-white/80 hover:text-white px-6 py-2 rounded-full text-sm flex items-center gap-1 transition-colors"
        >
          Explore <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      {/* Modals */}
      <TimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
      />
      <BackgroundGallery
        isOpen={isBackgroundGalleryOpen}
        onClose={() => setIsBackgroundGalleryOpen(false)}
      />
      <ExploreModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
      />
    </>
  );
};

export default PlayerControls;
