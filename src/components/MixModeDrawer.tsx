
import { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import SoundMixTile from "./SoundMixTile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sounds } from "@/data/soundData";
import { useIsMobile } from "@/hooks/use-mobile";

const MixModeDrawer = () => {
  const { state, toggleMixMode } = usePlayer();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Auto-open when mix mode is toggled on
  useEffect(() => {
    if (state.isMixMode) {
      setIsOpen(true);
    }
  }, [state.isMixMode]);
  
  if (!state.isMixMode) {
    return null;
  }
  
  return (
    <div className={`fixed inset-x-0 z-10 transition-all duration-300 ease-in-out ${
      isOpen 
        ? "bottom-0" 
        : "bottom-[-300px]"
    }`}>
      {/* Handle to open/close the drawer */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-player-dark/90 backdrop-blur-md rounded-t-lg px-6 py-2 border-t border-x border-white/10 flex items-center gap-2"
        >
          <span className="text-white text-sm">Mix Mode</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-white/70" />
          ) : (
            <ChevronUp className="h-4 w-4 text-white/70" />
          )}
        </button>
      </div>
      
      {/* Drawer Content */}
      <div className="bg-player-dark/90 backdrop-blur-md rounded-t-lg px-4 py-4 border border-white/10 max-h-[70vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-medium text-lg">Sound Mix</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/10"
            >
              <X className="h-5 w-5 text-white/70" />
            </button>
          </div>
        </div>
        
        <ScrollArea className="h-[min(60vh,400px)]">
          <div className={`grid grid-cols-2 ${
            isMobile ? "" : "sm:grid-cols-3 md:grid-cols-4"
          } gap-6 justify-center mx-auto max-w-3xl pb-4`}>
            {sounds.map(sound => (
              <SoundMixTile key={sound.id} sound={sound} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MixModeDrawer;
