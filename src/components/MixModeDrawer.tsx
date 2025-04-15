
import { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { X, ChevronDown, ChevronUp, Save } from "lucide-react";
import SoundMixTile from "./SoundMixTile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sounds } from "@/data/soundData";
import { useIsMobile } from "@/hooks/use-mobile";
import SavedMixesDrawer from "./SavedMixesDrawer";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MixModeDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const MixModeDrawer = ({ isOpen, onOpenChange }: MixModeDrawerProps) => {
  const {
    state,
    toggleMixMode,
    showMixPanel,
    setShowMixPanel,
    saveMix
  } = usePlayer();
  const [isVisible, setIsVisible] = useState(false);
  const [isSavedMixesOpen, setIsSavedMixesOpen] = useState(false);
  const [isSaveMixDialogOpen, setIsSaveMixDialogOpen] = useState(false);
  const [mixName, setMixName] = useState("");
  const isMobile = useIsMobile();

  // Sync local state with context
  useEffect(() => {
    setIsVisible(state.isMixMode);
    if (showMixPanel && state.isMixMode) {
      onOpenChange(true);
    }
  }, [state.isMixMode, showMixPanel]);

  // If not in mix mode or not visible, don't render
  if (!state.isMixMode || !isVisible) {
    return null;
  }
  
  const handleSaveMix = () => {
    if (state.activeSounds.length === 0) {
      return;
    }
    setIsSaveMixDialogOpen(true);
  };
  
  const handleSaveMixConfirm = () => {
    if (mixName.trim()) {
      saveMix(mixName);
      setMixName("");
      setIsSaveMixDialogOpen(false);
    } else {
      // If no name provided, generate one
      saveMix();
      setIsSaveMixDialogOpen(false);
    }
  };
  
  return (
    <>
      <div className={`fixed inset-x-0 z-50 transition-all duration-300 ease-in-out ${isOpen ? "bottom-0" : "bottom-[-100vh]"}`}>      
        {/* Drawer Content */}
        <div className="bg-player-dark/90 backdrop-blur-md rounded-t-lg border border-white/10 h-[100vh] max-h-[90vh] mx-auto" style={{
        maxWidth: "600px"
        }}>
          <div className="flex justify-between items-center mb-4 px-4 pt-4">
            <h3 className="text-white font-medium text-lg">Sound Mix</h3>
            <div className="flex gap-2">
              {/* Saved mixes button */}
              <button
                onClick={() => setIsSavedMixesOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 bg-white/5"
                title="Saved mixes"
              >
                <ChevronDown className="h-4 w-4 text-white/70" />
              </button>
              
              {/* Save button */}
              <button
                onClick={handleSaveMix}
                className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all ${state.activeSounds.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                title="Save current mix"
                disabled={state.activeSounds.length === 0}
              >
                <Save className="h-4 w-4 text-white/70" />
              </button>
              
              {/* Close button */}
              <button 
                onClick={() => {
                  onOpenChange(false);
                  setShowMixPanel(false);
                }} 
                className="p-2 rounded-full hover:bg-white/10" 
                aria-label="Close mix mode panel"
              >
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

      {/* Save Mix Dialog */}
      <Dialog open={isSaveMixDialogOpen} onOpenChange={setIsSaveMixDialogOpen}>
        <DialogContent className="bg-player-dark border-white/10 text-white">
          <DialogTitle>Save Mix</DialogTitle>
          <DialogDescription className="text-white/70">
            Give your sound mix a name to save it
          </DialogDescription>
          <Input
            placeholder="Mix name"
            value={mixName}
            onChange={(e) => setMixName(e.target.value)}
            className="bg-black/30 border-white/20 text-white"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveMixDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMixConfirm}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Saved Mixes Drawer */}
      <SavedMixesDrawer
        isOpen={isSavedMixesOpen}
        onClose={() => setIsSavedMixesOpen(false)}
      />
    </>
  );
};

export default MixModeDrawer;
