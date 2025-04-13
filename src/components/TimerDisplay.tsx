
import { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TimerDisplay = () => {
  const { state, resetTimer, cancelTimer } = usePlayer();
  const { timer } = state;
  const [displayTime, setDisplayTime] = useState('');
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (timer.remaining > 0) {
      const minutes = Math.floor(timer.remaining / 60);
      const seconds = timer.remaining % 60;
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setDisplayTime(formattedTime);
      
      // Calculate progress percentage (from 0 to 360 for the circle)
      const progressPercent = (timer.remaining / timer.duration) * 360;
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
  
  const startAngle = -90; // Start from top (12 o'clock position)
  const strokeDashoffset = 0;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference}`;
  const progressOffset = ((360 - progress) / 360) * circumference;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div className="relative flex flex-col items-center justify-center pointer-events-auto">
        {/* Timer Circle */}
        <div className="relative w-80 h-80">
          <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90">
            {/* Background circle (gray) */}
            <circle 
              cx="150" 
              cy="150" 
              r={radius} 
              fill="none" 
              stroke="#444444" 
              strokeWidth="10"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
            
            {/* Progress circle (white) */}
            <circle 
              cx="150" 
              cy="150" 
              r={radius} 
              fill="none" 
              stroke="white" 
              strokeWidth="10" 
              strokeDasharray={strokeDasharray}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Content inside the circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Timer mode tabs */}
            <div className="flex gap-4 mb-4">
              <button 
                onClick={() => setTimerMode('focus')} 
                className={cn(
                  "text-sm uppercase tracking-wider font-medium",
                  timerMode === 'focus' ? "text-white" : "text-gray-400"
                )}
              >
                Focus
              </button>
              <button 
                onClick={() => setTimerMode('break')} 
                className={cn(
                  "text-sm uppercase tracking-wider font-medium",
                  timerMode === 'break' ? "text-white" : "text-gray-400"
                )}
              >
                Break
              </button>
            </div>

            {/* Timer display */}
            <div className="text-white text-7xl font-light">
              {displayTime}
            </div>

            {/* Task name if available */}
            {timer.task && (
              <div className="text-white/60 text-sm mt-2 max-w-48 truncate">
                {timer.task}
              </div>
            )}

            {/* Start/Pause button */}
            <button
              onClick={timer.remaining === timer.duration ? resetTimer : cancelTimer}
              className="mt-8 bg-white/10 hover:bg-white/20 text-white uppercase tracking-wider text-sm font-medium py-2 px-8 rounded-sm transition-colors"
            >
              {timer.remaining === timer.duration ? "START" : "PAUSE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
