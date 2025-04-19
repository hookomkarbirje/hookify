
/**
 * Player functionality module for sound playback and management
 */

// Player state object
const playerState = {
  // Audio elements
  audioElements: new Map(),
  
  // Core state
  isPlaying: false,
  isHidden: false,
  currentSound: null,
  activeSounds: [],
  isMixMode: false,
  
  // Background and UI
  currentBackground: backgroundImages[0],
  useBackgroundFromSound: true,
  volume: 0.8,
  
  // Timer configuration (will be managed by timer.js)
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
  
  // Saved mixes
  savedMixes: [],
  
  // Initialize player
  init() {
    this.loadSavedMixes();
    this.setupAudioElements();
    this.loadPersistedState();
  },
  
  // Create audio elements for all sounds
  setupAudioElements() {
    sounds.forEach(sound => {
      const audioElement = new Audio(sound.audio);
      audioElement.loop = true;
      audioElement.volume = this.volume;
      this.audioElements.set(sound.id, audioElement);
    });
  },
  
  // Load saved mixes from localStorage
  loadSavedMixes() {
    const savedMixesJson = localStorage.getItem('savedMixes');
    if (savedMixesJson) {
      try {
        this.savedMixes = JSON.parse(savedMixesJson);
      } catch (e) {
        console.error('Error parsing saved mixes:', e);
        this.savedMixes = [];
      }
    }
  },
  
  // Load persisted state from cookies
  loadPersistedState() {
    const savedSoundId = cookies.get('currentSoundId');
    const savedVolume = cookies.get('soundVolume');
    const savedIsPlaying = cookies.get('isPlaying');
    const savedIsMixMode = cookies.get('isMixMode');
    const savedActiveSounds = cookies.get('activeSounds');
    
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }
    
    if (savedIsMixMode === true) {
      this.isMixMode = true;
      
      if (savedActiveSounds) {
        try {
          const activeSoundIds = savedActiveSounds;
          const activeSoundObjects = sounds.filter(sound => 
            activeSoundIds.includes(sound.id)
          ).map(sound => ({
            ...sound,
            volume: savedVolume ? parseFloat(savedVolume) : this.volume
          }));
          
          this.activeSounds = activeSoundObjects;
          this.isPlaying = savedIsPlaying === true;
          
          if (this.isPlaying) {
            setTimeout(() => {
              this.activeSounds.forEach(sound => {
                const audio = this.audioElements.get(sound.id);
                if (audio) {
                  audio.volume = sound.volume || this.volume;
                  audio.play().catch(console.error);
                }
              });
            }, 500);
          }
        } catch (e) {
          console.error('Error loading saved active sounds:', e);
        }
      }
    } else if (savedSoundId) {
      const sound = sounds.find(s => s.id === savedSoundId);
      if (sound) {
        this.currentSound = sound;
        this.activeSounds = [{ ...sound, volume: savedVolume ? parseFloat(savedVolume) : this.volume }];
        this.isPlaying = savedIsPlaying === true;
        
        if (this.isPlaying) {
          setTimeout(() => {
            const audio = this.audioElements.get(sound.id);
            if (audio) {
              audio.volume = this.volume;
              audio.play().catch(error => {
                console.error('Error playing audio:', error);
              });
            }
          }, 500);
        }
      }
    }
    
    // Load background preferences
    const savedBackgroundId = cookies.get('backgroundId');
    const savedUseBackgroundFromSound = cookies.get('useBackgroundFromSound');
    
    if (savedBackgroundId) {
      const background = backgroundImages.find(bg => bg.id === savedBackgroundId);
      if (background) {
        this.currentBackground = background;
      }
    }
    
    if (savedUseBackgroundFromSound !== null) {
      this.useBackgroundFromSound = savedUseBackgroundFromSound;
    }
  },
  
  // Save current state to cookies
  persistState() {
    cookies.set('soundVolume', this.volume);
    cookies.set('isPlaying', this.isPlaying);
    cookies.set('isMixMode', this.isMixMode);
    
    if (this.currentSound) {
      cookies.set('currentSoundId', this.currentSound.id);
    } else {
      cookies.delete('currentSoundId');
    }
    
    if (this.activeSounds.length > 0) {
      cookies.set('activeSounds', this.activeSounds.map(s => s.id));
    } else {
      cookies.delete('activeSounds');
    }
    
    cookies.set('backgroundId', this.currentBackground.id);
    cookies.set('useBackgroundFromSound', this.useBackgroundFromSound);
  },
  
  // Play a sound
  playSound(sound) {
    const audioElement = this.audioElements.get(sound.id);
    if (!audioElement) return;
    
    if (this.isMixMode) {
      const isAlreadyActive = this.activeSounds.some(s => s.id === sound.id);
      
      if (isAlreadyActive) {
        audioElement.pause();
        this.activeSounds = this.activeSounds.filter(s => s.id !== sound.id);
        toast.info(`Removed: ${sound.name}`);
      } else {
        const soundWithVolume = { ...sound, volume: this.volume };
        audioElement.volume = this.volume;
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
          toast.error('Failed to play audio');
        });
        
        this.isPlaying = true;
        this.activeSounds = [...this.activeSounds, soundWithVolume];
        toast.success(`Added: ${sound.name}`);
      }
    } else {
      // Stop all current sounds
      this.audioElements.forEach(audio => audio.pause());
      
      const isCurrentlyPlaying = this.isPlaying && this.currentSound?.id === sound.id;
      
      if (isCurrentlyPlaying) {
        this.isPlaying = false;
        this.currentSound = null;
        this.activeSounds = [];
        toast.info(`Stopped: ${sound.name}`);
      } else {
        audioElement.volume = this.volume;
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
          toast.error('Failed to play audio');
        });
        
        this.isPlaying = true;
        this.currentSound = sound;
        this.activeSounds = [{ ...sound, volume: this.volume }];
        toast.success(`Now playing: ${sound.name}`);
        
        // Update background if using sound's background
        if (this.useBackgroundFromSound && sound.backgroundUrl) {
          this.updateBackgroundImage(sound.backgroundUrl);
        }
      }
    }
    
    this.persistState();
    
    // Update UI
    updatePlayerUI();
  },
  
  // Pause all sounds
  pauseSound() {
    this.audioElements.forEach(audio => audio.pause());
    this.isPlaying = false;
    this.persistState();
    
    // Update UI
    updatePlayerUI();
  },
  
  // Toggle play/pause
  togglePlayPause() {
    if (this.isPlaying) {
      this.pauseSound();
    } else {
      if (this.activeSounds.length > 0) {
        this.activeSounds.forEach(sound => {
          const audio = this.audioElements.get(sound.id);
          if (audio) {
            audio.volume = sound.volume || this.volume;
            audio.play().catch(console.error);
          }
        });
        
        this.isPlaying = true;
        this.persistState();
        
        // Update UI
        updatePlayerUI();
      } else if (sounds.length > 0) {
        this.playSound(sounds[0]);
      }
    }
  },
  
  // Toggle mix mode
  toggleMixMode() {
    if (this.isMixMode) {
      // Switch to single mode
      const newActiveSounds = this.activeSounds.length > 0 ? [this.activeSounds[0]] : [];
      
      this.isMixMode = false;
      this.activeSounds = newActiveSounds;
      this.currentSound = newActiveSounds.length > 0 ? newActiveSounds[0] : null;
      
      // Stop all sounds
      this.audioElements.forEach(audio => audio.pause());
      
      // Play current sound if playing
      if (this.isPlaying && this.currentSound) {
        const audio = this.audioElements.get(this.currentSound.id);
        if (audio) {
          audio.play().catch(console.error);
          
          // Update background if using sound's background
          if (this.useBackgroundFromSound && this.currentSound.backgroundUrl) {
            this.updateBackgroundImage(this.currentSound.backgroundUrl);
          }
        }
      }
      
      toast.info('Single mode activated');
    } else {
      // Switch to mix mode
      this.isMixMode = true;
      this.activeSounds = this.currentSound ? [{ ...this.currentSound, volume: this.volume }] : [];
      this.currentSound = null;
      this.useBackgroundFromSound = false;
      
      toast.info('Mix mode activated');
    }
    
    this.persistState();
    
    // Update UI
    updatePlayerUI();
  },
  
  // Update sound volume in mix mode
  updateSoundVolume(soundId, volume) {
    const audio = this.audioElements.get(soundId);
    if (audio) {
      audio.volume = volume;
    }
    
    this.activeSounds = this.activeSounds.map(sound => 
      sound.id === soundId ? { ...sound, volume } : sound
    );
    
    this.persistState();
  },
  
  // Set master volume
  setVolume(volume) {
    this.volume = volume;
    
    if (!this.isMixMode) {
      this.audioElements.forEach(audio => {
        audio.volume = volume;
      });
    }
    
    this.persistState();
  },
  
  // Toggle showing/hiding interface
  toggleHideInterface() {
    this.isHidden = !this.isHidden;
    updatePlayerUI();
  },
  
  // Set background image
  setBackground(background) {
    this.currentBackground = background;
    this.useBackgroundFromSound = false;
    this.updateBackgroundImage(background.url);
    this.persistState();
    toast.success(`Background changed to ${background.name}`);
  },
  
  // Toggle using sound's background image
  toggleUseBackgroundFromSound() {
    this.useBackgroundFromSound = !this.useBackgroundFromSound;
    
    if (this.useBackgroundFromSound && this.currentSound?.backgroundUrl) {
      this.updateBackgroundImage(this.currentSound.backgroundUrl);
    } else {
      this.updateBackgroundImage(this.currentBackground.url);
    }
    
    this.persistState();
    
    toast.info(this.useBackgroundFromSound 
      ? 'Using sound\'s background image' 
      : 'Using custom background');
  },
  
  // Update the background image element
  updateBackgroundImage(url) {
    const bgImage = document.getElementById('background-image');
    if (bgImage) {
      bgImage.src = url;
    }
  },
  
  // Save current mix
  saveMix(name) {
    if (this.activeSounds.length === 0) {
      toast.error("No sounds to save");
      return "";
    }
    
    const mixName = name || `Mix ${this.savedMixes.length + 1}`;
    const timestamp = new Date().toISOString();
    const id = `mix_${Date.now().toString(36)}`;
    
    const mixData = {
      id,
      name: mixName,
      sounds: this.activeSounds.map(sound => ({
        id: sound.id,
        volume: sound.volume || this.volume
      })),
      createdAt: timestamp,
      backgroundId: this.currentBackground.id
    };
    
    this.savedMixes = [...this.savedMixes, mixData];
    
    // Save to localStorage
    localStorage.setItem('savedMixes', JSON.stringify(this.savedMixes));
    
    toast.success(`Mix "${mixName}" saved`);
    return id;
  },
  
  // Load a saved mix
  loadMix(mixId) {
    const mix = this.savedMixes.find(m => m.id === mixId);
    if (!mix) {
      toast.error("Mix not found");
      return;
    }
    
    // Pause all current sounds
    this.audioElements.forEach(audio => audio.pause());
    
    if (!this.isMixMode) {
      this.isMixMode = true;
    }
    
    // Load sounds from the mix
    const activeSoundObjects = mix.sounds.map(soundInfo => {
      const sound = sounds.find(s => s.id === soundInfo.id);
      return sound ? { ...sound, volume: soundInfo.volume } : null;
    }).filter(Boolean);
    
    // Load background
    if (mix.backgroundId) {
      const background = backgroundImages.find(bg => bg.id === mix.backgroundId);
      if (background) {
        this.currentBackground = background;
        this.updateBackgroundImage(background.url);
      }
    }
    
    this.activeSounds = activeSoundObjects;
    this.isPlaying = false;
    this.currentSound = null;
    
    this.persistState();
    updatePlayerUI();
    
    toast.success(`Loaded mix "${mix.name}"`);
  },
  
  // Delete a saved mix
  deleteMix(mixId) {
    this.savedMixes = this.savedMixes.filter(mix => mix.id !== mixId);
    localStorage.setItem('savedMixes', JSON.stringify(this.savedMixes));
    toast.success("Mix deleted");
  },
  
  // Share a mix
  shareMix(mixId) {
    const mix = this.savedMixes.find(m => m.id === mixId);
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
  }
};

// Function to be implemented in ui.js to update the player interface
function updatePlayerUI() {
  // This will be implemented in ui.js
  // It's declared here to avoid errors
}
