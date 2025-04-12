
import { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, Timer, Image, Eye, EyeOff, ChevronUp, Layers } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { sounds } from "@/data/soundData";
import SoundIcon from "./SoundIcon";
import TimerModal from "./TimerModal";
import BackgroundGallery from "./BackgroundGallery";
import ExploreDrawer from "./ExploreDrawer";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import MixModeDrawer from "./MixModeDrawer";
import { useIsMobile } from "@/hooks/use-mobile";

const PlayerControls = () => {
  const {
    state,
    togglePlayPause,
    toggleHideInterface,
    setVolume,
    setShowMixPanel
  } = usePlayer();
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isBackgroundGalleryOpen, setIsBackgroundGalleryOpen] = useState(false);
  const [isExploreDrawerOpen, setIsExploreDrawerOpen] = useState(false);
  const [isMixDrawerOpen, setIsMixDrawerOpen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const isMobile = useIsMobile();
  
  // Sync mix drawer state with context
  useEffect(() => {
    if (state.isMixMode) {
      setIsMixDrawerOpen(true);
    }
  }, [state.isMixMode]);

  // Only show these elements when interface is not hidden
  if (state.isHidden) {
    return <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        <div className="flex gap-3">
          <button onClick={toggleHideInterface} className="control-button w-12 h-12" title="Show interface">
            <Eye className="w-6 h-6" />
          </button>
        </div>
      </div>;
  }
  return <>
      {/* Sound Category Grid/Scroll (only when mix mode is not active) */}
      {!state.isMixMode && <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-4xl">
          <ScrollArea className="w-full">
            <div className="flex space-x-4 px-4 pb-2 min-w-max py-[5px]">
              {sounds.map(sound => <div key={sound.id} className="flex flex-col items-center">
                  <SoundIcon sound={sound} />
                  <span className="text-white/70 text-xs mt-1 truncate w-14 text-center">{sound.name}</span>
                </div>)}
            </div>
          </ScrollArea>
        </div>}
      
      {/* Mix Mode Drawer */}
      <MixModeDrawer 
        isOpen={isMixDrawerOpen} 
        onOpenChange={(open) => {
          setIsMixDrawerOpen(open);
          setShowMixPanel(open);
        }} 
      />
      
      {/* Main Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        {/* Volume Slider */}
        {showVolumeSlider && <div className={`${isMobile ? 'w-48' : 'w-64'} bg-player-medium/90 backdrop-blur-sm rounded-full px-4 py-2 mb-2`}>
            <Slider value={[state.volume]} min={0} max={1} step={0.01} className="w-full" onValueChange={values => setVolume(values[0])} />
          </div>}
        
        {/* Primary Controls */}
        <div className="flex items-center justify-center">
          {/* Left Controls */}
          <div className={`flex ${isMobile ? 'gap-1' : 'gap-2'} mr-4`}>
            {/* Timer Button */}
            <button onClick={() => setIsTimerModalOpen(true)} className="control-button" title="Set timer">
              <Timer className="w-5 h-5" />
            </button>
          </div>
          
          {/* Play/Pause Button (centered) */}
          <button onClick={togglePlayPause} className={cn("w-16 h-16 rounded-full flex items-center justify-center", state.isPlaying ? "bg-white text-black hover:bg-white/90" : "bg-player-medium text-white hover:bg-player-light border border-white/10")} title={state.isPlaying ? "Pause" : "Play"}>
            {state.isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>
          
          {/* Right Controls - Swapped positions of Hide and Background buttons */}
          <div className={`flex ${isMobile ? 'gap-1' : 'gap-2'} ml-4`}>
            {/* Background Gallery Button */}
            <button onClick={() => setIsBackgroundGalleryOpen(true)} className="control-button" title="Background gallery">
              <Image className="w-5 h-5" />
            </button>
            
            {/* Hide Interface Button - Moved to 3rd position */}
            <button onClick={toggleHideInterface} className="control-button" title="Hide interface">
              <EyeOff className="w-5 h-5" />
            </button>
            
            {/* Volume Button */}
            <button onClick={() => setShowVolumeSlider(!showVolumeSlider)} className={cn("control-button", showVolumeSlider && "bg-white/20 text-white")} title="Volume control">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        {state.isMixMode ? (
          <button 
            onClick={() => {
              setIsMixDrawerOpen(true);
              setShowMixPanel(true);
            }}
            className="bg-player-medium/80 hover:bg-player-medium text-white/80 hover:text-white px-6 py-2 rounded-full text-sm flex items-center gap-1 transition-colors"
          >
            <Layers className="w-4 h-4" /> Mix Sounds
          </button>
        ) : (
          <button 
            onClick={() => setIsExploreDrawerOpen(true)}
            className="bg-player-medium/80 hover:bg-player-medium text-white/80 hover:text-white px-6 py-2 rounded-full text-sm flex items-center gap-1 transition-colors"
          >
            Explore <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Modals */}
      <TimerModal isOpen={isTimerModalOpen} onClose={() => setIsTimerModalOpen(false)} />
      <BackgroundGallery isOpen={isBackgroundGalleryOpen} onClose={() => setIsBackgroundGalleryOpen(false)} />
      <ExploreDrawer isOpen={isExploreDrawerOpen} onClose={() => setIsExploreDrawerOpen(false)} />
    </>;
};

export default PlayerControls;
