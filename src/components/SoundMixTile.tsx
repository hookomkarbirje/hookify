
import { Sound } from "@/types";
import { usePlayer } from "@/context/PlayerContext";
import { Icon } from "./Icon";
import { Slider } from "@/components/ui/slider";

interface SoundMixTileProps {
  sound: Sound;
}

const SoundMixTile = ({ sound }: SoundMixTileProps) => {
  const { state, playSound, updateSoundVolume } = usePlayer();
  const isActive = state.activeSounds.some(s => s.id === sound.id) && state.isPlaying;
  
  const getActiveSoundVolume = (): number => {
    const activeSound = state.activeSounds.find(s => s.id === sound.id);
    return activeSound?.volume || state.volume;
  };

  const handleClick = () => {
    playSound(sound);
  };

  const handleVolumeChange = (values: number[]) => {
    updateSoundVolume(sound.id, values[0]);
  };

  return (
    <div className="flex flex-col items-center gap-2">
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
      
      <div className="w-full px-2">
        <Slider
          value={[isActive ? getActiveSoundVolume() : state.volume]}
          min={0}
          max={1}
          step={0.01}
          className={`w-full ${!isActive && "opacity-50"}`}
          onValueChange={handleVolumeChange}
          disabled={!isActive}
        />
      </div>
    </div>
  );
};

export default SoundMixTile;
