
import { Sound } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { Icon } from "./Icon";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

interface SoundMixTileProps {
  sound: Sound;
}

const SoundMixTile = ({ sound }: SoundMixTileProps) => {
  const { state, playSound, updateSoundVolume } = usePlayer();
  const isMobile = useIsMobile();
  const isActive = state.activeSounds.some(s => s.id === sound.id) && state.isPlaying;
  const [localVolume, setLocalVolume] = useState(state.volume);
  
  // Sync local volume with active sound's volume when it changes
  useEffect(() => {
    if (isActive) {
      const activeSound = state.activeSounds.find(s => s.id === sound.id);
      if (activeSound?.volume !== undefined) {
        setLocalVolume(activeSound.volume);
      }
    }
  }, [isActive, sound.id, state.activeSounds]);

  const handleClick = () => {
    playSound(sound);
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setLocalVolume(newVolume);
    updateSoundVolume(sound.id, newVolume);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className="w-20 h-20 rounded-full overflow-hidden relative cursor-pointer shadow-lg transition-all duration-300"
        onClick={handleClick}
        style={{
          transform: isActive ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <div className={`
          absolute inset-0 flex items-center justify-center 
          ${isActive 
            ? "bg-[#0061EF] text-white" 
            : "bg-player-medium text-white/80 hover:bg-player-light hover:text-white"}
          ${isActive ? "border-2 border-white" : "border border-white/30"}
        `}>
          <Icon name={sound.icon} size={32} />
        </div>
      </div>
      
      <div className="text-white text-xs font-medium mt-1">
        {sound.name}
      </div>
      
      {isActive && (
        <div className={`w-full px-4 ${isMobile ? "py-5" : "py-1"}`}>
          <Slider
            value={[localVolume]}
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
