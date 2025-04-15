
// Webflow CMS Data Structure expected:
// Sounds Collection:
// - name (text)
// - category (text or option)
// - icon (text - should match icon names in our script)
// - audioUrl (file/audio)
// - imageUrl (optional - image)
// - backgroundUrl (optional - image)
// - attribution (optional - text)
// 
// Background Collection:
// - name (text)
// - url (image)
// - thumbnailUrl (image)
// - attribution (optional - text)

// Global state
const state = {
  sounds: [], // Will be populated from Webflow CMS
  backgrounds: [], // Will be populated from Webflow CMS
  categories: [], // Unique categories from sounds
  currentSound: null,
  activeSounds: [],
  currentBackground: null,
  isPlaying: false,
  isMixMode: false,
  isHidden: false,
  volume: 0.7,
  useBackgroundFromSound: true,
  audioElements: {}, // Audio elements cache
  timer: {
    isActive: false,
    isPaused: false,
    duration: 25 * 60, // 25 minutes in seconds
    breakDuration: 5 * 60, // 5 minutes in seconds
    remaining: 0,
    task: '',
    mode: 'focus', // 'focus' or 'break'
    hideSeconds: false,
    totalRounds: 1,
    currentRound: 0,
    completedRounds: 0
  },
  savedMixes: [] // User saved mixes
};

// DOM Elements
const elements = {
  playerContainer: document.getElementById('player-container'),
  backgroundImage: document.getElementById('background-image'),
  soundInfo: document.getElementById('sound-info'),
  soundText: document.getElementById('sound-text'),
  soundScrollarea: document.getElementById('sound-scrollarea'),
  soundIcons: document.getElementById('sound-icons'),
  playButton: document.getElementById('play-button'),
  hideButton: document.getElementById('hide-button'),
  showUiButton: document.getElementById('show-ui-button'),
  timerButton: document.getElementById('timer-button'),
  backgroundButton: document.getElementById('background-button'),
  settingsButton: document.getElementById('settings-button'),
  playMode: document.getElementById('play-mode'),
  mixMode: document.getElementById('mix-mode'),
  currentSoundName: document.getElementById('current-sound-name'),
  exploreButton: document.getElementById('explore-button'),
  mixLibraryButton: document.getElementById('mix-library-button'),
  mixPanel: document.getElementById('mix-panel'),
  mixSounds: document.getElementById('mix-sounds'),
  // Modals
  timerModal: document.getElementById('timer-modal'),
  timerSettingsModal: document.getElementById('timer-settings-modal'),
  backgroundGalleryModal: document.getElementById('background-gallery-modal'),
  exploreModal: document.getElementById('explore-modal'),
  // Drawers
  mixDrawer: document.getElementById('mix-drawer'),
  savedMixesDrawer: document.getElementById('saved-mixes-drawer'),
  // Timer display
  timerDisplay: document.getElementById('timer-display'),
  timerTime: document.getElementById('timer-time'),
  timerProgress: document.getElementById('timer-progress'),
  timerPlayPause: document.getElementById('timer-play-pause'),
  timerMenu: document.getElementById('timer-menu'),
  timerRounds: document.getElementById('timer-rounds'),
  timerRoundInfo: document.getElementById('timer-round-info'),
  timerTask: document.getElementById('timer-task'),
  timerModeTabs: document.getElementById('timer-mode-tabs'),
  focusTab: document.getElementById('focus-tab'),
  breakTab: document.getElementById('break-tab'),
  toast: document.getElementById('toast')
};

// Timer elements in modal
const timerModalElements = {
  pomodoroTab: document.getElementById('pomodoro-tab'),
  simpleTab: document.getElementById('simple-tab'),
  taskInput: document.getElementById('timer-task-input'),
  decreaseRounds: document.getElementById('decrease-rounds'),
  increaseRounds: document.getElementById('increase-rounds'),
  roundsValue: document.getElementById('rounds-value'),
  roundsContainer: document.getElementById('rounds-container'),
  cancelButton: document.getElementById('timer-cancel'),
  startButton: document.getElementById('timer-start')
};

// Timer settings elements
const timerSettingsElements = {
  pomodoroSettingsTab: document.getElementById('pomodoro-settings-tab'),
  simpleSettingsTab: document.getElementById('simple-settings-tab'),
  focusTimeSlider: document.getElementById('focus-time-slider'),
  breakTimeSlider: document.getElementById('break-time-slider'),
  focusTimeDisplay: document.getElementById('focus-time-display'),
  breakTimeDisplay: document.getElementById('break-time-display'),
  customFocusInput: document.getElementById('custom-focus-input'),
  customBreakInput: document.getElementById('custom-break-input'),
  customBreakContainer: document.getElementById('custom-break-container'),
  breakSliderContainer: document.getElementById('break-slider-container'),
  doneButton: document.getElementById('settings-done')
};

// Background gallery elements
const backgroundElements = {
  useSoundBgContainer: document.getElementById('use-sound-bg-container'),
  useSoundBgToggle: document.getElementById('use-sound-bg-toggle'),
  backgroundGrid: document.getElementById('background-grid')
};

// Explore modal elements
const exploreElements = {
  categoryTabs: document.getElementById('category-tabs'),
  soundList: document.getElementById('sound-list')
};

// Mix drawer elements
const mixElements = {
  mixTilesContainer: document.getElementById('mix-tiles-container'),
  closeMixDrawer: document.getElementById('close-mix-drawer'),
  saveMix: document.getElementById('save-mix'),
  showSavedMixes: document.getElementById('show-saved-mixes')
};

// Saved mixes elements
const savedMixesElements = {
  savedMixesContainer: document.getElementById('saved-mixes-container'),
  closeSavedMixesDrawer: document.getElementById('close-saved-mixes-drawer')
};

