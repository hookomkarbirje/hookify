import { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import TimerMenu from './TimerMenu';
import TimerSettingsModal from './TimerSettingsModal';
import TimerOptionsDialog from './TimerOptionsDialog';
import { Play, Pause, Settings } from 'lucide-react';

const TimerDisplay = () => {
  const {
    state,
    resetTimer,
    cancelTimer,
    pauseResumeTimer
  } = usePlayer();
  const {
    timer
  } = state;
  const [displayTime, setDisplayTime] = useState('');
  const [progress, setProgress] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (timer.remaining > 0) {
      const minutes = Math.floor(timer.remaining / 60);
      const seconds = timer.remaining % 60;

      const formattedTime = timer.hideSeconds ? `${minutes.toString().padStart(2, '0')}:00` : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setDisplayTime(formattedTime);

      const totalTime = timer.mode === 'focus' ? timer.duration : timer.breakDuration;
      const progressPercent = 100 - (timer.remaining / totalTime * 100);
      setProgress(progressPercent);

      const mode = timer.mode === 'focus' ? 'FOCUS' : 'BREAK';
      document.title = `${formattedTime} - ${mode}`;
    } else {
      setDisplayTime(timer.hideSeconds ? '00:00' : '00:00');
      setProgress(0);
      document.title = 'serene-soundscapes-player';
    }
  }, [timer.remaining, timer.duration, timer.breakDuration, timer.mode, timer.hideSeconds]);

  useEffect(() => {
    if (!timer.isActive) {
      document.title = 'serene-soundscapes-player';
    }
    return () => {
      document.title = 'serene-soundscapes-player';
    };
  }, [timer.isActive]);

  if (!timer.isActive) {
    return null;
  }
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-10 pointer-events-none ${isMobile ? 'pt-0 -mt-16' : ''}`}>
      <div className="relative flex flex-col items-center justify-center pointer-events-auto max-w-md w-full px-6">
        <div className="flex items-center justify-between w-full mb-4">
          <h2 className="text-white text-xl font-light">Focus Timer</h2>
          <button 
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            onClick={() => setShowOptionsDialog(true)}
          >
            <Settings className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <div className="flex gap-10 mb-4">
          {timer.breakDuration > 0 && (
            <div className="flex gap-10 mb-4">
              <button 
                onClick={() => timer.mode === 'break' && resetTimer('focus')} 
                className={cn("text-xs uppercase tracking-widest font-medium", 
                  timer.mode === 'focus' ? "text-white" : "text-gray-500")}
              >
                FOCUS
              </button>
              <button 
                onClick={() => timer.mode === 'focus' && resetTimer('break')} 
                className={cn("text-xs uppercase tracking-widest font-medium", 
                  timer.mode === 'break' ? "text-white" : "text-gray-500")}
              >
                BREAK
              </button>
            </div>
          )}
        </div>

        <div className={cn("text-white font-extralight mb-4", isMobile ? "text-6xl" : "text-8xl")}>
          {displayTime}
        </div>
        
        <div className="w-full flex justify-center items-center gap-8 mb-4">
          <button 
            onClick={pauseResumeTimer} 
            aria-label={timer.isPaused ? "Start timer" : "Pause timer"} 
            className="p-2 rounded-full bg-black/30 border border-white/20 hover:bg-white/10 shadow-md transition-all hover:scale-105"
          >
            {timer.isPaused ? <Play className="h-5 w-5 text-white" /> : <Pause className="h-5 w-5 text-white" />}
          </button>
          
          <TimerMenu className="opacity-70 hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {timer.breakDuration > 0 && timer.totalRounds > 1 && (
          <div className="flex space-x-2 mb-4">
            {Array.from({length: timer.totalRounds}).map((_, index) => (
              <div 
                key={index} 
                className={cn(
                  "w-2 h-2 rounded-full", 
                  index < timer.completedRounds || (index === timer.currentRound && timer.mode === 'break') 
                    ? "bg-white" 
                    : "bg-white/30"
                )} 
              />
            ))}
          </div>
        )}
        
        {timer.breakDuration > 0 && timer.totalRounds > 1 && (
          <div className="text-white/60 text-xs mb-2">
            Round {timer.currentRound + 1} of {timer.totalRounds}
          </div>
        )}
        
        {timer.task && (
          <div className="text-white/80 text-lg mb-4">
            {timer.task}
          </div>
        )}
        
        <div className="w-3/4 mb-6">
          <Progress value={progress} className="h-1 bg-white/10" />
        </div>
      </div>

      <TimerSettingsModal 
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        selectedMinutes={Math.floor(timer.duration / 60)}
        setSelectedMinutes={(mins) => {
          // These just update the modal UI, not the actual timer
        }}
        shortBreakMinutes={Math.floor(timer.breakDuration / 60)}
        setShortBreakMinutes={(mins) => {
          // These just update the modal UI, not the actual timer
        }}
        customFocusMinutes=""
        setCustomFocusMinutes={() => {}}
        customBreakMinutes=""
        setCustomBreakMinutes={() => {}}
      />

      <TimerOptionsDialog 
        isOpen={showOptionsDialog}
        onClose={() => setShowOptionsDialog(false)}
      />
    </div>
  );
};

export default TimerDisplay;
