
import { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, Timer, Image, Eye, EyeOff, Settings2, Library } from "lucide-react";
import { sounds } from "@/data/soundData";
import TimerModal from "./TimerModal";
import BackgroundGallery from "./BackgroundGallery";
import ExploreDrawer from "./ExploreDrawer";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import MixModeDrawer from "./MixModeDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import AdvancedSettingsDrawer from "./AdvancedSettingsDrawer";

const PlayerControls = () => {
  const {
    state,
    togglePlayPause,
    toggleHideInterface,
    toggleMixMode,
    setShowMixPanel
  } = usePlayer();
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isBackgroundGalleryOpen, setIsBackgroundGalleryOpen] = useState(false);
  const [isExploreDrawerOpen, setIsExploreDrawerOpen] = useState(false);
  const [isMixDrawerOpen, setIsMixDrawerOpen] = useState(false);
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (state.isMixMode) {
      setIsMixDrawerOpen(true);
    }
  }, [state.isMixMode]);

  if (state.isHidden) {
    return (
      <div className="fixed bottom-0.5 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-4">
        <div className="flex gap-3">
          <button onClick={toggleHideInterface} className="control-button w-12 h-12" title="Show interface">
            <Eye className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Sound Icons Scroll Area */}
      {!state.isMixMode && (
        <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-4xl px-4">
          <ScrollArea className="w-full overflow-x-auto">
            <div className="flex space-x-4 pb-2 min-w-max py-[5px]">
              {sounds.map(sound => (
                <div key={sound.id} className="flex flex-col items-center">
                  <SoundIcon sound={sound} />
                  <span className="text-white/70 text-xs mt-1 truncate w-14 text-center">
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
      
      <div className="fixed bottom-0.5 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-4">        
        <div className="flex items-center justify-center">
          <div className={`flex ${isMobile ? 'gap-1' : 'gap-2'} mr-4`}>
            <button onClick={() => setIsBackgroundGalleryOpen(true)} className="control-button" title="Background gallery">
              <Image className="w-5 h-5" />
            </button>
            
            <button onClick={() => setIsTimerModalOpen(true)} className="control-button" title="Set timer">
              <Timer className="w-5 h-5" />
            </button>
          </div>
          
          <button onClick={togglePlayPause} className={cn("w-16 h-16 rounded-full flex items-center justify-center", state.isPlaying ? "bg-white text-black hover:bg-white/90" : "bg-[#0061EF] text-white hover:bg-[#0061EF]/90 border border-white/10")} title={state.isPlaying ? "Pause" : "Play"}>
            {state.isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>
          
          <div className={`flex ${isMobile ? 'gap-1' : 'gap-2'} ml-4`}>
            <button onClick={toggleHideInterface} className="control-button" title="Hide interface">
              <EyeOff className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => setIsAdvancedSettingsOpen(true)} 
              className="control-button" 
              title="Advanced settings"
            >
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher and Library Access */}
        <div className="flex items-center gap-4">
          {/* Library button for PLAY mode */}
          <button
            onClick={() => setIsExploreDrawerOpen(true)}
            className={cn(
              "control-button",
              !state.isMixMode && "text-white bg-player-light border-white/20"
            )}
            title="Sound library"
          >
            <Library className="w-5 h-5" />
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center bg-player-medium/80 rounded-full p-1 text-sm font-medium">
            <button
              onClick={() => state.isMixMode && toggleMixMode()}
              className={cn(
                "px-4 py-1.5 rounded-full transition-colors",
                !state.isMixMode
                  ? "bg-player-light text-white"
                  : "text-white/50 hover:text-white"
              )}
            >
              PLAY
            </button>
            
            <button
              onClick={() => !state.isMixMode && toggleMixMode()}
              className={cn(
                "px-4 py-1.5 rounded-full transition-colors",
                state.isMixMode
                  ? "bg-player-light text-white"
                  : "text-white/50 hover:text-white"
              )}
            >
              MIX
            </button>
          </div>

          {/* Library button for MIX mode */}
          <button
            onClick={() => setIsMixDrawerOpen(true)}
            className={cn(
              "control-button",
              state.isMixMode && "text-white bg-player-light border-white/20"
            )}
            title="Mix library"
          >
            <Library className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <TimerModal isOpen={isTimerModalOpen} onClose={() => setIsTimerModalOpen(false)} />
      <BackgroundGallery isOpen={isBackgroundGalleryOpen} onClose={() => setIsBackgroundGalleryOpen(false)} />
      <ExploreDrawer isOpen={isExploreDrawerOpen} onClose={() => setIsExploreDrawerOpen(false)} />
      <AdvancedSettingsDrawer 
        isOpen={isAdvancedSettingsOpen} 
        onOpenChange={setIsAdvancedSettingsOpen}
      />
    </>
  );
};

export default PlayerControls;
