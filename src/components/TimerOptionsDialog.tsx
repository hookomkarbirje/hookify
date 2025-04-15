
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { usePlayer } from "@/context/PlayerContext";
import { Separator } from "@/components/ui/separator";

interface TimerOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimerOptionsDialog = ({
  isOpen,
  onClose
}: TimerOptionsDialogProps) => {
  const { state, updateTimerSettings } = usePlayer();

  const handleToggleSound = (checked: boolean) => {
    updateTimerSettings({ playSound: checked });
  };

  const handleToggleNotifications = (checked: boolean) => {
    updateTimerSettings({ showNotifications: checked });
    if (checked && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black border-white/10 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-light">Timer Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <h3 className="text-white text-sm font-medium">Timer Sound Effect</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/70">Enabled</span>
            <Switch 
              checked={state.timer.playSound !== false}
              onCheckedChange={handleToggleSound}
              className="data-[state=checked]:bg-white/30"
            />
          </div>
          
          {state.timer.playSound && (
            <RadioGroup 
              defaultValue="beep" 
              value={state.timer.soundType || 'beep'} 
              onValueChange={(value) => updateTimerSettings({ soundType: value as 'beep' | 'bell' })} 
              className="space-y-1 mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beep" id="beep" className="border-white" />
                <Label htmlFor="beep" className="text-sm flex items-center cursor-pointer">
                  <Bell className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                  Beep Sound
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bell" id="bell" className="border-white" />
                <Label htmlFor="bell" className="text-sm flex items-center cursor-pointer">
                  <Bell className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                  Bell Sound
                </Label>
              </div>
            </RadioGroup>
          )}
          
          <Separator className="my-4 bg-white/10" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Auto Start Timers</span>
              <Switch 
                checked={state.timer.autoStart !== false}
                onCheckedChange={(checked) => updateTimerSettings({ autoStart: checked })}
                className="data-[state=checked]:bg-white/30"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Hide Seconds</span>
              <Switch 
                checked={state.timer.hideSeconds || false}
                onCheckedChange={(checked) => updateTimerSettings({ hideSeconds: checked })}
                className="data-[state=checked]:bg-white/30"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Browser Notifications</span>
              <Switch 
                checked={state.timer.showNotifications || false}
                onCheckedChange={handleToggleNotifications}
                className="data-[state=checked]:bg-white/30"
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

export default TimerOptionsDialog;
