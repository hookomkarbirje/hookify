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
  setTimer: (duration: number, task?: string) => void;
  cancelTimer: () => void;
  resetTimer: () => void;
  setVolume: (volume: number) => void;
  toggleMixMode: () => void;
  updateSoundVolume: (soundId: string, volume: number) => void;
}

const initialState: PlayerState = {
  isPlaying: false,
  isHidden: false,
  currentSound: null,
  activeSounds: [],
  isMixMode: false,
  timer: {
    isActive: false,
    duration: 0,
    remaining: 0,
    task: "",
  },
  currentBackground: backgroundImages[0],
  volume: 0.8,
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>(initialState);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  useEffect(() => {
    const elementsMap = new Map<string, HTMLAudioElement>();
    
    sounds.forEach(sound => {
      const audioElement = new Audio(sound.audio);
      audioElement.loop = true;
      audioElement.volume = initialState.volume;
      elementsMap.set(sound.id, audioElement);
    });
    
    setAudioElements(elementsMap);

    return () => {
      elementsMap.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

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

  const playSound = (sound: Sound) => {
    const audioElement = audioElements.get(sound.id);
    if (!audioElement) return;
    
    if (state.isMixMode) {
      const isAlreadyActive = state.activeSounds.some(s => s.id === sound.id);
      
      if (isAlreadyActive) {
        audioElement.pause();
        setState(prevState => ({
          ...prevState,
          activeSounds: prevState.activeSounds.filter(s => s.id !== sound.id),
        }));
        toast(`Removed: ${sound.name}`);
      } else {
        const soundWithVolume = { ...sound, volume: state.volume };
        audioElement.volume = state.volume;
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
          toast.error('Failed to play audio');
        });
        
        setState(prevState => ({
          ...prevState,
          isPlaying: true,
          activeSounds: [...prevState.activeSounds, soundWithVolume],
        }));
        toast.success(`Added: ${sound.name}`);
      }
    } else {
      audioElements.forEach(audio => audio.pause());
      
      audioElement.volume = state.volume;
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error('Failed to play audio');
      });
      
      setState(prevState => ({
        ...prevState,
        isPlaying: true,
        currentSound: sound,
        activeSounds: [{ ...sound, volume: state.volume }],
      }));
      toast.success(`Now playing: ${sound.name}`);
    }
  };

  const pauseSound = () => {
    audioElements.forEach(audio => audio.pause());
    
    setState(prevState => ({
      ...prevState,
      isPlaying: false,
    }));
  };

  const togglePlayPause = () => {
    if (state.isPlaying) {
      pauseSound();
    } else {
      if (state.activeSounds.length > 0) {
        state.activeSounds.forEach(sound => {
          const audio = audioElements.get(sound.id);
          if (audio) {
            audio.volume = sound.volume || state.volume;
            audio.play().catch(console.error);
          }
        });
        
        setState(prevState => ({
          ...prevState,
          isPlaying: true,
        }));
      } else if (sounds.length > 0) {
        playSound(sounds[0]);
      }
    }
  };

  const toggleMixMode = () => {
    setState(prevState => {
      const newActiveSounds = prevState.isMixMode 
        ? prevState.activeSounds.length > 0 ? [prevState.activeSounds[0]] : []
        : prevState.currentSound ? [{ ...prevState.currentSound, volume: prevState.volume }] : [];
      
      return {
        ...prevState,
        isMixMode: !prevState.isMixMode,
        activeSounds: newActiveSounds,
        currentSound: !prevState.isMixMode ? null : (newActiveSounds.length > 0 ? newActiveSounds[0] : null),
      };
    });
    
    toast(`${state.isMixMode ? 'Single' : 'Mix'} mode activated`);
  };

  const updateSoundVolume = (soundId: string, volume: number) => {
    const audio = audioElements.get(soundId);
    if (audio) {
      audio.volume = volume;
    }
    
    setState(prevState => ({
      ...prevState,
      activeSounds: prevState.activeSounds.map(sound => 
        sound.id === soundId ? { ...sound, volume } : sound
      ),
    }));
  };

  const setVolume = (volume: number) => {
    if (!state.isMixMode) {
      audioElements.forEach(audio => {
        audio.volume = volume;
      });
    }
    
    setState(prevState => ({
      ...prevState,
      volume,
    }));
  };

  const toggleHideInterface = () => {
    setState(prevState => ({
      ...prevState,
      isHidden: !prevState.isHidden,
    }));
  };

  const setBackground = (background: BackgroundImage) => {
    setState(prevState => ({
      ...prevState,
      currentBackground: background,
    }));
    toast(`Background changed to ${background.name}`);
  };

  const setTimer = (duration: number, task?: string) => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setState(prevState => ({
      ...prevState,
      timer: {
        ...prevState.timer,
        isActive: true,
        duration,
        remaining: duration,
        task: task || "",
      }
    }));
    
    toast(`Timer set for ${Math.floor(duration / 60)} minutes`);
  };

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
        toggleMixMode,
        updateSoundVolume,
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
