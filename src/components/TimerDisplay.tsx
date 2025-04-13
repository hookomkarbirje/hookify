
import { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { cn } from '@/lib/utils';

const TimerDisplay = () => {
  const { state, resetTimer, cancelTimer, pauseResumeTimer } = usePlayer();
  const { timer } = state;
  const [displayTime, setDisplayTime] = useState('');
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (timer.remaining > 0) {
      const minutes = Math.floor(timer.remaining / 60);
      const seconds = timer.remaining % 60;
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setDisplayTime(formattedTime);
      
      // Calculate progress percentage for the progress bar (0 to 100)
      const progressPercent = 100 - ((timer.remaining / timer.duration) * 100);
      setProgress(progressPercent);
    } else {
      setDisplayTime('00:00');
      setProgress(0);
    }
  }, [timer.remaining, timer.duration]);
  
  // Don't render if timer isn't active
  if (!timer.isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div className="relative flex flex-col items-center justify-center pointer-events-auto max-w-md w-full px-6">
        {/* Timer mode tabs */}
        <div className="flex gap-10 mb-4">
          <button 
            onClick={() => timer.mode === 'break' && resetTimer('focus')}
            className={cn(
              "text-xs uppercase tracking-widest font-medium",
              timer.mode === 'focus' ? "text-white" : "text-gray-500"
            )}
          >
            FOCUS
          </button>
          <button 
            onClick={() => timer.mode === 'focus' && resetTimer('break')}
            className={cn(
              "text-xs uppercase tracking-widest font-medium",
              timer.mode === 'break' ? "text-white" : "text-gray-500"
            )}
          >
            BREAK
          </button>
        </div>

        {/* Timer display */}
        <div className="text-white text-8xl font-extralight mb-4">
          {displayTime}
        </div>
        
        {/* Task display - What's getting done */}
        {timer.task && (
          <div className="text-white/80 text-lg mb-4">
            {timer.task}
          </div>
        )}
        
        {/* Progress bar */}
        <div className="w-full bg-white/10 h-1 mb-8 rounded-full overflow-hidden">
          <div 
            className="bg-white h-full transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Start/Pause button */}
        <button
          onClick={pauseResumeTimer}
          className="bg-gray-300 hover:bg-white text-black uppercase tracking-wider text-sm py-1.5 px-8 rounded-sm transition-colors"
        >
          {timer.isPaused ? "START" : "PAUSE"}
        </button>
      </div>
    </div>
  );
};

export default TimerDisplay;