// Sample data (replace with Webflow CMS data in production)
// This is just for demonstration and testing
const sampleSounds = [
  { 
    id: '1', 
    name: 'Rain', 
    category: 'Nature', 
    icon: 'cloud-rain', 
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3',
    imageUrl: 'https://source.unsplash.com/random/300x300/?rain',
    backgroundUrl: 'https://source.unsplash.com/random/1920x1080/?rain'
  },
  { 
    id: '2', 
    name: 'Forest', 
    category: 'Nature', 
    icon: 'trees', 
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3',
    imageUrl: 'https://source.unsplash.com/random/300x300/?forest',
    backgroundUrl: 'https://source.unsplash.com/random/1920x1080/?forest'
  },
  { 
    id: '3', 
    name: 'Waves', 
    category: 'Nature', 
    icon: 'waves', 
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3',
    imageUrl: 'https://source.unsplash.com/random/300x300/?waves',
    backgroundUrl: 'https://source.unsplash.com/random/1920x1080/?waves'
  },
  { 
    id: '4', 
    name: 'White Noise', 
    category: 'Ambience', 
    icon: 'wind', 
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-city-ambience-loop-1220.mp3',
    imageUrl: 'https://source.unsplash.com/random/300x300/?white,noise',
    backgroundUrl: 'https://source.unsplash.com/random/1920x1080/?white,noise'
  },
  { 
    id: '5', 
    name: 'Fireplace', 
    category: 'Ambience', 
    icon: 'flame', 
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3',
    imageUrl: 'https://source.unsplash.com/random/300x300/?fireplace',
    backgroundUrl: 'https://source.unsplash.com/random/1920x1080/?fireplace'
  },
  { 
    id: '6', 
    name: 'Coffee Shop', 
    category: 'Ambience', 
    icon: 'coffee', 
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-restaurant-crowd-talking-ambience-444.mp3',
    imageUrl: 'https://source.unsplash.com/random/300x300/?coffee,shop',
    backgroundUrl: 'https://source.unsplash.com/random/1920x1080/?coffee,shop'
  },
  { 
    id: '7', 
    name: 'Meditation', 
    category: 'Music', 
    icon: 'brain', 
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-meditation-zen-bells-426.mp3',
    imageUrl: 'https://source.unsplash.com/random/300x300/?meditation',
    backgroundUrl: 'https://source.unsplash.com/random/1920x1080/?meditation'
  },
  { 
    id: '8', 
    name: 'Piano', 
    category: 'Music', 
    icon: 'music', 
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-emotional-piano-369.mp3',
    imageUrl: 'https://source.unsplash.com/random/300x300/?piano',
    backgroundUrl: 'https://source.unsplash.com/random/1920x1080/?piano'
  }
];

const sampleBackgrounds = [
  { 
    id: '1', 
    name: 'Mountains', 
    url: 'https://source.unsplash.com/random/1920x1080/?mountains', 
    thumbnailUrl: 'https://source.unsplash.com/random/300x200/?mountains'
  },
  { 
    id: '2', 
    name: 'Beach', 
    url: 'https://source.unsplash.com/random/1920x1080/?beach', 
    thumbnailUrl: 'https://source.unsplash.com/random/300x200/?beach'
  },
  { 
    id: '3', 
    name: 'Northern Lights', 
    url: 'https://source.unsplash.com/random/1920x1080/?northern,lights', 
    thumbnailUrl: 'https://source.unsplash.com/random/300x200/?northern,lights'
  },
  { 
    id: '4', 
    name: 'Starry Night', 
    url: 'https://source.unsplash.com/random/1920x1080/?stars,night', 
    thumbnailUrl: 'https://source.unsplash.com/random/300x200/?stars,night'
  }
];

// Initialize the application
function init() {
  // Load sounds and backgrounds from Webflow CMS
  loadSoundsFromCMS();
  loadBackgroundsFromCMS();
  
  // If no data from CMS, use sample data
  if (!state.sounds.length) {
    state.sounds = sampleSounds;
    console.log('Using sample sounds data');
  }
  
  if (!state.backgrounds.length) {
    state.backgrounds = sampleBackgrounds;
    console.log('Using sample backgrounds data');
  }
  
  // Extract unique categories
  state.categories = [...new Set(state.sounds.map(sound => sound.category))];
  
  // Set initial background
  if (state.backgrounds.length) {
    state.currentBackground = state.backgrounds[0];
    updateBackgroundDisplay();
  }
  
  // Set up event listeners
  setupEventListeners();
  
  // Render initial UI
  renderSoundIcons();
  
  // Load saved mixes from localStorage
  loadSavedMixes();
}

// Functions to fetch data from Webflow CMS
function loadSoundsFromCMS() {
  try {
    // Check if we're in Webflow environment and have CMS data available
    if (typeof Webflow !== 'undefined' && Webflow.site.browser) {
      // This is where you would integrate with Webflow CMS
      // Webflow collections are typically available through window variables
      // Example: window.soundsCollection might contain your sounds data
      
      // Your Webflow CMS binding code would go here
      // For safety, we'll check if a specific element exists that would have your CMS data
      const soundsData = window.soundsCollection || [];
      
      if (soundsData && soundsData.length) {
        state.sounds = soundsData.map(item => ({
          id: item._id || item.id || generateId(),
          name: item.name || 'Unnamed Sound',
          category: item.category || 'Uncategorized',
          icon: item.icon || 'music', // Default icon
          audioUrl: item.audioUrl || '',
          imageUrl: item.imageUrl || '',
          backgroundUrl: item.backgroundUrl || '',
          attribution: item.attribution || ''
        }));
      }
    }
  } catch (e) {
    console.error('Error loading sounds from CMS:', e);
  }
}

function loadBackgroundsFromCMS() {
  try {
    // Similar approach for backgrounds collection
    if (typeof Webflow !== 'undefined' && Webflow.site.browser) {
      // Your Webflow CMS binding code would go here
      const backgroundsData = window.backgroundsCollection || [];
      
      if (backgroundsData && backgroundsData.length) {
        state.backgrounds = backgroundsData.map(item => ({
          id: item._id || item.id || generateId(),
          name: item.name || 'Unnamed Background',
          url: item.url || '',
          thumbnailUrl: item.thumbnailUrl || item.url || '',
          attribution: item.attribution || ''
        }));
      }
    }
  } catch (e) {
    console.error('Error loading backgrounds from CMS:', e);
  }
}

// Generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Set up all event listeners
function setupEventListeners() {
  // Play/Pause button
  elements.playButton.addEventListener('click', togglePlayPause);
  
  // Hide/Show interface
  elements.hideButton.addEventListener('click', hideInterface);
  elements.showUiButton.addEventListener('click', showInterface);
  
  // Timer button
  elements.timerButton.addEventListener('click', () => openModal(elements.timerModal));
  
  // Background button
  elements.backgroundButton.addEventListener('click', () => openModal(elements.backgroundGalleryModal));
  
  // Mode switchers
  elements.playMode.addEventListener('click', () => setMode('play'));
  elements.mixMode.addEventListener('click', () => setMode('mix'));
  
  // Explore sounds
  elements.exploreButton.addEventListener('click', () => {
    renderExploreModal();
    openModal(elements.exploreModal);
  });
  
  // Mix library
  elements.mixLibraryButton.addEventListener('click', () => {
    if (state.isMixMode) {
      openDrawer(elements.mixDrawer);
      renderMixModeDrawer();
    }
  });
  
  // Mix drawer close
  mixElements.closeMixDrawer.addEventListener('click', () => closeDrawer(elements.mixDrawer));
  
  // Save mix
  mixElements.saveMix.addEventListener('click', saveMix);
  
  // Show saved mixes
  mixElements.showSavedMixes.addEventListener('click', () => {
    renderSavedMixes();
    openDrawer(elements.savedMixesDrawer);
  });
  
  // Close saved mixes drawer
  savedMixesElements.closeSavedMixesDrawer.addEventListener('click', () => closeDrawer(elements.savedMixesDrawer));

  // Timer modal
  timerModalElements.pomodoroTab.addEventListener('click', () => setTimerModalTab('pomodoro'));
  timerModalElements.simpleTab.addEventListener('click', () => setTimerModalTab('simple'));
  timerModalElements.decreaseRounds.addEventListener('click', decreaseRounds);
  timerModalElements.increaseRounds.addEventListener('click', increaseRounds);
  timerModalElements.cancelButton.addEventListener('click', () => closeModal(elements.timerModal));
  timerModalElements.startButton.addEventListener('click', startTimer);
  
  // Timer settings
  timerSettingsElements.pomodoroSettingsTab.addEventListener('click', () => setTimerSettingsTab('pomodoro'));
  timerSettingsElements.simpleSettingsTab.addEventListener('click', () => setTimerSettingsTab('simple'));
  timerSettingsElements.focusTimeSlider.addEventListener('input', updateFocusTimeFromSlider);
  timerSettingsElements.breakTimeSlider.addEventListener('input', updateBreakTimeFromSlider);
  timerSettingsElements.customFocusInput.addEventListener('input', updateFocusTimeFromInput);
  timerSettingsElements.customBreakInput.addEventListener('input', updateBreakTimeFromInput);
  timerSettingsElements.doneButton.addEventListener('click', () => closeModal(elements.timerSettingsModal));
  
  // Background gallery
  backgroundElements.useSoundBgToggle.addEventListener('change', toggleUseBackgroundFromSound);
  
  // Timer display
  elements.timerPlayPause.addEventListener('click', pauseResumeTimer);
  elements.timerMenu.addEventListener('click', showTimerMenu);
  elements.focusTab.addEventListener('click', () => switchTimerMode('focus'));
  elements.breakTab.addEventListener('click', () => switchTimerMode('break'));
  
  // Close modals when clicking outside
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeAllModals();
    }
    if (e.target.classList.contains('drawer')) {
      closeAllDrawers();
    }
  });
}

// Render sound icons in the bottom scrollbar
function renderSoundIcons() {
  elements.soundIcons.innerHTML = '';
  
  state.sounds.forEach(sound => {
    const soundIcon = document.createElement('div');
    soundIcon.classList.add('sound-icon');
    
    const isActive = state.currentSound && state.currentSound.id === sound.id && state.isPlaying;
    
    soundIcon.innerHTML = `
      <div class="sound-button ${isActive ? 'active' : ''}">
        <i data-feather="${sound.icon}"></i>
      </div>
      <div class="sound-label">${sound.name}</div>
    `;
    
    soundIcon.addEventListener('click', () => playSound(sound));
    elements.soundIcons.appendChild(soundIcon);
  });
  
  // Replace icon placeholders with Feather icons
  replaceIconPlaceholders();
}

// Replace icon placeholders with Feather icons
function replaceIconPlaceholders() {
  try {
    feather.replace();
  } catch (e) {
    console.error('Feather icons not loaded:', e);
    // Fallback to manually creating SVG icons
    document.querySelectorAll('[data-feather]').forEach(placeholder => {
      const iconName = placeholder.getAttribute('data-feather');
      // You could implement a simple SVG icon system here
      placeholder.innerHTML = `<span>${iconName}</span>`;
    });
  }
}

// Play a sound
function playSound(sound) {
  if (!sound) return;
  
  if (state.isMixMode) {
    toggleSoundInMix(sound);
  } else {
    // Standard play mode
    if (state.currentSound && state.currentSound.id === sound.id) {
      togglePlayPause();
    } else {
      stopCurrentSound();
      state.currentSound = sound;
      startPlayback();
      
      if (state.useBackgroundFromSound && sound.backgroundUrl) {
        updateBackgroundDisplay();
      }
    }
  }
  
  updateUI();
}

// Toggle sound in mix mode
function toggleSoundInMix(sound) {
  const index = state.activeSounds.findIndex(s => s.id === sound.id);
  
  if (index >= 0) {
    // Remove sound from mix
    state.activeSounds.splice(index, 1);
    stopSound(sound.id);
  } else {
    // Add sound to mix
    state.activeSounds.push({
      ...sound,
      volume: state.volume
    });
    
    if (state.isPlaying) {
      playSoundAudio(sound.id, sound.audioUrl, state.volume);
    }
  }
  
  renderMixPanel();
}

// Toggle play/pause
function togglePlayPause() {
  if (state.isPlaying) {
    pausePlayback();
  } else {
    startPlayback();
  }
  
  updateUI();
}

// Start playback
function startPlayback() {
  if (state.isMixMode) {
    // Mix mode - play all active sounds
    state.activeSounds.forEach(sound => {
      playSoundAudio(sound.id, sound.audioUrl, sound.volume || state.volume);
    });
  } else if (state.currentSound) {
    // Standard mode - play current sound
    playSoundAudio(state.currentSound.id, state.currentSound.audioUrl, state.volume);
  }
  
  state.isPlaying = true;
}

// Pause playback
function pausePlayback() {
  if (state.isMixMode) {
    // Mix mode - pause all active sounds
    state.activeSounds.forEach(sound => {
      pauseSound(sound.id);
    });
  } else if (state.currentSound) {
    // Standard mode - pause current sound
    pauseSound(state.currentSound.id);
  }
  
  state.isPlaying = false;
}

// Stop current sound
function stopCurrentSound() {
  if (state.currentSound) {
    stopSound(state.currentSound.id);
    state.currentSound = null;
  }
}

