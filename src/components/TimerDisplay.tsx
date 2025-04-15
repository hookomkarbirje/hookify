
import { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import TimerMenu from './TimerMenu';
import { Play, Pause } from 'lucide-react';

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
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (timer.remaining > 0) {
      const minutes = Math.floor(timer.remaining / 60);
      const seconds = timer.remaining % 60;

      // Format time based on hideSeconds setting
      const formattedTime = timer.hideSeconds ? `${minutes.toString().padStart(2, '0')}:00` : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setDisplayTime(formattedTime);

      // Calculate progress percentage for the progress bar (0 to 100)
      // Use the correct total time based on mode
      const totalTime = timer.mode === 'focus' ? timer.duration : timer.breakDuration;
      const progressPercent = 100 - (timer.remaining / totalTime * 100);
      setProgress(progressPercent);

      // Update document title when timer is active
      const mode = timer.mode === 'focus' ? 'FOCUS' : 'BREAK';
      document.title = `${formattedTime} - ${mode}`;
    } else {
      setDisplayTime(timer.hideSeconds ? '00:00' : '00:00');
      setProgress(0);
      // Reset title when timer is inactive
      document.title = 'serene-soundscapes-player';
    }
  }, [timer.remaining, timer.duration, timer.breakDuration, timer.mode, timer.hideSeconds]);

  // Reset title when component unmounts or timer becomes inactive
  useEffect(() => {
    if (!timer.isActive) {
      document.title = 'serene-soundscapes-player';
    }
    return () => {
      document.title = 'serene-soundscapes-player';
    };
  }, [timer.isActive]);

  // Don't render if timer isn't active
  if (!timer.isActive) {
    return null;
  }
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-10 pointer-events-none ${isMobile ? 'pt-0 -mt-16' : ''}`}>
      <div className="relative flex flex-col items-center justify-center pointer-events-auto max-w-md w-full px-6">
        {/* Timer mode tabs - FOCUS/BREAK switcher - only show for Pomodoro timer */}
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

        {/* Timer display */}
        <div className={cn("text-white font-extralight mb-4", isMobile ? "text-6xl" : "text-8xl")}>
          {displayTime}
        </div>
        
        {/* Controls row - centered under timer */}
        <div className="w-full flex justify-center items-center gap-8 mb-4">
          {/* Play/Pause button */}
          <button 
            onClick={pauseResumeTimer} 
            aria-label={timer.isPaused ? "Start timer" : "Pause timer"} 
            className="p-2 rounded-full bg-black/30 border border-white/20 hover:bg-white/10 shadow-md transition-all hover:scale-105"
          >
            {timer.isPaused ? <Play className="h-5 w-5 text-white" /> : <Pause className="h-5 w-5 text-white" />}
          </button>
          
          {/* Timer menu with improved visibility */}
          <TimerMenu className="opacity-70 hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Round indicators as dots - only show for Pomodoro timer with multiple rounds */}
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
        
        {/* Round info text - only show for Pomodoro timer with multiple rounds */}
        {timer.breakDuration > 0 && timer.totalRounds > 1 && (
          <div className="text-white/60 text-xs mb-2">
            Round {timer.currentRound + 1} of {timer.totalRounds}
          </div>
        )}
        
        {/* Task display - What's getting done */}
        {timer.task && (
          <div className="text-white/80 text-lg mb-4">
            {timer.task}
          </div>
        )}
        
        {/* Horizontal progress line */}
        <div className="w-3/4 mb-6">
          <Progress value={progress} className="h-1 bg-white/10" />
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
