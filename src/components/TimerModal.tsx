
import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Timer, Minus, Plus } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const presetMinutes = [15, 30, 45, 60];

const TimerModal = ({ isOpen, onClose }: TimerModalProps) => {
  const { state, setTimer } = usePlayer();
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [rounds, setRounds] = useState(1);
  const [task, setTask] = useState("");
  const [customFocusMinutes, setCustomFocusMinutes] = useState<string>("");
  const [customBreakMinutes, setCustomBreakMinutes] = useState<string>("");
  const isMobile = useIsMobile();
  
  const handleSetTimer = () => {
    // Use custom values if provided, otherwise use slider values
    const focusMinutes = customFocusMinutes ? parseInt(customFocusMinutes) : selectedMinutes;
    // Pass both duration and task to setTimer
    setTimer(focusMinutes * 60, task); // Convert to seconds and pass task
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
  
  const handleCustomFocusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= 120)) {
      setCustomFocusMinutes(value);
      if (value !== "") {
        setSelectedMinutes(parseInt(value));
      }
    }
  };
  
  const handleCustomBreakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= 30)) {
      setCustomBreakMinutes(value);
      if (value !== "") {
        setShortBreakMinutes(parseInt(value));
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black border-white/10 text-white max-w-sm sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-white/10 rounded-full p-3">
              <Timer className="h-6 w-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-white text-2xl font-light">Focus Timer</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Task input */}
          <Input
            type="text"
            placeholder="What's getting done?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="bg-white/5 border-white/10 text-white mb-6 p-4 h-12 rounded-lg"
          />
          
          {/* Timer settings */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-4xl font-light">{selectedMinutes}</div>
                <div className="text-white/60 text-xs">Focus</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-light">{shortBreakMinutes}</div>
                <div className="text-white/60 text-xs">Short Break</div>
              </div>
              <div className="text-white/60">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Settings section */}
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <h3 className="text-white text-lg font-medium mb-4">Settings</h3>
            <p className="text-white/70 text-sm mb-6">Adjust Focus Timer Intervals:</p>
            
            {/* Focus time slider and custom input */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-white/80">Focus Time</label>
                <div className="text-white flex items-center gap-2">
                  <span>{formatTimeDisplay(selectedMinutes)}</span>
                  <Input
                    type="text"
                    value={customFocusMinutes}
                    onChange={handleCustomFocusChange}
                    placeholder="Custom"
                    className="w-16 h-7 bg-white/10 border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <Slider
                value={[selectedMinutes]}
                min={5}
                max={60}
                step={5}
                onValueChange={(value) => {
                  setSelectedMinutes(value[0]);
                  setCustomFocusMinutes("");
                }}
                className="my-2"
              />
            </div>
            
            {/* Short break slider and custom input */}
            <div className="mb-2">
              <div className="flex justify-between mb-2">
                <label className="text-white/80">Short break</label>
                <div className="text-white flex items-center gap-2">
                  <span>{formatTimeDisplay(shortBreakMinutes)}</span>
                  <Input
                    type="text"
                    value={customBreakMinutes}
                    onChange={handleCustomBreakChange}
                    placeholder="Custom"
                    className="w-16 h-7 bg-white/10 border-white/10 text-white text-xs"
                  />
                </div>
              </div>
              <Slider
                value={[shortBreakMinutes]}
                min={1}
                max={15}
                step={1}
                onValueChange={(value) => {
                  setShortBreakMinutes(value[0]);
                  setCustomBreakMinutes("");
                }}
                className="my-2"
              />
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
  );
};

export default TimerModal;
