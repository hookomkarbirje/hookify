
import { usePlayer } from "@/context/PlayerContext";
import { backgroundImages } from "@/data/soundData";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image } from "lucide-react";

interface BackgroundGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const BackgroundGallery = ({ isOpen, onClose }: BackgroundGalleryProps) => {
  const { state, setBackground } = usePlayer();
  
  const handleSelectBackground = (backgroundId: string) => {
    const selected = backgroundImages.find(bg => bg.id === backgroundId);
    if (selected) {
      setBackground(selected);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-player-dark border-white/10 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Image className="w-5 h-5" /> Background Gallery
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 py-4">
          {backgroundImages.map((bg) => (
            <div 
              key={bg.id}
              className={`
                relative aspect-video cursor-pointer overflow-hidden rounded-md 
                ${state.currentBackground.id === bg.id ? 'ring-2 ring-white' : 'hover:opacity-90'}
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
