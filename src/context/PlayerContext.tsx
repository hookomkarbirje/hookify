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
  },
  currentBackground: backgroundImages[0],
  volume: 0.8,
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>(initialState);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Initialize audio elements for all sounds
  useEffect(() => {
    const elementsMap = new Map<string, HTMLAudioElement>();
    
    // Create audio elements for all sounds
    sounds.forEach(sound => {
      const audioElement = new Audio(sound.audio);
      audioElement.loop = true;
      audioElement.volume = initialState.volume;
      elementsMap.set(sound.id, audioElement);
    });
    
    setAudioElements(elementsMap);

    return () => {
      // Cleanup audio elements
      elementsMap.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
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
    const audioElement = audioElements.get(sound.id);
    if (!audioElement) return;
    
    if (state.isMixMode) {
      // In mix mode, add to active sounds if not already active
      const isAlreadyActive = state.activeSounds.some(s => s.id === sound.id);
      
      if (isAlreadyActive) {
        // Remove from active sounds
        audioElement.pause();
        setState(prevState => ({
          ...prevState,
          activeSounds: prevState.activeSounds.filter(s => s.id !== sound.id),
        }));
        toast(`Removed: ${sound.name}`);
      } else {
        // Add to active sounds
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
      // In regular mode, replace current sound
      // Pause all currently playing sounds
      audioElements.forEach(audio => audio.pause());
      
      // Play selected sound
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

  // Pause sound
  const pauseSound = () => {
    // Pause all playing sounds
    audioElements.forEach(audio => audio.pause());
    
    setState(prevState => ({
      ...prevState,
      isPlaying: false,
    }));
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (state.isPlaying) {
      pauseSound();
    } else {
      // Resume playing all active sounds
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
        // If no active sounds, play the first available sound
        playSound(sounds[0]);
      }
    }
  };

  // Toggle mix mode
  const toggleMixMode = () => {
    setState(prevState => {
      // When switching to mix mode, keep current sound as active
      // When switching from mix mode to single mode, keep only the first active sound
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

  // Update individual sound volume
  const updateSoundVolume = (soundId: string, volume: number) => {
    // Update audio element volume
    const audio = audioElements.get(soundId);
    if (audio) {
      audio.volume = volume;
    }
    
    // Update state
    setState(prevState => ({
      ...prevState,
      activeSounds: prevState.activeSounds.map(sound => 
        sound.id === soundId ? { ...sound, volume } : sound
      ),
    }));
  };

  // Set volume (master)
  const setVolume = (volume: number) => {
    // Update all audio elements if not in mix mode
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
