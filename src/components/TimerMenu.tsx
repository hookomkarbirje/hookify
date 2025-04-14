
import { useState, useRef, useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { 
  MoreHorizontal, Clock, Check, RefreshCcw, 
  Plus, Bell, PlayCircle, Eye, BellRing 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

const TimerMenu = () => {
  const { 
    state, 
    resetTimer, 
    cancelTimer, 
    setTimer, 
    pauseResumeTimer,
    toggleTimerType,
    toggleHideSeconds,
    toggleAutoStartTimers,
    toggleTimerSoundEffects,
    toggleBrowserNotifications,
    setTimerAlertSound
  } = usePlayer();
  const { timer } = state;
  const [open, setOpen] = useState(false);
  const [focusTime, setFocusTime] = useState('1');
  const [breakTime, setBreakTime] = useState('1');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Set initial values based on current timer
  useEffect(() => {
    if (timer.duration > 0) {
      setFocusTime(Math.floor(timer.duration / 60).toString());
    }
    if (timer.breakDuration > 0) {
      setBreakTime(Math.floor(timer.breakDuration / 60).toString());
    }
  }, [timer.duration, timer.breakDuration]);

  const handleFocusTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyCustomTimes();
    }
  };

  const handleBreakTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyCustomTimes();
    }
  };

  const applyCustomTimes = () => {
    const focusMinutes = parseInt(focusTime) || 1;
    const breakMinutes = parseInt(breakTime) || 1;
    setTimer(focusMinutes * 60, timer.task, breakMinutes * 60, timer.totalRounds);
    setOpen(false);
  };

  const handleCompleteTimer = () => {
    cancelTimer();
    setOpen(false);
  };

  const handleRestartTimer = () => {
    resetTimer();
    setOpen(false);
  };

  const handleAddTenMinutes = () => {
    const newDuration = timer.remaining + 600;
    setTimer(newDuration, timer.task, timer.breakDuration, timer.totalRounds);
    setOpen(false);
  };

  return (
    <div ref={popoverRef} className="relative z-20">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0"
            aria-label="Timer menu"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-72 p-3 bg-[#1A1F2C] border-[#333] text-white"
          align="end"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-medium">{state.timer.timerType || "Pomodoro"}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTimerType} 
              className="text-xs text-gray-400 hover:text-white"
            >
              {state.timer.timerType === "Simple Timer" ? "Pomodoro" : "Simple Timer"}
            </Button>
          </div>
          
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm" 
              onClick={handleCompleteTimer}
            >
              <Check className="mr-2 h-4 w-4" />
              Complete timer
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm" 
              onClick={handleRestartTimer}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Restart timer
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm" 
              onClick={handleAddTenMinutes}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add 10 minutes
            </Button>
          </div>
          
          <Separator className="my-3 bg-gray-700" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Focus</span>
              <div className="flex items-center">
                <Input
                  type="number"
                  min="1"
                  value={focusTime}
                  onChange={(e) => setFocusTime(e.target.value)}
                  onKeyDown={handleFocusTimeKeyDown}
                  className="w-16 h-8 bg-[#2A2F3C] border-[#444] text-center text-sm"
                />
                <span className="ml-2 text-sm text-gray-400">min</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Break</span>
              <div className="flex items-center">
                <Input
                  type="number"
                  min="1"
                  value={breakTime}
                  onChange={(e) => setBreakTime(e.target.value)}
                  onKeyDown={handleBreakTimeKeyDown}
                  className="w-16 h-8 bg-[#2A2F3C] border-[#444] text-center text-sm"
                />
                <span className="ml-2 text-sm text-gray-400">min</span>
              </div>
            </div>
          </div>
          
          <Separator className="my-3 bg-gray-700" />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                Timer sound effects
              </span>
              <Switch
                checked={state.timer.timerSoundEffects}
                onCheckedChange={toggleTimerSoundEffects}
              />
            </div>
            
            {state.timer.timerSoundEffects && (
              <div className="ml-6 space-y-2">
                <Button 
                  variant={state.timer.alertSound === 'beep' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setTimerAlertSound('beep')}
                  className={cn("text-xs w-full justify-start", 
                    state.timer.alertSound === 'beep' ? "bg-[#33C3F0]" : ""
                  )}
                >
                  Beep
                </Button>
                <Button 
                  variant={state.timer.alertSound === 'bell' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setTimerAlertSound('bell')}
                  className={cn("text-xs w-full justify-start", 
                    state.timer.alertSound === 'bell' ? "bg-[#33C3F0]" : ""
                  )}
                >
                  Bell
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center">
                <PlayCircle className="mr-2 h-4 w-4" />
                Auto-start timers
              </span>
              <Switch
                checked={state.timer.autoStartTimers}
                onCheckedChange={toggleAutoStartTimers}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Hide seconds
              </span>
              <Switch
                checked={state.timer.hideSeconds}
                onCheckedChange={toggleHideSeconds}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center">
                <BellRing className="mr-2 h-4 w-4" />
                Browser notifications
              </span>
              <Switch
                checked={state.timer.browserNotifications}
                onCheckedChange={toggleBrowserNotifications}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimerMenu;
