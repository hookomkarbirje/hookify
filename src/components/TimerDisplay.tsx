
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
      
      // Calculate progress percentage for the arc (0 to 100)
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
  
  // Arc parameters for a one-third circle starting from left to right
  const startAngle = 150; // Start from left side
  const endAngle = 30; // End at right side
  const radius = 140;
  const centerX = 150;
  const centerY = 150;
  
  // Calculate the point coordinates for the arc
  const startRadians = (startAngle * Math.PI) / 180;
  const endRadians = (endAngle * Math.PI) / 180;
  
  // Calculate the sweep flag (0 for minor arc, 1 for major arc)
  const sweepFlag = 1;
  
  // Calculate start and end points
  const startX = centerX + radius * Math.cos(startRadians);
  const startY = centerY + radius * Math.sin(startRadians);
  const endX = centerX + radius * Math.cos(endRadians);
  const endY = centerY + radius * Math.sin(endRadians);
  
  // Calculate the current progress point along the arc
  const progressAngle = startAngle - ((startAngle - endAngle) * progress) / 100;
  const progressRadians = (progressAngle * Math.PI) / 180;
  const progressX = centerX + radius * Math.cos(progressRadians);
  const progressY = centerY + radius * Math.sin(progressRadians);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div className="relative flex flex-col items-center justify-center pointer-events-auto">
        {/* Timer Circle */}
        <div className="relative w-80 h-80">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Background arc (gray) */}
            <path 
              d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${sweepFlag} 0 ${endX} ${endY}`}
              fill="none" 
              stroke="#444444" 
              strokeWidth="10" 
              strokeLinecap="round"
            />
            
            {/* Progress arc (white) */}
            <path 
              d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${progress > 50 ? sweepFlag : 0} 0 ${progressX} ${progressY}`}
              fill="none" 
              stroke="white" 
              strokeWidth="10" 
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Content inside the circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Timer mode tabs */}
            <div className="flex gap-6 mb-4">
              <button 
                onClick={() => timer.mode === 'break' && resetTimer('focus')}
                className={cn(
                  "text-sm uppercase tracking-wider font-medium",
                  timer.mode === 'focus' ? "text-white" : "text-gray-400"
                )}
              >
                FOCUS
              </button>
              <button 
                onClick={() => timer.mode === 'focus' && resetTimer('break')}
                className={cn(
                  "text-sm uppercase tracking-wider font-medium",
                  timer.mode === 'break' ? "text-white" : "text-gray-400"
                )}
              >
                BREAK
              </button>
            </div>

            {/* Timer display */}
            <div className="text-white text-8xl font-light">
              {displayTime}
            </div>

            {/* Start/Pause button */}
            <button
              onClick={pauseResumeTimer}
              className="mt-10 bg-gray-300 hover:bg-white text-black uppercase tracking-wider text-sm font-medium py-2 px-10 rounded-sm transition-colors"
            >
              {timer.isPaused ? "START" : "PAUSE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
