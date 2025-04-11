
import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { 
  Play, Pause, Timer, Image, Eye, EyeOff, 
  RefreshCcw, ChevronDown, Layers
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/data/soundData";
import SoundIcon from "./SoundIcon";
import TimerModal from "./TimerModal";
import BackgroundGallery from "./BackgroundGallery";
import ExploreModal from "./ExploreModal";
import MixPanel from "./MixPanel";
import { cn } from "@/lib/utils";

const PlayerControls = () => {
  const { state, togglePlayPause, toggleHideInterface, resetTimer, toggleMixMode, setVolume } = usePlayer();
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isBackgroundGalleryOpen, setIsBackgroundGalleryOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
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
      
      {/* Mix Panel for volume controls */}
      <MixPanel />
      
      {/* Main Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        {/* Volume Slider */}
        {showVolumeSlider && (
          <div className="w-64 bg-player-medium/90 backdrop-blur-sm rounded-full px-4 py-2 mb-2">
            <Slider
              value={[state.volume]}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
              onValueChange={(values) => setVolume(values[0])}
            />
          </div>
        )}
        
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
            
            {/* Mix Mode Toggle */}
            <button
              onClick={toggleMixMode}
              className={cn(
                "control-button",
                state.isMixMode && "bg-white/20 text-white"
              )}
              title={state.isMixMode ? "Switch to single sound mode" : "Switch to mix mode"}
            >
              <Layers className="w-5 h-5" />
            </button>
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
            
            {/* Volume Button */}
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className={cn(
                "control-button",
                showVolumeSlider && "bg-white/20 text-white"
              )}
              title="Volume control"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
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
