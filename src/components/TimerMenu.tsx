
import { useState, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { 
  MoreHorizontal, 
  Check, 
  RefreshCw, 
  Plus
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TimerMenuProps {
  className?: string;
}

const TimerMenu = ({ className }: TimerMenuProps) => {
  const { state, resetTimer, cancelTimer } = usePlayer();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCompleteTimer = () => {
    cancelTimer();
    toast("Timer completed");
    setIsOpen(false);
  };

  const handleRestartTimer = () => {
    resetTimer();
    toast("Timer restarted");
    setIsOpen(false);
  };

  const handleAdd10Minutes = () => {
    // Since we can't directly modify the timer state from here,
    // we'll need to reset with the current remaining time + 10 minutes
    const currentMode = state.timer.mode;
    const currentDuration = currentMode === 'focus' ? state.timer.duration : state.timer.breakDuration;
    const newDuration = currentDuration + 10 * 60;
    
    // Reset the timer with the new duration
    // This is a workaround since we don't have direct access to update the remaining time
    if (currentMode === 'focus') {
      state.timer.duration = newDuration;
      resetTimer('focus');
    } else {
      state.timer.breakDuration = newDuration;
      resetTimer('break');
    }
    
    toast("Added 10 minutes to timer");
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button 
            className="p-2 rounded-full bg-black/30 border border-white/20 hover:bg-white/10 shadow-md transition-all hover:scale-105"
            aria-label="Timer menu"
          >
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-56 p-2 bg-player-dark border-white/10 text-white"
          align="end"
        >
          <div className="flex flex-col space-y-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCompleteTimer}
              className="justify-start text-white/80 hover:text-white hover:bg-white/10"
            >
              <Check className="h-4 w-4 mr-2" />
              Complete Timer
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRestartTimer}
              className="justify-start text-white/80 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restart Timer
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleAdd10Minutes}
              className="justify-start text-white/80 hover:text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add 10 Minutes
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimerMenu;
