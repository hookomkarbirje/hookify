
import { usePlayer } from "@/context/PlayerContext";
import { backgroundImages } from "@/data/soundData";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image, Music } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface BackgroundGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const BackgroundGallery = ({ isOpen, onClose }: BackgroundGalleryProps) => {
  const { state, setBackground, toggleUseBackgroundFromSound } = usePlayer();
  
  const handleSelectBackground = (backgroundId: string) => {
    const selected = backgroundImages.find(bg => bg.id === backgroundId);
    if (selected) {
      setBackground(selected);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-player-dark border-white/10 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Image className="w-5 h-5" /> Background Gallery
          </DialogTitle>
        </DialogHeader>
        
        {!state.isMixMode && state.currentSound?.backgroundUrl && (
          <div className="flex items-center justify-between py-3 px-2 bg-player-medium/50 rounded-md mb-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-white/70" />
              <span className="text-sm">Use sound image as background</span>
            </div>
            <Switch 
              checked={state.useBackgroundFromSound} 
              onCheckedChange={toggleUseBackgroundFromSound}
            />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 py-4">
          {backgroundImages.map((bg) => (
            <div 
              key={bg.id}
              className={`
                relative aspect-video cursor-pointer overflow-hidden rounded-md 
                ${state.currentBackground.id === bg.id && !state.useBackgroundFromSound ? 'ring-2 ring-white' : 'hover:opacity-90'}
              `}
              onClick={() => handleSelectBackground(bg.id)}
            >
              <img 
                src={bg.thumbnailUrl} 
                alt={bg.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-xs text-white">{bg.name}</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BackgroundGallery;
