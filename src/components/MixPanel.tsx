
import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Slider } from "@/components/ui/slider";
import { Sound } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@/components/Icon";

const MixPanel = () => {
  const { state, updateSoundVolume } = usePlayer();
  
  if (!state.isMixMode || state.activeSounds.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-40 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg">
      <div className="bg-player-dark/90 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <h3 className="text-white text-center mb-3 font-medium">Mix Controls</h3>
        
        <ScrollArea className="h-[200px] pr-4">
          {state.activeSounds.map((sound: Sound) => (
            <div key={sound.id} className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-player-medium flex items-center justify-center">
                  <Icon name={sound.icon} size={16} />
                </div>
                <div className="w-20 text-white/80 text-sm truncate">{sound.name}</div>
              </div>
              <Slider
                value={[sound.volume || state.volume]}
                min={0}
                max={1}
                step={0.01}
                className="flex-grow"
                onValueChange={(values) => {
                  updateSoundVolume(sound.id, values[0]);
                }}
              />
              <div className="w-8 text-white/80 text-xs">
                {Math.round((sound.volume || state.volume) * 100)}%
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MixPanel;
