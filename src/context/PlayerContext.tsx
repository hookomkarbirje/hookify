import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerState, Sound, BackgroundImage, TimerConfig } from '@/types';
import { sounds, backgroundImages } from '@/data/soundData';
import { toast } from 'sonner';
import { setCookie, getCookie } from '@/lib/cookieUtils';
import { playTimerSound, showTimerNotification, requestNotificationPermission } from '@/lib/soundService';

interface PlayerContextType {
  state: PlayerState;
  playSound: (sound: Sound) => void;
  pauseSound: () => void;
  togglePlayPause: () => void;
  toggleHideInterface: () => void;
  setBackground: (background: BackgroundImage) => void;
  toggleUseBackgroundFromSound: () => void;
  setTimer: (duration: number, task?: string, breakDuration?: number, rounds?: number) => void;
  cancelTimer: () => void;
  resetTimer: (mode?: 'focus' | 'break') => void;
  pauseResumeTimer: () => void;
  setVolume: (volume: number) => void;
  toggleMixMode: () => void;
  updateSoundVolume: (soundId: string, volume: number) => void;
  updateTimerSettings: (settings: Partial<TimerConfig>) => void;
  showMixPanel: boolean;
  setShowMixPanel: (show: boolean) => void;
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
    breakDuration: 0,
    totalRounds: 1,
    currentRound: 0,
    completedRounds: 0,
    mode: 'focus',
    isPaused: false,
    task: "",
    hideSeconds: false,
    playSound: true,
    soundType: 'beep',
    autoStart: true,
    showNotifications: false,
  },
  currentBackground: backgroundImages[0],
  volume: 0.8,
  useBackgroundFromSound: true,
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>(initialState);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [showMixPanel, setShowMixPanel] = useState(false);

  useEffect(() => {
    const elementsMap = new Map<string, HTMLAudioElement>();
    
    sounds.forEach(sound => {
      const audioElement = new Audio(sound.audio);
      audioElement.loop = true;
      audioElement.volume = initialState.volume;
      elementsMap.set(sound.id, audioElement);
    });
    
    setAudioElements(elementsMap);
    
    requestNotificationPermission();

    return () => {
      elementsMap.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  useEffect(() => {
    const savedSoundId = getCookie('currentSoundId');
    const savedVolume = getCookie('soundVolume');
    const savedIsPlaying = getCookie('isPlaying');
    const savedIsMixMode = getCookie('isMixMode');
    const savedActiveSounds = getCookie('activeSounds');
    
    if (savedVolume) {
      setState(prev => ({
        ...prev,
        volume: parseFloat(savedVolume)
      }));
    }
    
    if (savedIsMixMode === 'true') {
      setState(prev => ({
        ...prev,
        isMixMode: true
      }));
      
      if (savedActiveSounds) {
        try {
          const activeSoundIds = JSON.parse(savedActiveSounds) as string[];
          const activeSoundObjects = sounds.filter(sound => 
            activeSoundIds.includes(sound.id)
          ).map(sound => ({
            ...sound,
            volume: savedVolume ? parseFloat(savedVolume) : initialState.volume
          }));
          
          setState(prev => ({
            ...prev,
            activeSounds: activeSoundObjects,
            isPlaying: savedIsPlaying === 'true'
          }));
          
          if (savedIsPlaying === 'true') {
            setTimeout(() => {
              activeSoundObjects.forEach(sound => {
                const audio = audioElements.get(sound.id);
                if (audio) {
                  audio.volume = sound.volume || parseFloat(savedVolume || '0.8');
                  audio.play().catch(console.error);
                }
              });
            }, 500);
          }
        } catch (e) {
          console.error('Error parsing saved active sounds:', e);
        }
      }
    } else if (savedSoundId) {
      const sound = sounds.find(s => s.id === savedSoundId);
      if (sound) {
        setState(prev => ({
          ...prev,
          currentSound: sound,
          activeSounds: [{ ...sound, volume: savedVolume ? parseFloat(savedVolume) : initialState.volume }],
          isPlaying: savedIsPlaying === 'true'
        }));
        
        if (savedIsPlaying === 'true') {
          setTimeout(() => {
            const audio = audioElements.get(sound.id);
            if (audio) {
              audio.volume = savedVolume ? parseFloat(savedVolume) : initialState.volume;
              audio.play().catch(error => {
                console.error('Error playing audio:', error);
                toast.error('Failed to play audio');
              });
            }
          }, 500);
        }
      }
    }
  }, [audioElements]);

  useEffect(() => {
    if (state.timer.isActive && state.timer.remaining > 0 && !state.timer.isPaused) {
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
      if (state.timer.playSound) {
        playTimerSound(state.timer.soundType || 'beep');
      }
      
      if (state.timer.showNotifications) {
        const mode = state.timer.mode === 'focus' ? 'Focus' : 'Break';
        showTimerNotification(`${mode} Time Complete`, 
          state.timer.mode === 'focus' 
            ? 'Time to take a break!' 
            : 'Time to focus again!'
        );
      }
      
      if (state.timer.breakDuration > 0) {
        if (state.timer.mode === 'focus') {
          setState(prevState => ({
            ...prevState,
            timer: {
              ...prevState.timer,
              mode: 'break',
              remaining: prevState.timer.breakDuration,
              duration: prevState.timer.breakDuration,
              isPaused: !prevState.timer.autoStart,
            }
          }));
          toast('Focus time completed', {
            description: 'Taking a break now',
          });
        } else if (state.timer.mode === 'break') {
          const completedRounds = state.timer.completedRounds + 1;
          
          if (completedRounds < state.timer.totalRounds) {
            setState(prevState => ({
              ...prevState,
              timer: {
                ...prevState.timer,
                mode: 'focus',
                remaining: prevState.timer.duration,
                currentRound: prevState.timer.currentRound + 1,
                completedRounds: completedRounds,
                isPaused: !prevState.timer.autoStart,
              }
            }));
            toast('Break completed', {
              description: `Starting round ${completedRounds + 1} of ${state.timer.totalRounds}`,
            });
          } else {
            toast('Timer completed', {
              description: `Completed all ${state.timer.totalRounds} rounds`,
            });
            cancelTimer();
          }
        }
      } else {
        toast('Timer completed!');
        cancelTimer();
      }
    }
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [state.timer.isActive, state.timer.remaining, state.timer.isPaused, state.timer.mode]);

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
      
      const isCurrentlyPlaying = state.isPlaying && state.currentSound?.id === sound.id;
      
      if (isCurrentlyPlaying) {
        setState(prevState => ({
          ...prevState,
          isPlaying: false,
          currentSound: null,
          activeSounds: [],
        }));
        toast(`Stopped: ${sound.name}`);
      } else {
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
        useBackgroundFromSound: !prevState.isMixMode ? false : prevState.useBackgroundFromSound,
      };
    });
    
    if (!state.isMixMode) {
      setShowMixPanel(true);
    } else {
      setShowMixPanel(false);
    }
    
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
      useBackgroundFromSound: false,
    }));
    toast(`Background changed to ${background.name}`);
  };

  const toggleUseBackgroundFromSound = () => {
    setState(prevState => ({
      ...prevState,
      useBackgroundFromSound: !prevState.useBackgroundFromSound,
    }));
    
    toast(state.useBackgroundFromSound 
      ? 'Using custom background' 
      : 'Using sound\'s background image');
  };

  const updateTimerSettings = (settings: Partial<TimerConfig>) => {
    setState(prevState => ({
      ...prevState,
      timer: {
        ...prevState.timer,
        ...settings,
      }
    }));
  };

  const setTimer = (duration: number, task?: string, breakDuration: number = 0, rounds: number = 1) => {
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
        breakDuration,
        totalRounds: rounds,
        currentRound: 0,
        completedRounds: 0,
        mode: 'focus',
        isPaused: false,
        task: task || "",
      }
    }));
    
    const roundsLabel = rounds > 1 ? `${rounds} rounds` : '1 round';
    const breakInfo = breakDuration > 0 ? `, ${Math.floor(breakDuration / 60)} min break` : '';
    toast(`Timer set for ${Math.floor(duration / 60)} min focus${breakInfo}, ${roundsLabel}`);
  };

  const cancelTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setState(prevState => ({
      ...prevState,
      timer: {
        ...initialState.timer,
        playSound: prevState.timer.playSound,
        soundType: prevState.timer.soundType,
        hideSeconds: prevState.timer.hideSeconds,
        autoStart: prevState.timer.autoStart,
        showNotifications: prevState.timer.showNotifications,
      },
    }));
    
    toast('Timer canceled');
  };

  const resetTimer = (mode?: 'focus' | 'break') => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    if (mode) {
      setState(prevState => ({
        ...prevState,
        timer: {
          ...prevState.timer,
          mode,
          remaining: mode === 'focus' ? prevState.timer.duration : prevState.timer.breakDuration,
          isPaused: false,
        },
      }));
      
      toast(`Switched to ${mode} timer`);
    } else if (state.timer.duration > 0) {
      setState(prevState => ({
        ...prevState,
        timer: {
          ...prevState.timer,
          remaining: prevState.timer.duration,
          mode: 'focus',
          isPaused: false,
          currentRound: 0,
          completedRounds: 0,
        },
      }));
      
      toast('Timer reset');
    }
  };
  
  const pauseResumeTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setState(prevState => ({
      ...prevState,
      timer: {
        ...prevState.timer,
        isPaused: !prevState.timer.isPaused,
      },
    }));
    
    toast(state.timer.isPaused ? 'Timer resumed' : 'Timer paused');
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
        toggleUseBackgroundFromSound,
        setTimer,
        cancelTimer,
        resetTimer,
        pauseResumeTimer,
        setVolume,
        toggleMixMode,
        updateSoundVolume,
        updateTimerSettings,
        showMixPanel,
        setShowMixPanel,
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
