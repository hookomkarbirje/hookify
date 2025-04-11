
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
  const { timer, currentSound } = state;
  
  if (!timer.isActive) return null;
  
  // Calculate the progress percentage for the circle
  const progress = timer.remaining / timer.duration;
  const circumference = 2 * Math.PI * 120; // Circle radius 120
  const dashoffset = circumference * (1 - progress);
  
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
      {/* Timer name and description */}
      <h2 className="text-white text-2xl font-light mb-1">
        {currentSound?.name || "Ambient Sound"}
      </h2>
      <p className="text-white/70 text-sm mb-6">
        Shutting off in {formatTime(timer.remaining)}
      </p>
      
      {/* Timer Circle */}
      <div className="relative w-[280px] h-[280px] flex items-center justify-center">
        {/* Background circle */}
        <svg className="absolute inset-0 transform -rotate-90" width="280" height="280">
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="transparent"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="transparent"
            stroke="white"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
          />
          {/* Tick marks - 60 small dots around the circle */}
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6) * (Math.PI / 180); // 6 degrees per tick
            const x = 140 + 120 * Math.cos(angle);
            const y = 140 + 120 * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i % 5 === 0 ? 2 : 1} // Larger dots for every 5th tick
                fill="rgba(255,255,255,0.5)"
              />
            );
          })}
        </svg>
        
        {/* Timer digits */}
        <div className="text-white text-6xl font-light z-10">
          {formatTime(timer.remaining)}
        </div>
        
        {/* Timer controls (when not hidden) */}
        {!state.isHidden && (
          <div className="absolute bottom-[-60px] flex gap-4">
            <button
              onClick={resetTimer}
              className="bg-black/40 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"
              title="Reset timer"
            >
              <RefreshCcw className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={cancelTimer}
              className="bg-black/40 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"
              title="Cancel timer"
            >
              <XCircle className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerDisplay;
