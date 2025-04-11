
import { Sound } from "@/types";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/context/PlayerContext";
import { 
  Grid, CircleDot, Aperture, BookOpen, Brain, 
  Circle, Infinity, Leaf, CircleDotDashed,
  Music 
} from "lucide-react";

interface SoundIconProps {
  sound: Sound;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  'grid': <Grid />,
  'circle-dot-dashed': <CircleDotDashed />,
  'aperture': <Aperture />,
  'book-open': <BookOpen />,
  'brain': <Brain />,
  'circle': <Circle />,
  'infinity': <Infinity />,
  'leaf': <Leaf />,
};

const SoundIcon = ({ sound, size = 'md', onClick }: SoundIconProps) => {
  const { state, playSound } = usePlayer();
  const isActive = state.currentSound?.id === sound.id && state.isPlaying;
  
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
        "rounded-full flex items-center justify-center transition-all duration-300",
        sizeClasses[size],
        isActive 
          ? "bg-white text-black hover:bg-white/90" 
          : "bg-player-medium text-white/70 hover:text-white hover:bg-player-light border border-white/5 hover:border-white/10"
      )}
      title={sound.name}
    >
      {iconMap[sound.icon] || <Music />}
    </button>
  );
};

export default SoundIcon;
