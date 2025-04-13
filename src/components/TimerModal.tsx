
import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer, Minus, Plus, ChevronRight } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import TimerSettingsModal from "./TimerSettingsModal";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimerModal = ({ isOpen, onClose }: TimerModalProps) => {
  const { state, setTimer } = usePlayer();
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [rounds, setRounds] = useState(1);
  const [task, setTask] = useState("");
  const [customFocusMinutes, setCustomFocusMinutes] = useState<string>("");
  const [customBreakMinutes, setCustomBreakMinutes] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const isMobile = useIsMobile();
  
  const handleSetTimer = () => {
    // Use custom values if provided, otherwise use slider values
    const focusMinutes = customFocusMinutes ? parseInt(customFocusMinutes) : selectedMinutes;
    const breakMinutes = customBreakMinutes ? parseInt(customBreakMinutes) : shortBreakMinutes;
    
    // Pass both duration, break duration and task to setTimer
    setTimer(
      focusMinutes * 60, // Convert focus time to seconds
      task,
      breakMinutes * 60  // Convert break time to seconds
    );
    onClose();
  };
  
  const formatTimeDisplay = (minutes: number) => {
    return `${minutes < 10 ? '0' : ''}${minutes}:00`;
  };

  const incrementRounds = () => {
    setRounds(prev => Math.min(prev + 1, 10));
  };

  const decrementRounds = () => {
    setRounds(prev => Math.max(prev - 1, 1));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-black border-white/10 text-white max-w-sm sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-white/10 rounded-full p-3">
                <Timer className="h-6 w-6 text-white" />
              </div>
            </div>
            <DialogTitle className="text-white text-2xl font-light">Focus Timer</DialogTitle>
            <DialogDescription className="text-white/70 text-sm">Set your timer for focused work</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Task input - removed autofocus */}
            <Input
              type="text"
              placeholder="What's getting done?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="bg-white/5 border-white/10 text-white mb-6 p-4 h-12 rounded-lg"
            />
            
            {/* Timer settings preview */}
            <div 
              className="bg-white/5 rounded-lg p-4 mb-6 cursor-pointer flex justify-between items-center"
              onClick={() => setShowSettings(true)}
            >
              <div className="flex justify-between items-center flex-1">
                <div className="text-center">
                  <div className="text-4xl font-light">{selectedMinutes}</div>
                  <div className="text-white/60 text-xs">Focus</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-light">{shortBreakMinutes}</div>
                  <div className="text-white/60 text-xs">Short Break</div>
                </div>
                <div className="text-white/60">
                  <ChevronRight size={24} />
                </div>
              </div>
            </div>
            
            {/* Rounds adjuster */}
            <div className="flex justify-between items-center mb-2">
              <button 
                onClick={decrementRounds}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center"
              >
                <Minus size={20} className="text-white" />
              </button>
              <div className="text-center">
                <div className="text-white">Rounds: {rounds}</div>
                <div className="text-white/60 text-xs mt-1">
                  {rounds} × Focus Time + {rounds} × Short Break
                </div>
              </div>
              <button 
                onClick={incrementRounds}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center"
              >
                <Plus size={20} className="text-white" />
              </button>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-1/2 bg-transparent border-white/10 text-white hover:bg-white/10"
            >
              Done
            </Button>
            <Button 
              onClick={handleSetTimer}
              className="w-full sm:w-1/2 bg-white text-black hover:bg-white/90"
            >
              Start
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Only render the settings modal when needed */}
      {showSettings && (
        <TimerSettingsModal 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          selectedMinutes={selectedMinutes}
          setSelectedMinutes={setSelectedMinutes}
          shortBreakMinutes={shortBreakMinutes}
          setShortBreakMinutes={setShortBreakMinutes}
          customFocusMinutes={customFocusMinutes}
          setCustomFocusMinutes={setCustomFocusMinutes}
          customBreakMinutes={customBreakMinutes}
          setCustomBreakMinutes={setCustomBreakMinutes}
        />
      )}
    </>
  );
};

export default TimerModal;
