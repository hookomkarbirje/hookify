
import { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import SoundMixTile from "./SoundMixTile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sounds } from "@/data/soundData";
import { useIsMobile } from "@/hooks/use-mobile";

interface MixModeDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const MixModeDrawer = ({ isOpen, onOpenChange }: MixModeDrawerProps) => {
  const {
    state,
    toggleMixMode
  } = usePlayer();
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  // Handle visibility
  useEffect(() => {
    if (state.isMixMode) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow for animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [state.isMixMode]);

  // If not in mix mode or not visible, don't render
  if (!state.isMixMode || !isVisible) {
    return null;
  }
  
  return (
    <div className={`fixed inset-x-0 z-50 transition-all duration-300 ease-in-out ${isOpen ? "bottom-0" : "bottom-[-100vh]"}`}>      
      {/* Drawer Content */}
      <div className="bg-player-dark/90 backdrop-blur-md rounded-t-lg border border-white/10 h-[100vh] max-h-[90vh] mx-auto" style={{
      maxWidth: "600px"
    }}>
        <div className="flex justify-between items-center mb-4 px-4 pt-4">
          <h3 className="text-white font-medium text-lg">Sound Mix</h3>
          <div className="flex gap-2">
            <button onClick={() => onOpenChange(false)} className="p-2 rounded-full hover:bg-white/10" aria-label="Close mix mode panel">
              <X className="h-5 w-5 text-white/70" />
            </button>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(90vh-80px)]">
          <div className={`grid grid-cols-2 ${isMobile ? "" : "sm:grid-cols-3 md:grid-cols-4"} gap-6 justify-center mx-auto max-w-3xl pb-4 px-4`}>
            {sounds.map(sound => <SoundMixTile key={sound.id} sound={sound} />)}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MixModeDrawer;
