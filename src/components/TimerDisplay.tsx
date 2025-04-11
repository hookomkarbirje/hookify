
import { usePlayer } from "@/context/PlayerContext";
import { RefreshCcw, XCircle } from "lucide-react";

// Helper function to format time
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

const TimerDisplay = () => {
  const { state, cancelTimer, resetTimer } = usePlayer();
  const { timer } = state;
  
  if (!timer.isActive) return null;
  
  return (
    <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
      <div className="mb-2 text-5xl font-light text-white">
        {formatTime(timer.remaining)}
      </div>
      
      {!state.isHidden && (
        <div className="flex gap-3">
          <button
            onClick={resetTimer}
            className="control-button"
            title="Reset timer"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button
            onClick={cancelTimer}
            className="control-button"
            title="Cancel timer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
