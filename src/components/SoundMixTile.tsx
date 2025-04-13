
import { Sound } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { Icon } from "./Icon";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface SoundMixTileProps {
  sound: Sound;
}

const SoundMixTile = ({ sound }: SoundMixTileProps) => {
  const { state, playSound, updateSoundVolume } = usePlayer();
  const isMobile = useIsMobile();
  const isActive = state.activeSounds.some(s => s.id === sound.id) && state.isPlaying;
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const getActiveSoundVolume = (): number => {
    const activeSound = state.activeSounds.find(s => s.id === sound.id);
    return activeSound?.volume || state.volume;
  };

  const handleClick = () => {
    if (isActive) {
      // If sound is already active, toggle the volume slider
      setShowVolumeSlider(!showVolumeSlider);
    } else {
      // If sound is not active, play it and don't show slider yet
      playSound(sound);
      // Reset slider state when playing a new sound
      setShowVolumeSlider(false);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    updateSoundVolume(sound.id, values[0]);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className="w-20 h-20 rounded-full overflow-hidden relative cursor-pointer"
        onClick={handleClick}
      >
        <div className={`
          absolute inset-0 flex items-center justify-center 
          ${isActive 
            ? "bg-white text-player-dark" 
            : "bg-player-medium text-white/80 hover:bg-player-light hover:text-white"}
          ${isActive ? "border-2 border-white" : "border border-white/30"}
        `}>
          <Icon name={sound.icon} size={32} />
        </div>
      </div>
      
      <div className="text-white text-xs font-medium mt-1">
        {sound.name}
      </div>
      
      {isActive && showVolumeSlider && (
        <div className={`w-full px-4 ${isMobile ? "py-5" : "py-1"}`}>
          <Slider
            value={[getActiveSoundVolume()]}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
            onValueChange={handleVolumeChange}
            aria-label={`Volume for ${sound.name}`}
          />
        </div>
      )}
    </div>
  );
};

export default SoundMixTile;
