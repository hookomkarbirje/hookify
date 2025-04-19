
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Bell, Volume2 } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { Separator } from "@/components/ui/separator";

interface AdvancedSettingsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdvancedSettingsDrawer = ({ isOpen, onOpenChange }: AdvancedSettingsDrawerProps) => {
  const { state, updateTimerSettings, setVolume } = usePlayer();

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
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 bg-black border-white/10 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Advanced Settings</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Volume Control Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">Volume Control</h3>
            <div className="flex items-center gap-4">
              <Volume2 className="w-5 h-5 text-white/70" />
              <Slider 
                value={[state.volume]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={values => setVolume(values[0])} 
              />
            </div>
          </div>

          <Separator className="my-4 bg-white/10" />

          {/* Timer Settings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">Timer Settings</h3>
            
            <div>
              <Label className="text-sm text-white/90 mb-2 block">
                Timer Sound Effect
              </Label>
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
                  className="space-y-1"
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
            </div>
            
            <Separator className="my-4 bg-white/10" />
            
            {/* Additional settings */}
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedSettingsDrawer;
