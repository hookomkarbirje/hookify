
import { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { sounds, soundCategories } from "@/data/soundData";
import { Play, X, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@/components/Icon";

interface ExploreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type ScenarioType = {
  name: string;
  icon?: string;
};

const scenarios: ScenarioType[] = [
  { name: "Attention Boost" },
  { name: "ASMR" },
  { name: "Binaural Beats" },
  { name: "Brain Massage" },
  { name: "Create" },
  { name: "Deep Work" },
  { name: "Self Care" },
  { name: "Read" },
  { name: "Power Nap" },
  { name: "Meditate" },
  { name: "Tinnitus Relief" },
];

const ExploreDrawer = ({ isOpen, onClose }: ExploreDrawerProps) => {
  const { state, playSound } = usePlayer();
  const [activeCategory, setActiveCategory] = useState<string>(soundCategories[0]);
  
  // Don't render if in mix mode or if drawer is not open
  if (!isOpen || state.isMixMode) return null;

  const filteredSounds = sounds.filter(sound => sound.category === activeCategory);
  
  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-all duration-500",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div 
        className={cn(
          "absolute inset-x-0 bottom-0 bg-player-dark rounded-t-xl transition-transform duration-500 ease-out transform max-h-[90vh] overflow-hidden mx-auto",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{ maxWidth: "600px" }}
      >
        {/* Close button */}
        <div className="sticky top-0 flex justify-between items-center p-4 border-b border-white/10 bg-player-dark z-10">
          <h2 className="text-xl font-medium text-white">Explore</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <ScrollArea className="h-[calc(90vh-64px)]">
          <div className="p-5">
            {/* Scenarios section */}
            <div className="mb-8">
              <h3 className="text-xl text-white mb-4 text-left">Scenarios</h3>
              <div className="flex flex-wrap gap-2">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.name}
                    className="bg-player-medium hover:bg-player-light text-white py-2 px-4 rounded-full text-sm transition-colors"
                  >
                    {scenario.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sound Categories */}
            {soundCategories.map((category) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl text-white mb-4 text-left">{category}</h3>
                
                {/* Sound items */}
                <div className="space-y-2">
                  {sounds
                    .filter(sound => sound.category === category)
                    .map((sound) => (
                      <div 
                        key={sound.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-player-medium/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-player-medium flex items-center justify-center">
                            <Icon name={sound.icon} size={20} />
                          </div>
                          <span className="text-white">{sound.name}</span>
                        </div>
                        
                        <button
                          onClick={() => {
                            playSound(sound);
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-player-medium hover:bg-player-light text-white"
                        >
                          {state.currentSound?.id === sound.id && state.isPlaying ? (
                            <ArrowRight className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ExploreDrawer;
