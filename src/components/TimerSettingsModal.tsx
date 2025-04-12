
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black border-white/10 text-white max-w-sm">
        <DialogHeader className="text-center">
          <DialogTitle className="text-white text-2xl font-light">Settings</DialogTitle>
          <p className="text-white/70 text-sm mt-2">Adjust Focus Timer Intervals:</p>
        </DialogHeader>

        <div className="py-4">
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
