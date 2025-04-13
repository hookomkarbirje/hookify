
import { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { CircleDot } from 'lucide-react';

const TimerDisplay = () => {
  const { state, resetTimer, cancelTimer, pauseResumeTimer } = usePlayer();
  const { timer } = state;
  const [displayTime, setDisplayTime] = useState('');
  const [progress, setProgress] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  
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

  // For demonstration, assuming 4 total rounds
  const totalRounds = 4;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div className="relative flex flex-col items-center justify-center pointer-events-auto max-w-md w-full px-6">
        {/* Timer mode tabs - FOCUS/BREAK switcher */}
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
        
        {/* Round indicators as dots */}
        <div className="flex space-x-2 mb-4">
          {Array.from({ length: totalRounds }).map((_, index) => (
            <div 
              key={index}
              className={cn(
                "w-2 h-2 rounded-full", 
                index < completedRounds ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
        
        {/* Task display - What's getting done */}
        {timer.task && (
          <div className="text-white/80 text-lg mb-4">
            {timer.task}
          </div>
        )}
        
        {/* Horizontal progress line */}
        <div className="w-3/4 mb-6">
          <Progress 
            value={progress} 
            className="h-1 bg-white/10" 
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
