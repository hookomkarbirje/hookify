
import { useEffect, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { useIsMobile } from '@/hooks/use-mobile';

const TimerDisplay = () => {
  const { state } = usePlayer();
  const { timer, isHidden } = state;
  const [displayTime, setDisplayTime] = useState('');
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (timer.remaining > 0) {
      const minutes = Math.floor(timer.remaining / 60);
      const seconds = timer.remaining % 60;
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setDisplayTime(formattedTime);
    } else {
      setDisplayTime('');
    }
  }, [timer.remaining]);
  
  // Remove the condition that was hiding the timer
  if (isHidden || !timer.isActive) {
    return null;
  }
  
  return (
    <div className="fixed top-4 right-4 z-10">
      <div className="bg-player-dark/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
        <div className="flex flex-col items-center">
          <div className={`text-white ${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
            {displayTime}
          </div>
          {timer.task && (
            <div className={`text-white/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              {timer.task}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
