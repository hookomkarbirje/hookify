
import { Sound } from "@/types";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/context/PlayerContext";

interface SoundIconProps {
  sound: Sound;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

// Map for sound category images
const categoryImageMap: Record<string, string> = {
  'Focus': '/lovable-uploads/focus-image.jpg',
  'Relax': '/lovable-uploads/relax-image.jpg',
  'Sleep': '/lovable-uploads/sleep-image.jpg',
  'Nature': '/lovable-uploads/nature-image.jpg',
  'Urban': '/lovable-uploads/urban-image.jpg',
  'Transport': '/lovable-uploads/transport-image.jpg',
  'Things': '/lovable-uploads/things-image.jpg',
  'Rain': '/lovable-uploads/rain-image.jpg',
};

// Fallback images per category
const fallbackImages: Record<string, string> = {
  'Focus': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&q=80',
  'Relax': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=800&q=80',
  'Sleep': 'https://images.unsplash.com/photo-1455642305367-68834a9d8152?w=800&h=800&q=80',
  'Nature': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&q=80',
  'Urban': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=800&q=80',
  'Transport': 'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=800&h=800&q=80',
  'Things': 'https://images.unsplash.com/photo-1531685250784-7569952593d2?w=800&h=800&q=80',
  'Rain': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&h=800&q=80',
};

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

  // Get appropriate image for the sound category
  const imageUrl = categoryImageMap[sound.category] || fallbackImages[sound.category];
  
  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden",
        sizeClasses[size],
        isActive 
          ? "ring-2 ring-white" 
          : "opacity-70 hover:opacity-100 ring-1 ring-white/30"
      )}
      title={sound.name}
    >
      <img 
        src={imageUrl} 
        alt={sound.name}
        className="w-full h-full object-cover"
      />
    </button>
  );
};

export default SoundIcon;
