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
  const { state, resetTimer, cancelTimer, addMinutesToTimer } = usePlayer();
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
    addMinutesToTimer(10);
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
          align="center"
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
