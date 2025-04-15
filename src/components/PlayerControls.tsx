
import { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, Timer, Image, Eye, EyeOff, Settings2, Library, MusicIcon } from "lucide-react";
import { sounds } from "@/data/soundData";
import SoundIcon from "./SoundIcon";
import TimerModal from "./TimerModal";
import BackgroundGallery from "./BackgroundGallery";
import ExploreDrawer from "./ExploreDrawer";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import MixModeDrawer from "./MixModeDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import AdvancedSettingsDrawer from "./AdvancedSettingsDrawer";
import SavedMixesDrawer from "./SavedMixesDrawer";

const PlayerControls = () => {
  const {
    state,
    togglePlayPause,
    toggleHideInterface,
    toggleMixMode,
    setShowMixPanel,
  } = usePlayer();
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isBackgroundGalleryOpen, setIsBackgroundGalleryOpen] = useState(false);
  const [isExploreDrawerOpen, setIsExploreDrawerOpen] = useState(false);
  const [isMixDrawerOpen, setIsMixDrawerOpen] = useState(false);
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
  const [isSavedMixesOpen, setIsSavedMixesOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (state.isMixMode) {
      setIsMixDrawerOpen(true);
    }
  }, [state.isMixMode]);

  if (state.isHidden) {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
        <button onClick={toggleHideInterface} className="control-button w-12 h-12 bg-black/50 backdrop-blur-sm" title="Show interface">
          <Eye className="w-5 h-5" />
        </button>
      </div>
    );
  }
  
  // Function to handle PLAY mode button click
  const handlePlayModeClick = () => {
    if (state.isMixMode) {
      toggleMixMode();
    } else {
      setIsExploreDrawerOpen(true);
    }
  };
  
  // Function to handle MIX mode button click
  const handleMixModeClick = () => {
    if (!state.isMixMode) {
      toggleMixMode();
    } else {
      setIsMixDrawerOpen(true);
    }
  };
  
  return (
    <>
      {/* Mode Switcher at the top */}
      <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-full p-1.5 border border-white/10">
          {/* Library button for PLAY mode */}
          <button
            onClick={() => setIsExploreDrawerOpen(true)}
            className={cn(
              "p-2 rounded-full transition-colors flex items-center justify-center",
              !state.isMixMode && "text-white bg-white/10"
            )}
            title="Sound library"
          >
            <MusicIcon className="w-4 h-4" />
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center bg-black/20 rounded-full p-1 text-xs font-medium">
            <button
              onClick={handlePlayModeClick}
              className={cn(
                "px-3 py-1 rounded-full transition-colors",
                !state.isMixMode
                  ? "bg-gray-500/70 text-white"
                  : "text-white/50 hover:text-white"
              )}
            >
              PLAY
            </button>
            
            <button
              onClick={handleMixModeClick}
              className={cn(
                "px-3 py-1 rounded-full transition-colors",
                state.isMixMode
                  ? "bg-gray-500/70 text-white"
                  : "text-white/50 hover:text-white"
              )}
            >
              MIX
            </button>
          </div>

          {/* Library button for MIX mode */}
          <button
            onClick={() => state.isMixMode ? setIsMixDrawerOpen(true) : null}
            className={cn(
              "p-2 rounded-full transition-colors flex items-center justify-center",
              state.isMixMode && "text-white bg-white/10"
            )}
            title="Mix library"
          >
            <Library className="w-4 h-4" />
          </button>
        </div>
        
        {/* Save/Library buttons - now always visible with improved styling */}
        <div className="mt-2 flex justify-center gap-2">
          <button 
            onClick={() => setIsSavedMixesOpen(true)} 
            className="text-xs bg-gradient-to-r from-blue-500/30 to-purple-500/30 hover:from-blue-500/40 hover:to-purple-500/40 text-white px-3 py-1.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-black/20 border border-white/10"
          >
            Saved Mixes
          </button>
        </div>
      </div>
      
      {/* Sound Icons Scroll Area */}
      {!state.isMixMode && (
        <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-4xl px-4">
          <ScrollArea className="w-full overflow-x-auto">
            <div className="flex space-x-3 pb-2 min-w-max py-[5px] items-center justify-center">
              {sounds.map(sound => (
                <div key={sound.id} className="flex flex-col items-center">
                  <SoundIcon 
                    sound={sound} 
                    size="sm" 
                  />
                  <span className="text-white/70 text-xs mt-1.5 truncate w-14 text-center">
                    {sound.name}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      <MixModeDrawer 
        isOpen={isMixDrawerOpen} 
        onOpenChange={(open) => {
          setIsMixDrawerOpen(open);
          setShowMixPanel(open);
        }} 
      />
      
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-5">        
        {/* Main control panel */}
        <div className="flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full px-6 py-2 border border-white/10">
          <div className={`flex ${isMobile ? 'gap-3' : 'gap-5'} items-center`}>
            {/* Left side controls */}
            <div className="flex gap-4">
              <button onClick={() => setIsBackgroundGalleryOpen(true)} className="control-button" title="Background gallery">
                <Image className="w-4 h-4" />
              </button>
              
              <button onClick={() => setIsTimerModalOpen(true)} className="control-button" title="Set timer">
                <Timer className="w-4 h-4" />
              </button>
            </div>
            
            {/* Center play button */}
            <button onClick={togglePlayPause} className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center transform transition-all duration-300",
              state.isPlaying 
                ? "bg-white text-black scale-105 shadow-lg" 
                : "bg-[#0061EF] text-white border border-white/10"
            )} title={state.isPlaying ? "Pause" : "Play"}>
              {state.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            
            {/* Right side controls */}
            <div className="flex gap-4">
              <button onClick={toggleHideInterface} className="control-button" title="Hide interface">
                <EyeOff className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => setIsAdvancedSettingsOpen(true)} 
                className="control-button" 
                title="Advanced settings"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <TimerModal isOpen={isTimerModalOpen} onClose={() => setIsTimerModalOpen(false)} />
      <BackgroundGallery isOpen={isBackgroundGalleryOpen} onClose={() => setIsBackgroundGalleryOpen(false)} />
      <ExploreDrawer isOpen={isExploreDrawerOpen} onClose={() => setIsExploreDrawerOpen(false)} />
      <AdvancedSettingsDrawer 
        isOpen={isAdvancedSettingsOpen} 
        onOpenChange={setIsAdvancedSettingsOpen}
      />
      <SavedMixesDrawer
        isOpen={isSavedMixesOpen}
        onClose={() => setIsSavedMixesOpen(false)}
      />
    </>
  );
};

export default PlayerControls;
