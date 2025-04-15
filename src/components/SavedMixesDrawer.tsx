
import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { X, Play, Share2, Trash2 } from "lucide-react";
import { SavedMix } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface SavedMixesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavedMixesDrawer = ({ isOpen, onClose }: SavedMixesDrawerProps) => {
  const { getSavedMixes, loadMix, deleteMix, shareMix } = usePlayer();
  const [selectedMix, setSelectedMix] = useState<string | null>(null);
  
  const savedMixes = getSavedMixes();
  
  const handleLoadMix = (mixId: string) => {
    loadMix(mixId);
    setSelectedMix(mixId);
    // Don't close the drawer so user can see what they selected
  };
  
  const handleShareMix = (mixId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    shareMix(mixId);
  };
  
  const handleDeleteMix = (mixId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteMix(mixId);
    if (selectedMix === mixId) {
      setSelectedMix(null);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-player-dark/95 backdrop-blur-md rounded-lg border border-white/10 w-full max-w-md p-4 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-medium">Saved Mixes</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5 text-white/70" />
          </button>
        </div>
        
        {savedMixes.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <p>You haven't saved any mixes yet.</p>
            <p className="mt-2 text-sm">Create a mix in Mix Mode and save it!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {savedMixes.map((mix: SavedMix) => (
                <div 
                  key={mix.id}
                  onClick={() => handleLoadMix(mix.id)}
                  className={cn(
                    "p-3 rounded-lg border border-white/5 cursor-pointer hover:bg-white/5 transition-colors",
                    selectedMix === mix.id ? "bg-white/10" : "bg-black/20"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">{mix.name}</h4>
                      <p className="text-white/50 text-xs">
                        {mix.sounds.length} sound{mix.sounds.length !== 1 ? 's' : ''} • 
                        {' '}{formatDistanceToNow(new Date(mix.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleShareMix(mix.id, e)}
                        className="p-1.5 rounded-full hover:bg-white/20 bg-white/10"
                        title="Share mix"
                      >
                        <Share2 className="h-3.5 w-3.5 text-white/80" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteMix(mix.id, e)}
                        className="p-1.5 rounded-full hover:bg-white/20 bg-white/10"
                        title="Delete mix"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-white/80" />
                      </button>
                      <button
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20"
                        title="Load mix"
                      >
                        <Play className="h-3.5 w-3.5 text-white/80 fill-white/80" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default SavedMixesDrawer;