// Play sound audio
function playSoundAudio(id, url, volume = 1) {
  if (!url) return;
  
  let audio = state.audioElements[id];
  
  if (!audio) {
    audio = new Audio(url);
    audio.loop = true;
    state.audioElements[id] = audio;
  }
  
  audio.volume = volume;
  
  // Play the audio
  const playPromise = audio.play();
  
  // Handle potential play() promise rejection
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // Playback started successfully
      })
      .catch(error => {
        console.error('Error playing sound:', error);
        showToast('Error playing sound. Please try again.');
      });
  }
}

// Pause sound
function pauseSound(id) {
  const audio = state.audioElements[id];
  if (audio) {
    audio.pause();
  }
}

// Stop sound
function stopSound(id) {
  const audio = state.audioElements[id];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

// Update sound volume
function updateSoundVolume(soundId, volume) {
  // Update state
  if (state.isMixMode) {
    const soundIndex = state.activeSounds.findIndex(s => s.id === soundId);
    if (soundIndex >= 0) {
      state.activeSounds[soundIndex].volume = volume;
      
      // Update audio if playing
      const audio = state.audioElements[soundId];
      if (audio) {
        audio.volume = volume;
      }
    }
  } else if (state.currentSound && state.currentSound.id === soundId) {
    state.volume = volume;
    
    // Update audio if playing
    const audio = state.audioElements[soundId];
    if (audio) {
      audio.volume = volume;
    }
  }
}

// Hide interface
function hideInterface() {
  state.isHidden = true;
  elements.playerContainer.classList.add('interface-hidden');
  elements.showUiButton.classList.remove('hidden');
  
  // Hide elements
  elements.soundScrollarea.classList.add('hidden');
  document.querySelector('.mode-switcher').classList.add('hidden');
  document.querySelector('.player-controls').classList.add('hidden');
  elements.soundInfo.classList.add('hidden');
  elements.mixPanel.classList.add('hidden');
}

// Show interface
function showInterface() {
  state.isHidden = false;
  elements.playerContainer.classList.remove('interface-hidden');
  elements.showUiButton.classList.add('hidden');
  
  // Show elements
  elements.soundScrollarea.classList.remove('hidden');
  document.querySelector('.mode-switcher').classList.remove('hidden');
  document.querySelector('.player-controls').classList.remove('hidden');
  elements.soundInfo.classList.remove('hidden');
  
  if (state.isMixMode && state.activeSounds.length > 0) {
    elements.mixPanel.classList.remove('hidden');
  }
}

// Set mode (play or mix)
function setMode(mode) {
  const newMixMode = mode === 'mix';
  
  if (newMixMode === state.isMixMode) return;
  
  if (newMixMode) {
    // Switching to mix mode
    stopCurrentSound();
    state.isMixMode = true;
    elements.playMode.classList.remove('active');
    elements.mixMode.classList.add('active');
    
    // Add current sound to mix if playing
    if (state.currentSound && state.isPlaying) {
      state.activeSounds = [{
        ...state.currentSound,
        volume: state.volume
      }];
    }
    
    // Show mix panel if sounds are active
    if (state.activeSounds.length > 0) {
      renderMixPanel();
      elements.mixPanel.classList.remove('hidden');
    }
    
    // Open mix drawer
    openDrawer(elements.mixDrawer);
    renderMixModeDrawer();
  } else {
    // Switching to play mode
    state.isMixMode = false;
    elements.mixMode.classList.remove('active');
    elements.playMode.classList.add('active');
    
    // Hide mix panel
    elements.mixPanel.classList.add('hidden');
    
    // Stop all sounds in mix
    state.activeSounds.forEach(sound => {
      stopSound(sound.id);
    });
    
    // If there was a sound in the mix, make it the current sound
    if (state.activeSounds.length > 0) {
      state.currentSound = { ...state.activeSounds[0] };
      if (state.isPlaying) {
        playSoundAudio(state.currentSound.id, state.currentSound.audioUrl, state.volume);
      }
    } else {
      state.isPlaying = false;
    }
  }
  
  updateUI();
}

// Update the UI based on the current state
function updateUI() {
  // Update play button
  if (state.isPlaying) {
    elements.playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
    elements.playButton.classList.add('playing');
  } else {
    elements.playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    elements.playButton.classList.remove('playing');
  }
  
  // Update sound icons
  renderSoundIcons();
  
  // Update sound info text
  if (state.isMixMode) {
    const count = state.activeSounds.length;
    elements.soundText.textContent = count > 0 ? `${count} sound${count !== 1 ? 's' : ''} playing` : 'Select sounds to create a mix';
    
    // Show mix panel if sounds are active
    if (count > 0) {
      renderMixPanel();
      if (!state.isHidden) {
        elements.mixPanel.classList.remove('hidden');
      }
    } else {
      elements.mixPanel.classList.add('hidden');
    }
    
    // Hide current sound name
    elements.currentSoundName.classList.add('hidden');
  } else {
    if (state.currentSound) {
      elements.soundText.textContent = state.isPlaying ? state.currentSound.name : 'Select a sound to begin';
      
      // Show current sound name if playing
      if (state.isPlaying) {
        elements.currentSoundName.textContent = state.currentSound.name;
        elements.currentSoundName.classList.remove('hidden');
      } else {
        elements.currentSoundName.classList.add('hidden');
      }
    } else {
      elements.soundText.textContent = 'Select a sound to begin';
      elements.currentSoundName.classList.add('hidden');
    }
  }
  
  // Update background use toggle
  if (!state.isMixMode && state.currentSound && state.currentSound.backgroundUrl) {
    backgroundElements.useSoundBgContainer.classList.remove('hidden');
    backgroundElements.useSoundBgToggle.checked = state.useBackgroundFromSound;
  } else {
    backgroundElements.useSoundBgContainer.classList.add('hidden');
  }
}

// Update the background display
function updateBackgroundDisplay() {
  let backgroundUrl = state.currentBackground.url;
  
  if (!state.isMixMode && state.currentSound && state.currentSound.backgroundUrl && state.useBackgroundFromSound) {
    backgroundUrl = state.currentSound.backgroundUrl;
  }
  
  elements.backgroundImage.src = backgroundUrl;
}

// Toggle using background from sound
function toggleUseBackgroundFromSound() {
  state.useBackgroundFromSound = !state.useBackgroundFromSound;
  updateBackgroundDisplay();
  
  // Update toggle
  backgroundElements.useSoundBgToggle.checked = state.useBackgroundFromSound;
}

// Open modal
function openModal(modal) {
  // Close any open modals first
  closeAllModals();
  
  // Open the requested modal
  modal.classList.remove('hidden');
  
  // Specific setup for each modal type
  if (modal === elements.backgroundGalleryModal) {
    renderBackgroundGallery();
  } else if (modal === elements.timerModal) {
    initializeTimerModal();
  } else if (modal === elements.timerSettingsModal) {
    initializeTimerSettings();
  }
}

// Close modal
function closeModal(modal) {
  modal.classList.add('hidden');
}

// Close all modals
function closeAllModals() {
  elements.timerModal.classList.add('hidden');
  elements.timerSettingsModal.classList.add('hidden');
  elements.backgroundGalleryModal.classList.add('hidden');
  elements.exploreModal.classList.add('hidden');
}

// Open drawer
function openDrawer(drawer) {
  // Close any open drawers first
  closeAllDrawers();
  
  // Open the requested drawer
  drawer.classList.remove('hidden');
}

// Close drawer
function closeDrawer(drawer) {
  drawer.classList.add('hidden');
}

// Close all drawers
function closeAllDrawers() {
  elements.mixDrawer.classList.add('hidden');
  elements.savedMixesDrawer.classList.add('hidden');
}

// Render the mix panel
function renderMixPanel() {
  if (!state.isMixMode || state.activeSounds.length === 0) {
    elements.mixPanel.classList.add('hidden');
    return;
  }
  
  elements.mixSounds.innerHTML = '';
  
  state.activeSounds.forEach(sound => {
    const soundItem = document.createElement('div');
    soundItem.classList.add('mix-sound-item');
    
    soundItem.innerHTML = `
      <div class="mix-sound-icon">
        <i data-feather="${sound.icon}"></i>
      </div>
      <div class="mix-sound-name">${sound.name}</div>
      <div class="mix-sound-slider">
        <input type="range" min="0" max="1" step="0.01" value="${sound.volume || state.volume}" />
      </div>
    `;
    
    // Add volume change listener
    const slider = soundItem.querySelector('input[type="range"]');
    slider.addEventListener('input', (e) => {
      updateSoundVolume(sound.id, parseFloat(e.target.value));
    });
    
    elements.mixSounds.appendChild(soundItem);
  });
  
  // Replace icon placeholders
  replaceIconPlaceholders();
}

// Render the background gallery
function renderBackgroundGallery() {
  backgroundElements.backgroundGrid.innerHTML = '';
  
  state.backgrounds.forEach(bg => {
    const isActive = state.currentBackground.id === bg.id && !state.useBackgroundFromSound;
    
    const bgItem = document.createElement('div');
    bgItem.classList.add('background-item');
    if (isActive) bgItem.classList.add('active');
    
    bgItem.innerHTML = `
      <img src="${bg.thumbnailUrl}" alt="${bg.name}">
      <div class="background-item-label">${bg.name}</div>
    `;
    
    bgItem.addEventListener('click', () => {
      state.currentBackground = bg;
      state.useBackgroundFromSound = false;
      updateBackgroundDisplay();
      
      // Update UI
      renderBackgroundGallery();
    });
    
    backgroundElements.backgroundGrid.appendChild(bgItem);
  });
}

// Render the explore modal
function renderExploreModal() {
  // Render categories
  exploreElements.categoryTabs.innerHTML = '';
  
  state.categories.forEach((category, index) => {
    const categoryTab = document.createElement('button');
    categoryTab.classList.add('category-tab');
    if (index === 0) categoryTab.classList.add('active');
    
    categoryTab.textContent = category;
    categoryTab.dataset.category = category;
    
    categoryTab.addEventListener('click', () => {
      // Remove active class from all tabs
      document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Add active class to clicked tab
      categoryTab.classList.add('active');
      
      // Render sounds for this category
      renderSoundsForCategory(category);
    });
    
    exploreElements.categoryTabs.appendChild(categoryTab);
  });
  
  // Render sounds for first category
  if (state.categories.length > 0) {
    renderSoundsForCategory(state.categories[0]);
  }
}

// Render sounds for a specific category
function renderSoundsForCategory(category) {
  exploreElements.soundList.innerHTML = '';
  
  const categorySounds = state.sounds.filter(sound => sound.category === category);
  
  categorySounds.forEach(sound => {
    const isActive = !state.isMixMode && state.currentSound && state.currentSound.id === sound.id && state.isPlaying;
    
    const soundItem = document.createElement('div');
    soundItem.classList.add('sound-list-item');
    
    soundItem.innerHTML = `
      <div class="sound-item-info">
        <div class="sound-item-icon">
          <i data-feather="${sound.icon}"></i>
        </div>
        <div class="sound-item-name">${sound.name}</div>
      </div>
      <button class="sound-item-play">
        <i data-feather="${isActive ? 'pause' : 'play'}"></i>
      </button>
    `;
    
    soundItem.addEventListener('click', () => {
      playSound(sound);
      closeModal(elements.exploreModal);
    });
    
    exploreElements.soundList.appendChild(soundItem);
  });
  
  // Replace icon placeholders
  replaceIconPlaceholders();
}

// Render mix mode drawer
function renderMixModeDrawer() {
  mixElements.mixTilesContainer.innerHTML = '';
  
  state.sounds.forEach(sound => {
    const isActive = state.activeSounds.some(s => s.id === sound.id);
    const volume = isActive
      ? state.activeSounds.find(s => s.id === sound.id).volume || state.volume
      : state.volume;
    
    const mixTile = document.createElement('div');
    mixTile.classList.add('mix-tile');
    
    mixTile.innerHTML = `
      <div class="mix-tile-button ${isActive ? 'active' : ''}">
        <div class="mix-tile-inner">
          <i data-feather="${sound.icon}"></i>
        </div>
      </div>
      <div class="mix-tile-name">${sound.name}</div>
      ${isActive ? `
        <div class="mix-tile-slider">
          <input type="range" min="0" max="1" step="0.01" value="${volume}" />
        </div>
      ` : ''}
    `;
    
    // Add click handler for tile
    const tileButton = mixTile.querySelector('.mix-tile-button');
    tileButton.addEventListener('click', () => {
      playSound(sound);
      renderMixModeDrawer(); // Re-render after state change
    });
    
    // Add volume change listener if active
    if (isActive) {
      const slider = mixTile.querySelector('input[type="range"]');
      slider.addEventListener('input', (e) => {
        updateSoundVolume(sound.id, parseFloat(e.target.value));
      });
    }
    
    mixElements.mixTilesContainer.appendChild(mixTile);
  });
  
  // Replace icon placeholders
  replaceIconPlaceholders();
}

// Save the current mix
function saveMix() {
  if (!state.activeSounds.length) {
    showToast('Add sounds to your mix before saving');
    return;
  }
  
  // Prompt for mix name
  const mixName = prompt('Name your mix:', `Mix ${state.savedMixes.length + 1}`);
  
  if (!mixName) return;
  
  const newMix = {
    id: generateId(),
    name: mixName,
    sounds: state.activeSounds.map(sound => ({
      id: sound.id,
      volume: sound.volume || state.volume
    })),
    createdAt: new Date().toISOString()
  };
  
  // Add to saved mixes
  state.savedMixes.push(newMix);
  
  // Save to localStorage
  saveSavedMixes();
  
  showToast('Mix saved successfully');
}

// Render saved mixes
function renderSavedMixes() {
  savedMixesElements.savedMixesContainer.innerHTML = '';
  
  if (state.savedMixes.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.classList.add('text-center');
    emptyState.innerHTML = `
      <p style="padding: 32px 0; color: rgba(255, 255, 255, 0.7);">
        You haven't saved any mixes yet.<br>
        <span style="font-size: 14px; display: block; margin-top: 8px;">Create a mix in Mix Mode and save it!</span>
      </p>
    `;
    
    savedMixesElements.savedMixesContainer.appendChild(emptyState);
    return;
  }
  
  state.savedMixes.forEach(mix => {
    const isActive = state.isMixMode && 
      state.activeSounds.length === mix.sounds.length &&
      mix.sounds.every(savedSound => {
        return state.activeSounds.some(activeSound => activeSound.id === savedSound.id);
      });
    
    const mixItem = document.createElement('div');
    mixItem.classList.add('saved-mix-item');
    if (isActive) mixItem.classList.add('active');
    
    // Format date
    const date = new Date(mix.createdAt);
    const timeAgo = getTimeAgo(date);
    
    mixItem.innerHTML = `
      <div class="saved-mix-header">
        <div class="saved-mix-title">${mix.name}</div>
        <div class="saved-mix-actions">
          <button class="saved-mix-action share-mix">
            <i data-feather="share-2"></i>
          </button>
          <button class="saved-mix-action delete-mix">
            <i data-feather="trash-2"></i>
          </button>
          <button class="saved-mix-action play-mix">
            <i data-feather="play"></i>
          </button>
        </div>
      </div>
      <div class="saved-mix-info">
        ${mix.sounds.length} sound${mix.sounds.length !== 1 ? 's' : ''} • ${timeAgo}
      </div>
    `;
    
    // Add event listeners for actions
    mixItem.addEventListener('click', () => {
      loadMix(mix.id);
      closeDrawer(elements.savedMixesDrawer);
    });
    
    mixItem.querySelector('.share-mix').addEventListener('click', (e) => {
      e.stopPropagation();
      shareMix(mix.id);
    });
    
    mixItem.querySelector('.delete-mix').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteMix(mix.id);
      renderSavedMixes();
    });
    
    mixItem.querySelector('.play-mix').addEventListener('click', (e) => {
      e.stopPropagation();
      loadMix(mix.id);
      togglePlayPause();
      closeDrawer(elements.savedMixesDrawer);
    });
    
    savedMixesElements.savedMixesContainer.appendChild(mixItem);
  });
  
  // Replace icon placeholders
  replaceIconPlaceholders();
}

