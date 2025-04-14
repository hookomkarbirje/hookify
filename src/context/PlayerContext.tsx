
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerState, Sound, BackgroundImage, TimerConfig } from '@/types';
import { sounds, backgroundImages } from '@/data/soundData';
import { toast } from 'sonner';
import { setCookie, getCookie, setJsonCookie, getJsonCookie } from '@/lib/cookieUtils';

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
  showMixPanel: boolean;
  setShowMixPanel: (show: boolean) => void;
  toggleTimerType: () => void;
  toggleHideSeconds: () => void;
  toggleAutoStartTimers: () => void;
  toggleTimerSoundEffects: () => void;
  toggleBrowserNotifications: () => void;
  setTimerAlertSound: (sound: 'beep' | 'bell') => void;
}

// Timer alert sounds
const timerSounds = {
  beep: 'https://api.substack.com/feed/podcast/159247735/d47b8fa79d5b4c3e0171d2d1b0f50e48.mp3',
  bell: 'https://api.substack.com/feed/podcast/159247735/d47b8fa79d5b4c3e0171d2d1b0f50e48.mp3',
};

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
    timerType: 'Pomodoro',
    hideSeconds: false,
    autoStartTimers: true,
    timerSoundEffects: true,
    browserNotifications: false,
    alertSound: 'bell',
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
  const [timerAlertAudio, setTimerAlertAudio] = useState<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    const elementsMap = new Map<string, HTMLAudioElement>();
    
    sounds.forEach(sound => {
      const audioElement = new Audio(sound.audio);
      audioElement.loop = true;
      audioElement.volume = initialState.volume;
      elementsMap.set(sound.id, audioElement);
    });
    
    setAudioElements(elementsMap);

    // Initialize timer alert sound
    const alertAudio = new Audio(timerSounds.bell);
    setTimerAlertAudio(alertAudio);

    return () => {
      elementsMap.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      
      if (timerAlertAudio) {
        timerAlertAudio.pause();
        timerAlertAudio.src = '';
      }
    };
  }, []);

  // Load saved state from cookies
  useEffect(() => {
    const savedSoundId = getCookie('currentSoundId');
    const savedVolume = getCookie('soundVolume');
    const savedIsPlaying = getCookie('isPlaying');
    const savedIsMixMode = getCookie('isMixMode');
    const savedActiveSounds = getCookie('activeSounds');
    const savedTimerSettings = getJsonCookie<Partial<TimerConfig>>('timerSettings');
    
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
              audio.play().catch(console.error);
            }
          }, 500);
        }
      }
    }

    // Apply saved timer settings
    if (savedTimerSettings) {
      setState(prev => ({
        ...prev,
        timer: {
          ...prev.timer,
          ...savedTimerSettings,
        }
      }));

      if (savedTimerSettings.alertSound && timerAlertAudio) {
        timerAlertAudio.src = timerSounds[savedTimerSettings.alertSound];
      }
    }
  }, [audioElements]);

  // Timer logic
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
      // Play alert sound if enabled
      if (state.timer.timerSoundEffects && timerAlertAudio) {
        timerAlertAudio.play().catch(error => {
          console.error('Error playing timer alert sound:', error);
        });
      }

      // Show browser notification if enabled
      if (state.timer.browserNotifications) {
        sendBrowserNotification(
          state.timer.mode === 'focus' ? 'Focus time completed' : 'Break time completed'
        );
      }

      if (state.timer.mode === 'focus') {
        // If Simple Timer, just stop
        if (state.timer.timerType === 'Simple Timer') {
          if (state.isPlaying) {
            pauseSound();
          }
          setState(prevState => ({
            ...prevState,
            timer: {
              ...prevState.timer,
              isActive: false,
            }
          }));
          toast('Timer completed');
          return;
        }

        setState(prevState => ({
          ...prevState,
          timer: {
            ...prevState.timer,
            mode: 'break',
            remaining: prevState.timer.breakDuration,
            duration: prevState.timer.breakDuration,
            isPaused: !prevState.timer.autoStartTimers,
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
              isPaused: !prevState.timer.autoStartTimers,
            }
          }));
          toast('Break completed', {
            description: `Starting round ${completedRounds + 1} of ${state.timer.totalRounds}`,
          });
        } else {
          if (state.isPlaying && state.timer.timerType === 'Simple Timer') {
            pauseSound();
          }
          setState(prevState => ({
            ...prevState,
            timer: {
              ...prevState.timer,
              isActive: false,
            }
          }));
          toast('Timer completed', {
            description: `Completed all ${state.timer.totalRounds} rounds`,
          });
        }
      }
    }
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [state.timer.isActive, state.timer.remaining, state.timer.isPaused, state.timer.mode]);

  // Helper function for browser notifications
  const sendBrowserNotification = (message: string) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Timer Alert', { body: message });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Timer Alert', { body: message });
          }
        });
      }
    }
  };

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

  const setTimer = (duration: number, task?: string, breakDuration: number = 0, rounds: number = 1) => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    const updatedTimer = {
      isActive: true,
      duration,
      remaining: duration,
      breakDuration,
      totalRounds: rounds,
      currentRound: 0,
      completedRounds: 0,
      mode: 'focus' as const,
      isPaused: false,
      task: task || "",
    };
    
    setState(prevState => ({
      ...prevState,
      timer: {
        ...prevState.timer,
        ...updatedTimer
      }
    }));
    
    // Save timer settings to cookie
    setJsonCookie('timerSettings', {
      ...state.timer,
      ...updatedTimer
    });
    
    const roundsLabel = rounds > 1 ? `${rounds} rounds` : '1 round';
    toast(`Timer set for ${Math.floor(duration / 60)} min focus, ${Math.floor(breakDuration / 60)} min break, ${roundsLabel}`);
  };

  const cancelTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setState(prevState => ({
      ...prevState,
      timer: {
        ...prevState.timer,
        isActive: false,
        remaining: 0,
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

  // New timer feature toggle functions
  const toggleTimerType = () => {
    const newTimerType = state.timer.timerType === 'Pomodoro' ? 'Simple Timer' : 'Pomodoro';
    
    setState(prevState => ({
      ...prevState,
      timer: {
        ...prevState.timer,
        timerType: newTimerType,
      },
    }));
    
    // Save to cookie
    setJsonCookie('timerSettings', {
      ...state.timer,
      timerType: newTimerType,
    });
    
    toast(`Switched to ${newTimerType}`);
  };

  const toggleHideSeconds = () => {
    setState(prevState => {
      const newHideSeconds = !prevState.timer.hideSeconds;
      
      // Save to cookie
      setJsonCookie('timerSettings', {
        ...prevState.timer,
        hideSeconds: newHideSeconds,
      });
      
      return {
        ...prevState,
        timer: {
          ...prevState.timer,
          hideSeconds: newHideSeconds,
        },
      };
    });
  };

  const toggleAutoStartTimers = () => {
    setState(prevState => {
      const newAutoStartTimers = !prevState.timer.autoStartTimers;
      
      // Save to cookie
      setJsonCookie('timerSettings', {
        ...prevState.timer,
        autoStartTimers: newAutoStartTimers,
      });
      
      return {
        ...prevState,
        timer: {
          ...prevState.timer,
          autoStartTimers: newAutoStartTimers,
        },
      };
    });
  };

  const toggleTimerSoundEffects = () => {
    setState(prevState => {
      const newTimerSoundEffects = !prevState.timer.timerSoundEffects;
      
      // Save to cookie
      setJsonCookie('timerSettings', {
        ...prevState.timer,
        timerSoundEffects: newTimerSoundEffects,
      });
      
      return {
        ...prevState,
        timer: {
          ...prevState.timer,
          timerSoundEffects: newTimerSoundEffects,
        },
      };
    });
  };

  const toggleBrowserNotifications = () => {
    // Request notification permission if needed
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    
    setState(prevState => {
      const newBrowserNotifications = !prevState.timer.browserNotifications;
      
      // Save to cookie
      setJsonCookie('timerSettings', {
        ...prevState.timer,
        browserNotifications: newBrowserNotifications,
      });
      
      return {
        ...prevState,
        timer: {
          ...prevState.timer,
          browserNotifications: newBrowserNotifications,
        },
      };
    });
  };

  const setTimerAlertSound = (sound: 'beep' | 'bell') => {
    if (timerAlertAudio) {
      timerAlertAudio.src = timerSounds[sound];
    }
    
    setState(prevState => {
      const updatedTimer = {
        ...prevState.timer,
        alertSound: sound,
      };
      
      // Save to cookie
      setJsonCookie('timerSettings', updatedTimer);
      
      return {
        ...prevState,
        timer: updatedTimer,
      };
    });
    
    // Play a preview
    if (timerAlertAudio) {
      timerAlertAudio.currentTime = 0;
      timerAlertAudio.play().catch(console.error);
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
        toggleUseBackgroundFromSound,
        setTimer,
        cancelTimer,
        resetTimer,
        pauseResumeTimer,
        setVolume,
        toggleMixMode,
        updateSoundVolume,
        showMixPanel,
        setShowMixPanel,
        toggleTimerType,
        toggleHideSeconds,
        toggleAutoStartTimers,
        toggleTimerSoundEffects,
        toggleBrowserNotifications,
        setTimerAlertSound,
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
