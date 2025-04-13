
import { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TOTAL_ROUNDS = 4; // Default number of rounds

const TimerDisplay = () => {
  const { state, resetTimer, cancelTimer } = usePlayer();
  const { timer } = state;
  const [displayTime, setDisplayTime] = useState('');
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [currentRound, setCurrentRound] = useState(1);
  const [progress, setProgress] = useState(100);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (timer.remaining > 0) {
      const minutes = Math.floor(timer.remaining / 60);
      const seconds = timer.remaining % 60;
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setDisplayTime(formattedTime);
      
      // Calculate progress percentage
      const progressPercent = (timer.remaining / timer.duration) * 100;
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
    <div className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
      <div className="bg-player-dark/70 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center pointer-events-auto">
        {/* Mode Toggler - Focus/Break */}
        <div className="bg-player-medium/50 rounded-full p-1 mb-6">
          <div className="flex">
            <Toggle
              pressed={timerMode === 'focus'}
              onPressedChange={() => setTimerMode('focus')}
              className={cn(
                "px-4 py-1 rounded-full text-sm",
                timerMode === 'focus' ? "bg-white text-black" : "text-white/70"
              )}
            >
              Focus
            </Toggle>
            <Toggle
              pressed={timerMode === 'break'}
              onPressedChange={() => setTimerMode('break')}
              className={cn(
                "px-4 py-1 rounded-full text-sm",
                timerMode === 'break' ? "bg-white text-black" : "text-white/70"
              )}
            >
              Break
            </Toggle>
          </div>
        </div>
        
        {/* Timer Display with Progress Circle */}
        <div className="relative w-48 h-48 mb-6">
          {/* Semi-circular progress indicator */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-full relative">
              <svg viewBox="0 0 100 100" className="w-full h-full rotate-180">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="5" 
                  strokeDasharray="283"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-200"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="5" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-200"
                />
              </svg>
            </div>
          </div>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-light text-white">
              {displayTime}
            </div>
            {timer.task && (
              <div className="text-white/70 text-sm mt-1 max-w-32 truncate">
                {timer.task}
              </div>
            )}
          </div>
        </div>
        
        {/* Round Indicators */}
        <div className="flex space-x-2 mb-6">
          {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
            <div 
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-300",
                i < currentRound ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
        
        {/* Timer Controls */}
        <div className="flex space-x-4">
          <Button 
            onClick={resetTimer}
            size="icon" 
            variant="outline"
            className="rounded-full border-white/10 bg-player-medium/50 text-white hover:bg-player-medium hover:text-white"
          >
            <RefreshCw size={16} />
          </Button>
          
          <Button 
            onClick={togglePlayPause}
            size="icon"
            className="rounded-full bg-white text-black hover:bg-white/90 w-12 h-12"
          >
            {state.isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          
          <Button 
            onClick={cancelTimer}
            size="icon" 
            variant="outline"
            className="rounded-full border-white/10 bg-player-medium/50 text-white hover:bg-player-medium hover:text-white"
          >
            <div className="w-4 h-4 bg-white/80 rounded-sm"></div>
          </Button>
        </div>
      </div>
    </div>
  );
  
  // Toggle play/pause function
  function togglePlayPause() {
    // Since we're using the existing player's play/pause functionality
    if (state.isPlaying) {
      cancelTimer();
    } else {
      resetTimer();
    }
  }
};

export default TimerDisplay;