// Calculate time ago string
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  
  return 'just now';
}

// Load a saved mix
function loadMix(mixId) {
  const mix = state.savedMixes.find(m => m.id === mixId);
  
  if (!mix) return;
  
  // Stop all current sounds
  state.activeSounds.forEach(sound => {
    stopSound(sound.id);
  });
  
  // Clear active sounds
  state.activeSounds = [];
  
  // Switch to mix mode
  if (!state.isMixMode) {
    setMode('mix');
  }
  
  // Load sounds from the mix
  mix.sounds.forEach(savedSound => {
    const fullSound = state.sounds.find(s => s.id === savedSound.id);
    
    if (fullSound) {
      state.activeSounds.push({
        ...fullSound,
        volume: savedSound.volume
      });
      
      if (state.isPlaying) {
        playSoundAudio(fullSound.id, fullSound.audioUrl, savedSound.volume);
      }
    }
  });
  
  // Update UI
  renderMixPanel();
  renderMixModeDrawer();
  updateUI();
  
  showToast(`Loaded mix: ${mix.name}`);
}

// Delete a saved mix
function deleteMix(mixId) {
  const index = state.savedMixes.findIndex(m => m.id === mixId);
  
  if (index >= 0) {
    state.savedMixes.splice(index, 1);
    saveSavedMixes();
    showToast('Mix deleted');
  }
}

