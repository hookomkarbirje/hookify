
import { useState, useRef, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { 
  MoreHorizontal, 
  Check, 
  Play, 
  RefreshCw, 
  Plus, 
  Bell
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface TimerMenuProps {
  className?: string;
}

const TimerMenu = ({ className }: TimerMenuProps) => {
  const { state, setTimer, resetTimer, cancelTimer, pauseResumeTimer, updateTimerSettings } = usePlayer();
  const [timerType, setTimerType] = useState<'pomodoro' | 'simple'>(
    state.timer.breakDuration > 0 ? 'pomodoro' : 'simple'
  );
  const [customFocusMin, setCustomFocusMin] = useState("");
  const [customBreakMin, setCustomBreakMin] = useState("");
  const [alertSound, setAlertSound] = useState<"beep" | "bell">(state.timer.soundType || "beep");
  const [autoStartTimers, setAutoStartTimers] = useState(state.timer.autoStart !== false);
  const [hideSeconds, setHideSeconds] = useState(state.timer.hideSeconds || false);
  const [enableSound, setEnableSound] = useState(state.timer.playSound !== false);
  const [browserNotifications, setBrowserNotifications] = useState(state.timer.showNotifications || false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Sync state with timer settings when menu opens
  useEffect(() => {
    if (isOpen) {
      setTimerType(state.timer.breakDuration > 0 ? 'pomodoro' : 'simple');
      setAlertSound(state.timer.soundType || "beep");
      setAutoStartTimers(state.timer.autoStart !== false);
      setHideSeconds(state.timer.hideSeconds || false);
      setEnableSound(state.timer.playSound !== false);
      setBrowserNotifications(state.timer.showNotifications || false);
    }
  }, [isOpen, state.timer]);

  // Update settings when they change
  useEffect(() => {
    updateTimerSettings({
      soundType: alertSound,
      autoStart: autoStartTimers,
      hideSeconds: hideSeconds,
      playSound: enableSound,
      showNotifications: browserNotifications
    });
  }, [alertSound, autoStartTimers, hideSeconds, enableSound, browserNotifications, updateTimerSettings]);

  const handleSwitchTimerType = (value: string) => {
    const type = value as 'pomodoro' | 'simple';
    setTimerType(type);
    
    if (type === 'simple' && state.timer.isActive) {
      // Convert current timer to simple timer (without breaks)
      const currentDuration = state.timer.remaining;
      setTimer(currentDuration, state.timer.task, 0, 1);
      toast("Switched to Simple Timer");
    } else if (type === 'pomodoro' && state.timer.isActive) {
      // Convert to pomodoro timer with default break (5 min)
      const currentDuration = state.timer.remaining;
      setTimer(currentDuration, state.timer.task, 5 * 60, state.timer.totalRounds || 1);
      toast("Switched to Pomodoro Timer");
    }
  };

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
    const newDuration = state.timer.duration + 10 * 60;
    const newRemaining = state.timer.remaining + 10 * 60;
    
    // Update timer with 10 more minutes
    setTimer(
      newDuration,
      state.timer.task,
      state.timer.breakDuration,
      state.timer.totalRounds
    );
    
    toast("Added 10 minutes to timer");
    setIsOpen(false);
  };

  const handleApplyCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    
    const focusMinutes = customFocusMin ? parseInt(customFocusMin) : 25;
    const breakMinutes = timerType === 'pomodoro' && customBreakMin 
      ? parseInt(customBreakMin) 
      : timerType === 'pomodoro' ? 5 : 0;
    
    setTimer(
      focusMinutes * 60,
      state.timer.task,
      timerType === 'simple' ? 0 : breakMinutes * 60,
      state.timer.totalRounds || 1
    );
    
    toast(`Timer set for ${focusMinutes} min focus${timerType === 'pomodoro' ? ` and ${breakMinutes} min break` : ''}`);
    setCustomFocusMin("");
    setCustomBreakMin("");
    setIsOpen(false);
  };

  const handleToggleSound = (checked: boolean) => {
    setEnableSound(checked);
  };

  const handleToggleNotifications = (checked: boolean) => {
    setBrowserNotifications(checked);
    if (checked && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  return (
    <div className={cn("relative group", className)} ref={menuRef}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button 
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full hover:bg-black/20"
            aria-label="Timer menu"
          >
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-72 p-3 bg-player-dark border-white/10 text-white"
          align="center"
        >
          {/* Timer Style switcher */}
          <div className="mb-4">
            <Tabs 
              defaultValue={timerType} 
              value={timerType}
              onValueChange={handleSwitchTimerType}
              className="w-full"
            >
              <TabsList className="w-full bg-player-medium">
                <TabsTrigger 
                  value="pomodoro"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white flex-1 text-white/70"
                >
                  Pomodoro
                </TabsTrigger>
                <TabsTrigger 
                  value="simple"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white flex-1 text-white/70"
                >
                  Simple Timer
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Quick actions */}
          {state.timer.isActive && (
            <div className="flex flex-col space-y-1 mb-3">
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
          )}
          
          {/* Custom time input */}
          <Separator className="my-3 bg-white/10" />
          <form onSubmit={handleApplyCustomTime}>
            <div className="flex flex-col space-y-2 mb-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="focus-minutes" className="text-xs text-white/70 mb-1 block">
                    Focus (min)
                  </Label>
                  <Input
                    id="focus-minutes"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="25"
                    value={customFocusMin}
                    onChange={(e) => setCustomFocusMin(e.target.value)}
                    className="bg-player-medium border-white/10 h-8 text-sm"
                  />
                </div>
                {timerType === 'pomodoro' && (
                  <div>
                    <Label htmlFor="break-minutes" className="text-xs text-white/70 mb-1 block">
                      Break (min)
                    </Label>
                    <Input
                      id="break-minutes"
                      type="number"
                      min="1"
                      max="30"
                      placeholder="5"
                      value={customBreakMin}
                      onChange={(e) => setCustomBreakMin(e.target.value)}
                      className="bg-player-medium border-white/10 h-8 text-sm"
                    />
                  </div>
                )}
              </div>
              <Button 
                type="submit"
                variant="outline"
                size="sm"
                className="w-full bg-player-medium hover:bg-player-light border-white/10"
              >
                Apply Custom Time
              </Button>
            </div>
          </form>
          
          {/* Sound options & settings */}
          <Separator className="my-3 bg-white/10" />
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-white/90 mb-2 block">
                Timer Sound Effect
              </Label>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/70">Enabled</span>
                <Switch 
                  checked={enableSound}
                  onCheckedChange={handleToggleSound}
                  className="data-[state=checked]:bg-white/30"
                />
              </div>
              
              {enableSound && (
                <RadioGroup 
                  defaultValue="beep" 
                  value={alertSound} 
                  onValueChange={(value) => setAlertSound(value as 'beep' | 'bell')} 
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
            
            {/* Additional settings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Auto Start Timers</span>
                <Switch 
                  checked={autoStartTimers}
                  onCheckedChange={setAutoStartTimers}
                  className="data-[state=checked]:bg-white/30"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Hide Seconds</span>
                <Switch 
                  checked={hideSeconds}
                  onCheckedChange={setHideSeconds}
                  className="data-[state=checked]:bg-white/30"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Browser Notifications</span>
                <Switch 
                  checked={browserNotifications}
                  onCheckedChange={handleToggleNotifications}
                  className="data-[state=checked]:bg-white/30"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimerMenu;
