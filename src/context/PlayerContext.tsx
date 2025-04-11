
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerState, Sound, BackgroundImage, TimerConfig } from '@/types';
import { sounds, backgroundImages } from '@/data/soundData';
import { toast } from 'sonner';

interface PlayerContextType {
  state: PlayerState;
  playSound: (sound: Sound) => void;
  pauseSound: () => void;
  togglePlayPause: () => void;
  toggleHideInterface: () => void;
  setBackground: (background: BackgroundImage) => void;
  setTimer: (duration: number) => void;
  cancelTimer: () => void;
  resetTimer: () => void;
  setVolume: (volume: number) => void;
}

const initialState: PlayerState = {
  isPlaying: false,
  isHidden: false,
  currentSound: null,
  timer: {
    isActive: false,
    duration: 0,
    remaining: 0,
  },
  currentBackground: backgroundImages[0],
  volume: 0.8,
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>(initialState);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audioElement = new Audio();
    audioElement.loop = true;
    audioElement.volume = initialState.volume;
    setAudio(audioElement);

    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, []);

  // Manage timer countdown
  useEffect(() => {
    if (state.timer.isActive && state.timer.remaining > 0) {
      const interval = window.setInterval(() => {
        setState(prevState => ({
          ...prevState,
          timer: {
            ...prevState.timer,
            remaining: prevState.timer.remaining - 1,
          }
        }));
      }, 1000);
      
      setTimerInterval(interval);
      
      return () => clearInterval(interval);
    } else if (state.timer.isActive && state.timer.remaining === 0) {
      // Timer completed
      pauseSound();
      setState(prevState => ({
        ...prevState,
        timer: {
          ...prevState.timer,
          isActive: false,
        }
      }));
      toast('Timer completed', {
        description: 'Your ambient sound session has ended',
      });
    }
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [state.timer.isActive, state.timer.remaining]);

  // Play a sound
  const playSound = (sound: Sound) => {
    if (!audio) return;
    
    audio.src = sound.audio;
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio');
    });
    
    setState(prevState => ({
      ...prevState,
      isPlaying: true,
      currentSound: sound,
    }));

    toast.success(`Now playing: ${sound.name}`);
  };

  // Pause sound
  const pauseSound = () => {
    if (!audio) return;
    
    audio.pause();
    
    setState(prevState => ({
      ...prevState,
      isPlaying: false,
    }));
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (state.isPlaying) {
      pauseSound();
    } else if (state.currentSound) {
      playSound(state.currentSound);
    } else if (sounds.length > 0) {
      playSound(sounds[0]);
    }
  };

  // Toggle hide interface
  const toggleHideInterface = () => {
    setState(prevState => ({
      ...prevState,
      isHidden: !prevState.isHidden,
    }));
  };

  // Set background
  const setBackground = (background: BackgroundImage) => {
    setState(prevState => ({
      ...prevState,
      currentBackground: background,
    }));
    toast(`Background changed to ${background.name}`);
  };

  // Set timer
  const setTimer = (duration: number) => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setState(prevState => ({
      ...prevState,
      timer: {
        isActive: true,
        duration,
        remaining: duration,
      },
    }));
    
    toast(`Timer set for ${Math.floor(duration / 60)} minutes`);
  };

  // Cancel timer
  const cancelTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setState(prevState => ({
      ...prevState,
      timer: {
        isActive: false,
        duration: 0,
        remaining: 0,
      },
    }));
    
    toast('Timer canceled');
  };

  // Reset timer
  const resetTimer = () => {
    if (state.timer.duration > 0) {
      setState(prevState => ({
        ...prevState,
        timer: {
          ...prevState.timer,
          isActive: true,
          remaining: prevState.timer.duration,
        },
      }));
      
      toast('Timer reset');
    }
  };

  // Set volume
  const setVolume = (volume: number) => {
    if (!audio) return;
    
    audio.volume = volume;
    
    setState(prevState => ({
      ...prevState,
      volume,
    }));
  };

  return (
    <PlayerContext.Provider
      value={{
        state,
        playSound,
        pauseSound,
        togglePlayPause,
        toggleHideInterface,
        setBackground,
        setTimer,
        cancelTimer,
        resetTimer,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