// Share a saved mix
function shareMix(mixId) {
  // In a real implementation, you would generate a shareable link
  // For this demo, we'll just show a toast
  showToast('Sharing mix... (Feature coming soon)');
}

// Save mixes to localStorage
function saveSavedMixes() {
  try {
    localStorage.setItem('saved-mixes', JSON.stringify(state.savedMixes));
  } catch (e) {
    console.error('Error saving mixes to localStorage:', e);
  }
}

// Load mixes from localStorage
function loadSavedMixes() {
  try {
    const saved = localStorage.getItem('saved-mixes');
    if (saved) {
      state.savedMixes = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading mixes from localStorage:', e);
  }
}

// Timer related functions

// Initialize the timer modal
function initializeTimerModal() {
  // Set active tab
  if (state.timer.breakDuration > 0) {
    setTimerModalTab('pomodoro');
  } else {
    setTimerModalTab('simple');
  }
  
  // Set rounds
  timerModalElements.roundsValue.textContent = state.timer.totalRounds;
  
  // Clear task
  timerModalElements.taskInput.value = '';
}

// Set timer modal tab
function setTimerModalTab(tab) {
  if (tab === 'pomodoro') {
    timerModalElements.pomodoroTab.classList.add('active');
    timerModalElements.simpleTab.classList.remove('active');
    timerModalElements.roundsContainer.classList.remove('hidden');
  } else {
    timerModalElements.simpleTab.classList.add('active');
    timerModalElements.pomodoroTab.classList.remove('active');
    timerModalElements.roundsContainer.classList.add('hidden');
  }
}

// Decrease rounds
function decreaseRounds() {
  const current = parseInt(timerModalElements.roundsValue.textContent);
  if (current > 1) {
    timerModalElements.roundsValue.textContent = current - 1;
  }
}

// Increase rounds
function increaseRounds() {
  const current = parseInt(timerModalElements.roundsValue.textContent);
  if (current < 10) {
    timerModalElements.roundsValue.textContent = current + 1;
  }
}

// Start the timer
function startTimer() {
  const isPomodoro = timerModalElements.pomodoroTab.classList.contains('active');
  const task = timerModalElements.taskInput.value;
  const rounds = isPomodoro ? parseInt(timerModalElements.roundsValue.textContent) : 1;
  
  const focusMinutes = parseInt(timerSettingsElements.focusTimeSlider.value);
  const breakMinutes = parseInt(timerSettingsElements.breakTimeSlider.value);
  
  // Update timer state
  state.timer.isActive = true;
  state.timer.isPaused = false;
  state.timer.duration = focusMinutes * 60;
  state.timer.breakDuration = isPomodoro ? breakMinutes * 60 : 0;
  state.timer.remaining = focusMinutes * 60;
  state.timer.task = task;
  state.timer.mode = 'focus';
  state.timer.totalRounds = rounds;
  state.timer.currentRound = 0;
  state.timer.completedRounds = 0;
  
  // Start the countdown
  startTimerCountdown();
  
  // Close the modal
  closeModal(elements.timerModal);
  
  // Show timer display
  showTimerDisplay();
}

// Show the timer display
function showTimerDisplay() {
  elements.timerDisplay.classList.remove('hidden');
  
  // Show/hide appropriate elements based on timer type
  if (state.timer.breakDuration > 0) {
    elements.timerModeTabs.classList.remove('hidden');
    
    if (state.timer.totalRounds > 1) {
      elements.timerRounds.classList.remove('hidden');
      elements.timerRoundInfo.classList.remove('hidden');
      
      updateTimerRounds();
    } else {
      elements.timerRounds.classList.add('hidden');
      elements.timerRoundInfo.classList.add('hidden');
    }
  } else {
    elements.timerModeTabs.classList.add('hidden');
    elements.timerRounds.classList.add('hidden');
    elements.timerRoundInfo.classList.add('hidden');
  }
  
  if (state.timer.task) {
    elements.timerTask.classList.remove('hidden');
    elements.timerTask.textContent = state.timer.task;
  } else {
    elements.timerTask.classList.add('hidden');
  }
  
  // Update focus/break tab active state
  if (state.timer.mode === 'focus') {
    elements.focusTab.classList.add('active');
    elements.breakTab.classList.remove('active');
  } else {
    elements.breakTab.classList.add('active');
    elements.focusTab.classList.remove('active');
  }
  
  // Update timer display
  updateTimerDisplay();
}

// Update timer rounds UI
function updateTimerRounds() {
  elements.timerRounds.innerHTML = '';
  
  for (let i = 0; i < state.timer.totalRounds; i++) {
    const roundDot = document.createElement('div');
    roundDot.classList.add('timer-round');
    
    if (i < state.timer.completedRounds || (i === state.timer.currentRound && state.timer.mode === 'break')) {
      roundDot.classList.add('completed');
    }
    
    elements.timerRounds.appendChild(roundDot);
  }
  
  elements.timerRoundInfo.textContent = `Round ${state.timer.currentRound + 1} of ${state.timer.totalRounds}`;
}

// Start the timer countdown
function startTimerCountdown() {
  // Clear any existing interval
  if (window.timerInterval) {
    clearInterval(window.timerInterval);
  }
  
  // Start a new interval
  window.timerInterval = setInterval(() => {
    if (!state.timer.isPaused) {
      if (state.timer.remaining > 0) {
        state.timer.remaining--;
        updateTimerDisplay();
      } else {
        // Timer finished
        handleTimerFinished();
      }
    }
  }, 1000);
}

// Handle timer finished
function handleTimerFinished() {
  if (state.timer.mode === 'focus') {
    // Focus timer finished
    
    if (state.timer.breakDuration > 0) {
      // Switch to break mode
      state.timer.mode = 'break';
      state.timer.remaining = state.timer.breakDuration;
      
      // Show notification
      showToast('Focus time complete! Break time started.');
      
      // Play notification sound
      playNotificationSound();
      
      // Update UI
      showTimerDisplay();
    } else {
      // No break - timer completed
      completeTimer();
    }
  } else {
    // Break timer finished
    state.timer.completedRounds++;
    
    if (state.timer.currentRound + 1 < state.timer.totalRounds) {
      // Move to next round
      state.timer.currentRound++;
      state.timer.mode = 'focus';
      state.timer.remaining = state.timer.duration;
      
      // Show notification
      showToast('Break time complete! Next focus session started.');
      
      // Play notification sound
      playNotificationSound();
      
      // Update UI
      showTimerDisplay();
    } else {
      // All rounds completed
      completeTimer();
    }
  }
}

// Complete the timer
function completeTimer() {
  clearInterval(window.timerInterval);
  
  state.timer.isActive = false;
  state.timer.isPaused = false;
  
  // Hide timer display
  elements.timerDisplay.classList.add('hidden');
  
  // Show notification
  showToast('Timer completed!');
  
  // Play notification sound
  playNotificationSound();
  
  // Update document title
  document.title = 'Serene Soundscapes Player';
}

// Update the timer display
function updateTimerDisplay() {
  const minutes = Math.floor(state.timer.remaining / 60);
  const seconds = state.timer.remaining % 60;
  
  // Format time with leading zeros
  const displayTime = state.timer.hideSeconds
    ? `${String(minutes).padStart(2, '0')}:00`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  elements.timerTime.textContent = displayTime;
  
  // Update progress bar
  const totalTime = state.timer.mode === 'focus' ? state.timer.duration : state.timer.breakDuration;
  const progress = 100 - ((state.timer.remaining / totalTime) * 100);
  elements.timerProgress.style.width = `${progress}%`;
  
  // Update document title
  const mode = state.timer.mode === 'focus' ? 'FOCUS' : 'BREAK';
  document.title = `${displayTime} - ${mode}`;
  
  // Update play/pause button
  if (state.timer.isPaused) {
    elements.timerPlayPause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
  } else {
    elements.timerPlayPause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
  }
  
  // Update rounds if needed
  if (state.timer.totalRounds > 1) {
    updateTimerRounds();
  }
}

// Pause/resume the timer
function pauseResumeTimer() {
  state.timer.isPaused = !state.timer.isPaused;
  updateTimerDisplay();
  
  // Show toast notification
  showToast(state.timer.isPaused ? 'Timer paused' : 'Timer resumed');
}

// Show timer menu
function showTimerMenu() {
  // In a full implementation, this would show a dropdown menu
  // For simplicity, we'll just show options as toasts for now
  
  const menu = document.createElement('div');
  menu.classList.add('timer-menu');
  menu.style.position = 'absolute';
  menu.style.right = '0';
  menu.style.top = '100%';
  menu.style.background = 'rgba(0, 0, 0, 0.8)';
  menu.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  menu.style.borderRadius = '8px';
  menu.style.padding = '8px';
  menu.style.zIndex = '1000';
  
  // Add menu options
  const completeOption = document.createElement('div');
  completeOption.textContent = 'Complete Timer';
  completeOption.style.padding = '8px 16px';
  completeOption.style.cursor = 'pointer';
  completeOption.addEventListener('click', completeTimer);
  
  const restartOption = document.createElement('div');
  restartOption.textContent = 'Restart Timer';
  restartOption.style.padding = '8px 16px';
  restartOption.style.cursor = 'pointer';
  restartOption.addEventListener('click', () => {
    state.timer.remaining = state.timer.mode === 'focus' ? state.timer.duration : state.timer.breakDuration;
    state.timer.isPaused = false;
    updateTimerDisplay();
    showToast('Timer restarted');
  });
  
  const addTimeOption = document.createElement('div');
  addTimeOption.textContent = 'Add 10 Minutes';
  addTimeOption.style.padding = '8px 16px';
  addTimeOption.style.cursor = 'pointer';
  addTimeOption.addEventListener('click', () => {
    state.timer.remaining += 600; // 10 minutes in seconds
    updateTimerDisplay();
    showToast('Added 10 minutes to timer');
  });
  
  menu.appendChild(completeOption);
  menu.appendChild(restartOption);
  menu.appendChild(addTimeOption);
  
  // Append to timer controls
  const controls = document.querySelector('.timer-controls');
  controls.appendChild(menu);
  
  // Close when clicking outside
  const handleClick = (e) => {
    if (!menu.contains(e.target) && e.target !== elements.timerMenu) {
      menu.remove();
      document.removeEventListener('click', handleClick);
    }
  };
  
  setTimeout(() => {
    document.addEventListener('click', handleClick);
  }, 0);
}

// Switch timer mode
function switchTimerMode(mode) {
  if (mode === state.timer.mode) return;
  
  state.timer.mode = mode;
  state.timer.remaining = mode === 'focus' ? state.timer.duration : state.timer.breakDuration;
  
  updateTimerDisplay();
  showToast(`Switched to ${mode} time`);
}

// Initialize timer settings
function initializeTimerSettings() {
  // Set active tab
  if (state.timer.breakDuration > 0) {
    setTimerSettingsTab('pomodoro');
  } else {
    setTimerSettingsTab('simple');
  }
  
  // Set slider values
  timerSettingsElements.focusTimeSlider.value = Math.floor(state.timer.duration / 60);
  timerSettingsElements.breakTimeSlider.value = Math.floor(state.timer.breakDuration / 60);
  
  // Update displays
  updateFocusTimeFromSlider();
  updateBreakTimeFromSlider();
  
  // Clear custom inputs
  timerSettingsElements.customFocusInput.value = '';
  timerSettingsElements.customBreakInput.value = '';
}

// Set timer settings tab
function setTimerSettingsTab(tab) {
  if (tab === 'pomodoro') {
    timerSettingsElements.pomodoroSettingsTab.classList.add('active');
    timerSettingsElements.simpleSettingsTab.classList.remove('active');
    timerSettingsElements.customBreakContainer.classList.remove('hidden');
    timerSettingsElements.breakSliderContainer.classList.remove('hidden');
  } else {
    timerSettingsElements.simpleSettingsTab.classList.add('active');
    timerSettingsElements.pomodoroSettingsTab.classList.remove('active');
    timerSettingsElements.customBreakContainer.classList.add('hidden');
    timerSettingsElements.breakSliderContainer.classList.add('hidden');
  }
}

// Update focus time from slider
function updateFocusTimeFromSlider() {
  const minutes = parseInt(timerSettingsElements.focusTimeSlider.value);
  timerSettingsElements.focusTimeDisplay.textContent = formatTimeDisplay(minutes);
  timerSettingsElements.customFocusInput.value = '';
}

// Update break time from slider
function updateBreakTimeFromSlider() {
  const minutes = parseInt(timerSettingsElements.breakTimeSlider.value);
  timerSettingsElements.breakTimeDisplay.textContent = formatTimeDisplay(minutes);
  timerSettingsElements.customBreakInput.value = '';
}

// Update focus time from custom input
function updateFocusTimeFromInput() {
  const input = timerSettingsElements.customFocusInput.value;
  
  if (!input) return;
  
  // Validate input - only allow numbers between 1 and 120
  const minutes = parseInt(input);
  
  if (isNaN(minutes) || minutes < 1 || minutes > 120) {
    timerSettingsElements.customFocusInput.value = input.slice(0, -1);
    return;
  }
  
  timerSettingsElements.focusTimeDisplay.textContent = formatTimeDisplay(minutes);
  timerSettingsElements.focusTimeSlider.value = Math.min(minutes, 60); // Slider max is 60
}

// Update break time from custom input
function updateBreakTimeFromInput() {
  const input = timerSettingsElements.customBreakInput.value;
  
  if (!input) return;
  
  // Validate input - only allow numbers between 1 and 30
  const minutes = parseInt(input);
  
  if (isNaN(minutes) || minutes < 1 || minutes > 30) {
    timerSettingsElements.customBreakInput.value = input.slice(0, -1);
    return;
  }
  
  timerSettingsElements.breakTimeDisplay.textContent = formatTimeDisplay(minutes);
  timerSettingsElements.breakTimeSlider.value = Math.min(minutes, 15); // Slider max is 15
}

// Format time display
function formatTimeDisplay(minutes) {
  return `${String(minutes).padStart(2, '0')}:00`;
}

// Play notification sound
function playNotificationSound() {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-alert-2568.mp3');
  audio.volume = 0.7;
  audio.play();
}

// Show toast notification
function showToast(message, duration = 3000) {
  elements.toast.textContent = message;
  elements.toast.classList.remove('hidden');
  
  // Hide after duration
  setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, duration);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Optional: Load Feather Icons if not already loaded
// This should be used if you're not adding the Feather Icons script directly in HTML
if (typeof feather === 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js';
  script.onload = function() {
    feather.replace();
  };
  document.head.appendChild(script);
}
