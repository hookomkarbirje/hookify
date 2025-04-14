
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlayer } from '@/context/PlayerContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TimerModal = ({ isOpen, onClose }: TimerModalProps) => {
  const { state, setTimer, updateTimerSettings } = usePlayer();
  const [focusMinutes, setFocusMinutes] = useState('25');
  const [breakMinutes, setBreakMinutes] = useState('5');
  const [rounds, setRounds] = useState('4');
  const [timerType, setTimerType] = useState<'pomodoro' | 'simple'>('pomodoro');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseInt(focusMinutes) * 60;
    const breakDuration = timerType === 'pomodoro' ? parseInt(breakMinutes) * 60 : 0;
    const totalRounds = timerType === 'pomodoro' ? parseInt(rounds) : 1;
    
    setTimer(duration, undefined, breakDuration, totalRounds);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-black text-white border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-light">Focus Timer Settings</DialogTitle>
          <DialogDescription className="text-white/70">
            Configure your focus timer preferences
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Timer Type Selection */}
          <div className="space-y-2">
            <label className="text-sm text-white/70">Timer Type</label>
            <Tabs 
              defaultValue={timerType} 
              value={timerType}
              onValueChange={(value) => setTimerType(value as 'pomodoro' | 'simple')}
              className="w-full"
            >
              <TabsList className="w-full bg-white/5">
                <TabsTrigger 
                  value="pomodoro"
                  className="flex-1 data-[state=active]:bg-white/10"
                >
                  Pomodoro
                </TabsTrigger>
                <TabsTrigger 
                  value="simple"
                  className="flex-1 data-[state=active]:bg-white/10"
                >
                  Simple Timer
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Timer Duration Settings */}
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-white/70 block mb-2">Focus Time (minutes)</label>
              <Input
                type="number"
                min="1"
                max="120"
                value={focusMinutes}
                onChange={(e) => setFocusMinutes(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>

            {timerType === 'pomodoro' && (
              <>
                <div>
                  <label className="text-sm text-white/70 block mb-2">Break Time (minutes)</label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={breakMinutes}
                    onChange={(e) => setBreakMinutes(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70 block mb-2">Number of Rounds</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={rounds}
                    onChange={(e) => setRounds(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </>
            )}
          </div>

          {/* Timer Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/70">Timer Sound Effect</label>
              <Switch
                checked={state.timer.playSound}
                onCheckedChange={(checked) => updateTimerSettings({ playSound: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-white/70">Auto Start Timers</label>
              <Switch
                checked={state.timer.autoStart}
                onCheckedChange={(checked) => updateTimerSettings({ autoStart: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-white/70">Hide Seconds</label>
              <Switch
                checked={state.timer.hideSeconds}
                onCheckedChange={(checked) => updateTimerSettings({ hideSeconds: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-white/70">Browser Notifications</label>
              <Switch
                checked={state.timer.showNotifications}
                onCheckedChange={(checked) => updateTimerSettings({ showNotifications: checked })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-white text-black hover:bg-white/90">
            Start Timer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimerModal;
