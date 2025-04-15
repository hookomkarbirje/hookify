
import React, { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Slider } from "@/components/ui/slider";
import { Sound } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@/components/Icon";

const MixPanel = () => {
  const { state, updateSoundVolume } = usePlayer();
  const [localVolumes, setLocalVolumes] = useState<Record<string, number>>({});

  // Initialize local volumes when active sounds change
  useEffect(() => {
    const newVolumes: Record<string, number> = {};
    state.activeSounds.forEach(sound => {
      newVolumes[sound.id] = sound.volume || state.volume;
    });
    setLocalVolumes(prev => ({...prev, ...newVolumes}));
  }, [state.activeSounds, state.volume]);

  if (!state.isMixMode || state.activeSounds.length === 0) {
    return null;
  }

  const handleVolumeChange = (soundId: string, values: number[]) => {
    const newVolume = values[0];
    setLocalVolumes(prev => ({...prev, [soundId]: newVolume}));
    updateSoundVolume(soundId, newVolume);
  };

  return (
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-4">
        <h3 className="text-white text-center mb-4">Sound Mix</h3>
        
        <div className="space-y-3">
          {state.activeSounds.map((sound: Sound) => (
            <div key={sound.id} className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-player-medium/70 rounded-full overflow-hidden">
                {sound.imageUrl ? (
                  <img 
                    src={sound.imageUrl} 
                    alt={sound.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name={sound.icon} size={20} className="text-white/80" />
                )}
              </div>
              <div className="text-white text-sm flex-1">{sound.name}</div>
              <div className="w-32">
                <Slider
                  value={[localVolumes[sound.id] ?? state.volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(values) => handleVolumeChange(sound.id, values)}
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
