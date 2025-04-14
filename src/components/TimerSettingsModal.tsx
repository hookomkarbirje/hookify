
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TimerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMinutes: number;
  setSelectedMinutes: (minutes: number) => void;
  shortBreakMinutes: number;
  setShortBreakMinutes: (minutes: number) => void;
  customFocusMinutes: string;
  setCustomFocusMinutes: (minutes: string) => void;
  customBreakMinutes: string;
  setCustomBreakMinutes: (minutes: string) => void;
}

const formatTimeDisplay = (minutes: number) => {
  return `${minutes < 10 ? '0' : ''}${minutes}:00`;
};

const TimerSettingsModal = ({
  isOpen,
  onClose,
  selectedMinutes,
  setSelectedMinutes,
  shortBreakMinutes,
  setShortBreakMinutes,
  customFocusMinutes,
  setCustomFocusMinutes,
  customBreakMinutes,
  setCustomBreakMinutes,
}: TimerSettingsModalProps) => {
  
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

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black border-white/10 text-white max-w-sm">
        <DialogHeader className="text-center">
          <DialogTitle className="text-white text-2xl font-light">Settings</DialogTitle>
          <DialogDescription className="text-white/70 text-sm">Adjust Focus Timer Intervals</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Focus time slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-white/80">Focus Time</label>
              <div className="text-white">
                <span>{formatTimeDisplay(selectedMinutes)}</span>
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
          
          {/* Short break slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-white/80">Short break</label>
              <div className="text-white">
                <span>{formatTimeDisplay(shortBreakMinutes)}</span>
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
          
          {/* Custom time inputs */}
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <h3 className="text-white text-sm font-medium mb-3">Custom Time</h3>
            
            <div className="mb-3">
              <label className="text-white/70 text-xs block mb-1">Focus Time (1-120 min)</label>
              <Input
                type="text"
                value={customFocusMinutes}
                onChange={handleCustomFocusChange}
                placeholder="Enter minutes"
                className="bg-white/10 border-white/10 text-white text-sm h-9"
              />
            </div>
            
            <div>
              <label className="text-white/70 text-xs block mb-1">Break Time (1-30 min)</label>
              <Input
                type="text"
                value={customBreakMinutes}
                onChange={handleCustomBreakChange}
                placeholder="Enter minutes"
                className="bg-white/10 border-white/10 text-white text-sm h-9"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={onClose}
            className="w-full bg-white text-black hover:bg-white/90"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimerSettingsModal;
