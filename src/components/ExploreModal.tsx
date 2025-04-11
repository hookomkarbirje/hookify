
import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { sounds, soundCategories } from "@/data/soundData";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause } from "lucide-react";
import { Icon } from "@/components/Icon";

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExploreModal = ({ isOpen, onClose }: ExploreModalProps) => {
  const { state, playSound, pauseSound } = usePlayer();
  const [activeCategory, setActiveCategory] = useState<string>(soundCategories[0]);
  
  const filteredSounds = sounds.filter(sound => sound.category === activeCategory);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-player-dark border-white/10 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Explore Sounds</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="w-full bg-player-medium mb-4">
            {soundCategories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {soundCategories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="space-y-1">
                {filteredSounds.map((sound) => (
                  <div
                    key={sound.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-player-medium/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-player-medium flex items-center justify-center">
                        <Icon name={sound.icon} size={16} />
                      </div>
                      <span className="text-white">{sound.name}</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (state.currentSound?.id === sound.id && state.isPlaying) {
                          pauseSound();
                        } else {
                          playSound(sound);
                        }
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-player-medium hover:bg-player-light"
                    >
                      {state.currentSound?.id === sound.id && state.isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ExploreModal;
