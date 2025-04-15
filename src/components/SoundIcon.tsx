
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
  
  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden shadow-md",
        sizeClasses[size],
        isActive 
          ? "ring-2 ring-white scale-110" 
          : "ring-1 ring-white/30 hover:ring-white/50 hover:scale-105"
      )}
      title={sound.name}
    >
      {/* In normal play mode, use image if available */}
      {!state.isMixMode && sound.imageUrl ? (
        <img 
          src={sound.imageUrl} 
          alt={sound.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={cn(
          "w-full h-full flex items-center justify-center",
          isActive 
            ? "bg-[#0061EF] text-white" 
            : "bg-player-medium text-white/80 hover:text-white hover:bg-player-light"
        )}>
          <Icon name={sound.icon} size={size === 'sm' ? 18 : size === 'md' ? 22 : 26} />
        </div>
      )}
    </button>
  );
};

export default SoundIcon;
