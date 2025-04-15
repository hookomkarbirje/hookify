import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerState, Sound, BackgroundImage, TimerConfig, SavedMix } from '@/types';
import { sounds, backgroundImages } from '@/data/soundData';
import { toast } from 'sonner';
import { setCookie, getCookie } from '@/lib/cookieUtils';
import { playTimerSound, showTimerNotification, requestNotificationPermission } from '@/lib/soundService';
import { generateShareableUrl, parseMixFromUrl } from '@/lib/mixUtils';

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
  saveMix: (name?: string) => string;
  loadMix: (mixId: string) => void;
  deleteMix: (mixId: string) => void;
  getSavedMixes: () => SavedMix[];
  shareMix: (mixId: string) => string;
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
  savedMixes: [],
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>(initialState);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [showMixPanel, setShowMixPanel] = useState(false);
  const [mixNameInput, setMixNameInput] = useState("");

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
    
    const savedMixesJson = localStorage.getItem('savedMixes');
    if (savedMixesJson) {
      try {
        const savedMixes = JSON.parse(savedMixesJson) as SavedMix[];
        setState(prev => ({ ...prev, savedMixes }));
      } catch (e) {
        console.error('Error parsing saved mixes:', e);
      }
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const mixParam = urlParams.get('mix');
    if (mixParam) {
      try {
        const mixData = parseMixFromUrl(mixParam);
        if (mixData && mixData.sounds.length > 0) {
          loadMixFromData(mixData);
          
          if (mixData.autoPlay) {
            setTimeout(() => {
              mixData.sounds.forEach(soundInfo => {
                const audio = elementsMap.get(soundInfo.id);
                if (audio) {
                  audio.volume = soundInfo.volume;
                  audio.play().catch(console.error);
                }
              });
              
              setState(prev => ({
                ...prev,
                isPlaying: true
              }));
            }, 1000);
          }
          
          toast.success("Mix loaded from shared link!");
        }
      } catch (e) {
        console.error('Error loading mix from URL:', e);
        toast.error('Could not load the shared mix');
      }
    }

    return () => {
      elementsMap.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      
      if (timerInterval) {
        clearInterval(timerInterval);
      }
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
    
    // Start the timer countdown interval
    const interval = window.setInterval(() => {
      setState(prevState => {
        if (prevState.timer.isPaused) {
          return prevState;
        }

        const remaining = prevState.timer.remaining - 1;
        
        if (remaining <= 0) {
          // Timer finished
          if (prevState.timer.playSound) {
            playTimerSound(prevState.timer.soundType || 'beep');
          }
          
          if (prevState.timer.showNotifications) {
            const mode = prevState.timer.mode === 'focus' ? 'Focus' : 'Break';
            showTimerNotification(`${mode} time is up!`, `Your ${mode.toLowerCase()} time has ended.`);
          }
          
          // Handle rounds and breaks
          if (prevState.timer.mode === 'focus' && prevState.timer.breakDuration > 0) {
            // Switch to break mode
            return {
              ...prevState,
              timer: {
                ...prevState.timer,
                mode: 'break',
                remaining: prevState.timer.breakDuration,
              }
            };
          } else if (prevState.timer.mode === 'break') {
            // Completed a full round
            const completedRounds = prevState.timer.completedRounds + 1;
            const currentRound = prevState.timer.currentRound + 1;
            
            // Check if all rounds are completed
            if (currentRound >= prevState.timer.totalRounds) {
              // All rounds completed
              clearInterval(interval);
              return {
                ...prevState,
                timer: {
                  ...prevState.timer,
                  isActive: false,
                  remaining: 0,
                  completedRounds,
                }
              };
            } else {
              // Start next round
              return {
                ...prevState,
                timer: {
                  ...prevState.timer,
                  mode: 'focus',
                  remaining: prevState.timer.duration,
                  currentRound,
                  completedRounds,
                }
              };
            }
          } else {
            // Simple timer with no breaks, just end it
            clearInterval(interval);
            return {
              ...prevState,
              timer: {
                ...prevState.timer,
                isActive: false,
                remaining: 0,
              }
            };
          }
        } else {
          // Just update the remaining time
          return {
            ...prevState,
            timer: {
              ...prevState.timer,
              remaining,
            }
          };
        }
      });
    }, 1000);
    
    setTimerInterval(interval);
    
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

  const saveMix = (name?: string) => {
    if (state.activeSounds.length === 0) {
      toast.error("No sounds to save");
      return "";
    }
    
    const mixName = name || `Mix ${state.savedMixes.length + 1}`;
    const timestamp = new Date().toISOString();
    const id = `mix_${Date.now().toString(36)}`;
    
    const mixData: SavedMix = {
      id,
      name: mixName,
      sounds: state.activeSounds.map(sound => ({
        id: sound.id,
        volume: sound.volume || state.volume
      })),
      createdAt: timestamp,
      backgroundId: state.currentBackground.id
    };
    
    const updatedMixes = [...state.savedMixes, mixData];
    
    setState(prev => ({
      ...prev,
      savedMixes: updatedMixes
    }));
    
    localStorage.setItem('savedMixes', JSON.stringify(updatedMixes));
    
    toast.success(`Mix "${mixName}" saved`);
    return id;
  };
  
  const loadMix = (mixId: string) => {
    const mix = state.savedMixes.find(m => m.id === mixId);
    if (!mix) {
      toast.error("Mix not found");
      return;
    }
    
    loadMixFromData(mix);
  };
  
  const loadMixFromData = (mix: SavedMix) => {
    audioElements.forEach(audio => audio.pause());
    
    if (!state.isMixMode) {
      setState(prev => ({ ...prev, isMixMode: true }));
    }
    
    const activeSoundObjects = mix.sounds.map(soundInfo => {
      const sound = sounds.find(s => s.id === soundInfo.id);
      return sound ? { ...sound, volume: soundInfo.volume } : null;
    }).filter(Boolean) as Sound[];
    
    if (mix.backgroundId) {
      const background = backgroundImages.find(bg => bg.id === mix.backgroundId);
      if (background) {
        setState(prev => ({
          ...prev,
          currentBackground: background,
        }));
      }
    }
    
    setState(prev => ({
      ...prev,
      activeSounds: activeSoundObjects,
      isPlaying: false
    }));
    
    toast.success(`Loaded mix "${mix.name}"`);
  };
  
  const deleteMix = (mixId: string) => {
    const updatedMixes = state.savedMixes.filter(mix => mix.id !== mixId);
    
    setState(prev => ({
      ...prev,
      savedMixes: updatedMixes
    }));
    
    localStorage.setItem('savedMixes', JSON.stringify(updatedMixes));
    toast.success("Mix deleted");
  };
  
  const getSavedMixes = () => {
    return state.savedMixes;
  };
  
  const shareMix = (mixId: string) => {
    const mix = state.savedMixes.find(m => m.id === mixId);
    if (!mix) {
      toast.error("Mix not found");
      return "";
    }
    
    const shareUrl = generateShareableUrl(mix);
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Share link copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
    
    return shareUrl;
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
        saveMix,
        loadMix,
        deleteMix,
        getSavedMixes,
        shareMix,
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
