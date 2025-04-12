
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
  const [showSlider, setShowSlider] = useState(false);
  
  const getActiveSoundVolume = (): number => {
    const activeSound = state.activeSounds.find(s => s.id === sound.id);
    return activeSound?.volume || state.volume;
  };

  const handleClick = () => {
    playSound(sound);
    if (isActive) {
      setShowSlider(!showSlider);
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
        {/* Sound image could be added here in the future */}
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
      
      {/* Only display slider if sound is active and the user clicked to show it */}
      {isActive && showSlider && (
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
