
import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Slider } from "@/components/ui/slider";
import { Sound } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@/components/Icon";

const MixPanel = () => {
  const {
    state,
    updateSoundVolume
  } = usePlayer();
  
  if (!state.isMixMode || state.activeSounds.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-24 inset-x-0 mx-auto z-20 max-w-md">
      <div className="bg-player-dark/90 backdrop-blur-md rounded-lg border border-white/10 p-4">
        <h3 className="text-white font-medium text-sm mb-3">Active Sounds</h3>
        <ScrollArea className="max-h-60">
          <div className="space-y-3">
            {state.activeSounds.map((sound) => (
              <div key={sound.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-player-medium flex items-center justify-center">
                  <Icon name={sound.icon} size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm">{sound.name}</div>
                  <Slider 
                    value={[sound.volume || 0.5]} 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    className="w-full mt-1" 
                    onValueChange={(values) => updateSoundVolume(sound.id, values[0])}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MixPanel;
