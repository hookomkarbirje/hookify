
import { MoreVertical } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TimerMenuProps {
  className?: string;
}

const TimerMenu = ({ className }: TimerMenuProps) => {
  const { resetTimer, cancelTimer, state, updateTimerSettings } = usePlayer();
  const { timer } = state;

  const handleAddTime = () => {
    if (timer.isActive) {
      const newDuration = timer.duration + 600; // Add 10 minutes (600 seconds)
      const newRemaining = timer.remaining + 600;
      updateTimerSettings({ duration: newDuration, remaining: newRemaining });
    }
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-4 h-4 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-black/95 border-white/10 text-white">
          <DropdownMenuItem onClick={() => cancelTimer()}>
            Complete Timer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => resetTimer()}>
            Restart Timer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAddTime}>
            Add 10 Minutes
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TimerMenu;
