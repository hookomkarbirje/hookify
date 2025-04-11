
import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const presetMinutes = [15, 30, 45, 60, 90];

const TimerModal = ({ isOpen, onClose }: TimerModalProps) => {
  const { state, setTimer } = usePlayer();
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [customMinutes, setCustomMinutes] = useState("");
  const [isCustomTime, setIsCustomTime] = useState(false);
  
  const handleSetTimer = () => {
    let minutesToSet = selectedMinutes;
    
    if (isCustomTime && customMinutes) {
      const parsedMinutes = parseInt(customMinutes);
      if (!isNaN(parsedMinutes) && parsedMinutes > 0) {
        minutesToSet = parsedMinutes;
      }
    }
    
    setTimer(minutesToSet * 60); // Convert to seconds
    onClose();
  };
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomMinutes(value);
      setIsCustomTime(true);
    }
  };

  const selectPreset = (minutes: number) => {
    setSelectedMinutes(minutes);
    setIsCustomTime(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-player-dark border-white/10 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Shut-Off Timer</DialogTitle>
          <DialogDescription className="text-white/70">
            Set the timer for the player to stop playing in:
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="text-center text-5xl font-light mb-6">
            {isCustomTime && customMinutes ? `${customMinutes}m` : formatTime(selectedMinutes)}
          </div>
          
          {!isCustomTime && (
            <Slider
              value={[selectedMinutes]}
              min={1}
              max={120}
              step={1}
              onValueChange={(value) => setSelectedMinutes(value[0])}
              className="my-6"
            />
          )}
          
          <div className="flex justify-between gap-2 mt-6">
            {presetMinutes.map((minutes) => (
              <Button
                key={minutes}
                variant="outline"
                onClick={() => selectPreset(minutes)}
                className={`flex-1 ${
                  !isCustomTime && selectedMinutes === minutes 
                    ? "bg-white/10 text-white" 
                    : "bg-player-medium text-white/70"
                }`}
              >
                {formatTime(minutes)}
              </Button>
            ))}
          </div>
          
          {/* Custom time input */}
          <div className="mt-4 flex items-center">
            <Button
              variant="outline"
              onClick={() => setIsCustomTime(true)}
              className={`mr-2 ${
                isCustomTime 
                  ? "bg-white/10 text-white" 
                  : "bg-player-medium text-white/70"
              }`}
            >
              Custom
            </Button>
            <Input
              type="text"
              placeholder="Minutes"
              value={customMinutes}
              onChange={handleCustomTimeChange}
              className="bg-player-medium border-white/10 text-white"
              disabled={!isCustomTime}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button 
            onClick={handleSetTimer}
            className="w-full bg-white text-black hover:bg-white/90"
          >
            Start
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full bg-transparent border-white/10 text-white/70 hover:text-white"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimerModal;
