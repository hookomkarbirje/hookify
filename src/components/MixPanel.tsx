
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
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-4">
        <h3 className="text-white text-center mb-4">Sound Mix</h3>
        
        <div className="space-y-3">
          {state.activeSounds.map((sound: Sound) => (
            <div key={sound.id} className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <Icon name={sound.icon} size={20} className="text-white/70" />
              </div>
              <div className="text-white text-sm flex-1">{sound.name}</div>
              <div className="w-32">
                <Slider
                  value={[sound.volume || state.volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(values) => updateSoundVolume(sound.id, values[0])}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MixPanel;
