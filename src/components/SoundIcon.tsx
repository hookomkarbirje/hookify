
import { Sound } from "@/types";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/context/PlayerContext";
import { Icon } from "./Icon";

interface SoundIconProps {
  sound: Sound;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const SoundIcon = ({ sound, size = 'md', onClick }: SoundIconProps) => {
  const { state, playSound } = usePlayer();
  const isActive = state.isMixMode
    ? state.activeSounds.some(s => s.id === sound.id) && state.isPlaying
    : state.currentSound?.id === sound.id && state.isPlaying;
  
  const handleClick = () => {
    playSound(sound);
    if (onClick) onClick();
  };
  
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26,
  };
  
  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-300",
        sizeClasses[size],
        isActive 
          ? "bg-white text-player-dark ring-2 ring-white" 
          : "bg-player-medium text-white/80 hover:text-white hover:bg-player-light ring-1 ring-white/30"
      )}
      title={sound.name}
    >
      <Icon name={sound.icon} size={iconSizes[size]} />
    </button>
  );
};

export default SoundIcon;
