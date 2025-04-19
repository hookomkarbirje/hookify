
/**
 * UI controller module handling all DOM manipulation
 */

// UI controller object
const uiController = {
  // DOM elements cache
  elements: {},
  
  // Initialize UI
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.renderSoundIcons();
    this.renderBackgrounds();
    this.renderScenarios();
    this.renderSoundCategories();
    this.renderMixSoundGrid();
    
    // Initial UI update
    this.updatePlayerUI();
  },
  
  // Cache all required DOM elements
  cacheElements() {
    this.elements = {
      // Background elements
      backgroundImage: document.getElementById('background-image'),
      
      // Sound information display
      soundInfo: document.getElementById('sound-info'),
      soundNameDisplay: document.getElementById('sound-name-display'),
      currentSoundLabel: document.getElementById('current-sound-label'),
      
      // Player controls
      playPauseBtn: document.getElementById('play-pause-btn'),
      hideBtn: document.getElementById('hide-btn'),
      showUIBtn: document.getElementById('show-ui-btn'),
      
      // Mode switcher
      playModeBtn: document.getElementById('play-mode'),
      mixModeBtn: document.getElementById('mix-mode'),
      exploreBtn: document.getElementById('explore-btn'),
      libraryBtn: document.getElementById('library-btn'),
      
      // Sound scroller
      soundScroller: document.getElementById('sound-scroller'),
      soundsContainer: document.getElementById('sounds-container'),
      
      // Mix panel
      mixPanel: document.getElementById('mix-panel'),
      mixSounds: document.getElementById('mix-sounds'),
      
      // Timer display
      timerDisplay: document.getElementById('timer-display'),
      timeDisplay: document.getElementById('time-display'),
      timerModeTabs: document.getElementById('timer-mode-tabs'),
      focusTab: document.getElementById('focus-tab'),
      breakTab: document.getElementById('break-tab'),
      pauseResumeTimer: document.getElementById('pause-resume-timer'),
      roundIndicators: document.getElementById('round-indicators'),
      roundInfo: document.getElementById('round-info'),
      taskDisplay: document.getElementById('task-display'),
      timerProgress: document.getElementById('timer-progress'),
      timerMenuBtn: document.getElementById('timer-menu-btn'),
      timerMenuDropdown: document.getElementById('timer-menu-dropdown'),
      completeTimer: document.getElementById('complete-timer'),
      restartTimer: document.getElementById('restart-timer'),
      addMinutes: document.getElementById('add-minutes'),
      
      // Special buttons
      timerBtn: document.getElementById('timer-btn'),
      backgroundBtn: document.getElementById('background-btn'),
      settingsBtn: document.getElementById('settings-btn'),
      
      // Modal container
      modalContainer: document.getElementById('modal-container'),
      
      // Templates
      timerModalTemplate: document.getElementById('timer-modal-template'),
      backgroundModalTemplate: document.getElementById('background-modal-template'),
      exploreDrawerTemplate: document.getElementById('explore-drawer-template'),
      settingsDrawerTemplate: document.getElementById('settings-drawer-template'),
      mixDrawerTemplate: document.getElementById('mix-drawer-template'),
      savedMixesTemplate: document.getElementById('saved-mixes-template')
    };
  },
  
  // Set up all UI event listeners
  setupEventListeners() {
    // Play/Pause button
    this.elements.playPauseBtn.addEventListener('click', () => {
      playerState.togglePlayPause();
    });
    
    // Hide/Show interface buttons
    this.elements.hideBtn.addEventListener('click', () => {
      playerState.toggleHideInterface();
    });
    
    this.elements.showUIBtn.addEventListener('click', () => {
      playerState.toggleHideInterface();
    });
    
    // Mode switcher
    this.elements.playModeBtn.addEventListener('click', () => {
      if (playerState.isMixMode) {
        playerState.toggleMixMode();
      }
    });
    
    this.elements.mixModeBtn.addEventListener('click', () => {
      if (!playerState.isMixMode) {
        playerState.toggleMixMode();
      } else {
        this.openMixDrawer();
      }
    });
    
    this.elements.exploreBtn.addEventListener('click', () => {
      this.openExploreDrawer();
    });
    
    this.elements.libraryBtn.addEventListener('click', () => {
      if (playerState.isMixMode) {
        this.openMixDrawer();
      } else {
        this.openExploreDrawer();
      }
    });
    
    // Timer button
    this.elements.timerBtn.addEventListener('click', () => {
      this.openTimerModal();
    });
    
    // Background button
    this.elements.backgroundBtn.addEventListener('click', () => {
      this.openBackgroundModal();
    });
    
    // Settings button
    this.elements.settingsBtn.addEventListener('click', () => {
      this.openSettingsDrawer();
    });
    
    // Timer menu
    this.elements.timerMenuBtn.addEventListener('click', () => {
      this.toggleTimerMenu();
    });
    
    // Timer menu items
    this.elements.completeTimer.addEventListener('click', () => {
      timerController.cancelTimer();
      this.elements.timerMenuDropdown.classList.add('hidden');
    });
    
    this.elements.restartTimer.addEventListener('click', () => {
      timerController.resetTimer();
      this.elements.timerMenuDropdown.classList.add('hidden');
    });
    
    this.elements.addMinutes.addEventListener('click', () => {
      timerController.addMinutesToTimer(10);
      this.elements.timerMenuDropdown.classList.add('hidden');
    });
    
    // Pause/Resume timer button
    this.elements.pauseResumeTimer.addEventListener('click', () => {
      timerController.pauseResumeTimer();
    });
    
    // Timer mode tabs
    this.elements.focusTab.addEventListener('click', () => {
      if (playerState.timer.mode !== 'focus') {
        timerController.resetTimer('focus');
      }
    });
    
    this.elements.breakTab.addEventListener('click', () => {
      if (playerState.timer.mode !== 'break') {
        timerController.resetTimer('break');
      }
    });
    
    // Close timer menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.elements.timerMenuBtn.contains(e.target) && 
          !this.elements.timerMenuDropdown.contains(e.target)) {
        this.elements.timerMenuDropdown.classList.add('hidden');
      }
    });
    
    // Handle resize for responsive adjustments
    window.addEventListener('resize', () => {
      this.updatePlayerUI();
    });
  },
  
  // Render sound icons in the sound scroller
  renderSoundIcons() {
    this.elements.soundsContainer.innerHTML = '';
    
    sounds.forEach(sound => {
      const soundItem = document.createElement('div');
      soundItem.className = 'sound-item';
      
      const soundIcon = document.createElement('div');
      soundIcon.className = 'sound-icon';
      soundIcon.dataset.soundId = sound.id;
      
      // Create inner content
      if (!playerState.isMixMode && sound.imageUrl) {
        const img = document.createElement('img');
        img.src = sound.imageUrl;
        img.alt = sound.name;
        soundIcon.appendChild(img);
      } else {
        const iconInner = document.createElement('div');
        iconInner.className = 'sound-icon-inner';
        
        const iconElement = document.createElement('i');
        iconElement.className = `lucide-${sound.icon}`;
        
        iconInner.appendChild(iconElement);
        soundIcon.appendChild(iconInner);
      }
      
      // Add click handler
      soundIcon.addEventListener('click', () => {
        playerState.playSound(sound);
      });
      
      // Create label
      const soundLabel = document.createElement('span');
      soundLabel.className = 'sound-label';
      soundLabel.textContent = sound.name;
      
      // Append to container
      soundItem.appendChild(soundIcon);
      soundItem.appendChild(soundLabel);
      this.elements.soundsContainer.appendChild(soundItem);
    });
  },
  
  // Render backgrounds in the background modal
  renderBackgrounds() {
    // Will be populated when modal is opened
  },
  
  // Render scenarios in the explore drawer
  renderScenarios() {
    // Will be populated when drawer is opened
  },
  
  // Render sound categories in the explore drawer
  renderSoundCategories() {
    // Will be populated when drawer is opened
  },
  
  // Render mix sound grid for the mix drawer
  renderMixSoundGrid() {
    // Will be populated when drawer is opened
  },
  
  // Update active sound indicators
  updateActiveSounds() {
    // Clear all active states
    document.querySelectorAll('.sound-icon').forEach(icon => {
      icon.classList.remove('active');
    });
    
    if (playerState.isMixMode) {
      // In mix mode, highlight all active sounds
      playerState.activeSounds.forEach(sound => {
        const icon = document.querySelector(`.sound-icon[data-sound-id="${sound.id}"]`);
        if (icon && playerState.isPlaying) {
          icon.classList.add('active');
        }
      });
    } else {
      // In single mode, highlight only current sound
      if (playerState.currentSound && playerState.isPlaying) {
        const icon = document.querySelector(`.sound-icon[data-sound-id="${playerState.currentSound.id}"]`);
        if (icon) {
          icon.classList.add('active');
        }
      }
    }
  },
  
  // Update mode switcher UI
  updateModeSwitcher() {
    // Update mode tabs
    this.elements.playModeBtn.classList.toggle('active', !playerState.isMixMode);
    this.elements.mixModeBtn.classList.toggle('active', playerState.isMixMode);
    
    // Update current sound label
    if (playerState.currentSound && !playerState.isMixMode && playerState.isPlaying) {
      this.elements.currentSoundLabel.textContent = playerState.currentSound.name;
      this.elements.currentSoundLabel.classList.remove('hidden');
    } else if (playerState.isMixMode && playerState.activeSounds.length > 0) {
      this.elements.currentSoundLabel.textContent = `${playerState.activeSounds.length} sound${playerState.activeSounds.length !== 1 ? 's' : ''} playing`;
      this.elements.currentSoundLabel.classList.remove('hidden');
    } else {
      this.elements.currentSoundLabel.classList.add('hidden');
    }
  },
  
  // Update play button state
  updatePlayButton() {
    const iconElement = this.elements.playPauseBtn.querySelector('i');
    
    if (playerState.isPlaying) {
      iconElement.className = 'lucide-pause';
      this.elements.playPauseBtn.classList.add('playing');
      this.elements.playPauseBtn.title = 'Pause';
    } else {
      iconElement.className = 'lucide-play';
      this.elements.playPauseBtn.classList.remove('playing');
      this.elements.playPauseBtn.title = 'Play';
    }
  },
  
  // Update sound information display
  updateSoundInfo() {
    if (playerState.isMixMode) {
      this.elements.soundNameDisplay.textContent = playerState.activeSounds.length > 0 
        ? `${playerState.activeSounds.length} sound${playerState.activeSounds.length !== 1 ? 's' : ''} playing`
        : 'Select sounds to mix';
    } else if (playerState.currentSound) {
      this.elements.soundNameDisplay.textContent = playerState.currentSound.name;
    } else {
      this.elements.soundNameDisplay.textContent = 'Select a sound to begin';
    }
  },
  
  // Update mix panel
  updateMixPanel() {
    if (playerState.isMixMode && playerState.activeSounds.length > 0) {
      // Show mix panel
      this.elements.mixPanel.classList.remove('hidden');
      
      // Update mix sounds
      this.elements.mixSounds.innerHTML = '';
      
      playerState.activeSounds.forEach(sound => {
        const mixSoundItem = document.createElement('div');
        mixSoundItem.className = 'mix-sound-item';
        
        // Sound icon
        const mixSoundIcon = document.createElement('div');
        mixSoundIcon.className = 'mix-sound-icon';
        const iconElement = document.createElement('i');
        iconElement.className = `lucide-${sound.icon}`;
        mixSoundIcon.appendChild(iconElement);
        
        // Sound name
        const mixSoundName = document.createElement('div');
        mixSoundName.className = 'mix-sound-name';
        mixSoundName.textContent = sound.name;
        
        // Volume slider
        const mixSoundVolume = document.createElement('div');
        mixSoundVolume.className = 'mix-sound-volume';
        
        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.className = 'volume-slider';
        volumeSlider.min = '0';
        volumeSlider.max = '1';
        volumeSlider.step = '0.01';
        volumeSlider.value = sound.volume || playerState.volume;
        
        volumeSlider.addEventListener('input', (e) => {
          playerState.updateSoundVolume(sound.id, parseFloat(e.target.value));
        });
        
        mixSoundVolume.appendChild(volumeSlider);
        
        // Append everything
        mixSoundItem.appendChild(mixSoundIcon);
        mixSoundItem.appendChild(mixSoundName);
        mixSoundItem.appendChild(mixSoundVolume);
        
        this.elements.mixSounds.appendChild(mixSoundItem);
      });
    } else {
      // Hide mix panel
      this.elements.mixPanel.classList.add('hidden');
    }
  },
  
  // Update visibility based on current state
  updateVisibility() {
    if (playerState.isHidden) {
      // Hide all UI elements except show button
      this.elements.soundInfo.classList.add('hidden');
      this.elements.soundScroller.classList.add('hidden');
      document.querySelector('.mode-switcher').classList.add('hidden');
      document.querySelector('.player-controls').classList.add('hidden');
      
      // Show button to restore UI
      this.elements.showUIBtn.classList.remove('hidden');
    } else {
      // Show UI elements
      this.elements.soundInfo.classList.remove('hidden');
      this.elements.soundScroller.classList.remove('hidden');
      document.querySelector('.mode-switcher').classList.remove('hidden');
      document.querySelector('.player-controls').classList.remove('hidden');
      
      // Hide show button
      this.elements.showUIBtn.classList.add('hidden');
    }
    
    // Show/hide sound scroller based on mix mode
    this.elements.soundScroller.classList.toggle('hidden', playerState.isMixMode);
  },
  
  // Toggle the timer menu dropdown
  toggleTimerMenu() {
    this.elements.timerMenuDropdown.classList.toggle('hidden');
  },
  
  // Update timer UI
  updateTimerUI() {
    const { timer } = playerState;
    
    if (!timer.isActive) {
      this.elements.timerDisplay.classList.add('hidden');
      return;
    }
    
    // Show timer display
    this.elements.timerDisplay.classList.remove('hidden');
    
    // Update time display
    this.elements.timeDisplay.textContent = formatTime(timer.remaining, timer.hideSeconds);
    
    // Update play/pause button
    const pauseResumeIcon = this.elements.pauseResumeTimer.querySelector('i');
    pauseResumeIcon.className = timer.isPaused ? 'lucide-play' : 'lucide-pause';
    
    // Update mode tabs
    if (timer.breakDuration > 0) {
      this.elements.timerModeTabs.classList.remove('hidden');
      this.elements.focusTab.classList.toggle('active', timer.mode === 'focus');
      this.elements.breakTab.classList.toggle('active', timer.mode === 'break');
    } else {
      this.elements.timerModeTabs.classList.add('hidden');
    }
    
    // Update round indicators
    if (timer.breakDuration > 0 && timer.totalRounds > 1) {
      this.elements.roundIndicators.classList.remove('hidden');
      this.elements.roundInfo.classList.remove('hidden');
      
      // Create round indicators
      this.elements.roundIndicators.innerHTML = '';
      for (let i = 0; i < timer.totalRounds; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'round-indicator';
        
        if (i < timer.completedRounds) {
          indicator.classList.add('completed');
        } else if (i === timer.currentRound) {
          indicator.classList.add('current');
        }
        
        this.elements.roundIndicators.appendChild(indicator);
      }
      
      // Update round info text
      this.elements.roundInfo.textContent = `Round ${timer.currentRound + 1} of ${timer.totalRounds}`;
    } else {
      this.elements.roundIndicators.classList.add('hidden');
      this.elements.roundInfo.classList.add('hidden');
    }
    
    // Update task display
    if (timer.task) {
      this.elements.taskDisplay.textContent = timer.task;
      this.elements.taskDisplay.classList.remove('hidden');
    } else {
      this.elements.taskDisplay.classList.add('hidden');
    }
    
    // Update progress bar
    const totalTime = timer.mode === 'focus' ? timer.duration : timer.breakDuration;
    const progressPercent = 100 - ((timer.remaining / totalTime) * 100);
    this.elements.timerProgress.style.width = `${progressPercent}%`;
  },
  
  // Main UI update function
  updatePlayerUI() {
    this.updateVisibility();
    this.updateActiveSounds();
    this.updateModeSwitcher();
    this.updatePlayButton();
    this.updateSoundInfo();
    this.updateMixPanel();
    this.updateTimerUI();
    
    // Update background based on settings
    if (playerState.useBackgroundFromSound && !playerState.isMixMode && playerState.currentSound?.backgroundUrl) {
      this.elements.backgroundImage.src = playerState.currentSound.backgroundUrl;
    } else {
      this.elements.backgroundImage.src = playerState.currentBackground.url;
    }
  },
  
  // Open timer modal
  openTimerModal() {
    // Clone modal template
    const timerModal = this.elements.timerModalTemplate.content.cloneNode(true);
    
    // Default values
    let selectedMinutes = 25;
    let shortBreakMinutes = 5;
    let rounds = 1;
    let timerType = 'pomodoro';
    
    // Set up event listeners
    const modal = timerModal.querySelector('.modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const startBtn = modal.querySelector('.start-btn');
    const taskInput = modal.querySelector('.task-input');
    const timerTypeBtns = modal.querySelectorAll('.timer-type-btn');
    const roundDecrementBtn = modal.querySelector('.round-btn.decrement');
    const roundIncrementBtn = modal.querySelector('.round-btn.increment');
    const roundsDisplay = modal.querySelector('.rounds');
    const roundBreakdown = modal.querySelector('.round-breakdown');
    const focusDisplay = modal.querySelector('.focus-duration .time-display');
    const breakDisplay = modal.querySelector('.break-duration .time-display');
    const roundSelector = modal.querySelector('.round-selector');
    const breakDuration = modal.querySelector('.break-duration');
    
    // Timer type selection
    timerTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timerTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        timerType = btn.dataset.type;
        
        // Toggle break duration and rounds visibility
        if (timerType === 'pomodoro') {
          breakDuration.style.display = 'block';
          roundSelector.style.display = 'flex';
        } else {
          breakDuration.style.display = 'none';
          roundSelector.style.display = 'none';
        }
      });
    });
    
    // Round adjustment
    roundDecrementBtn.addEventListener('click', () => {
      if (rounds > 1) {
        rounds--;
        updateRoundDisplay();
      }
    });
    
    roundIncrementBtn.addEventListener('click', () => {
      if (rounds < 10) {
        rounds++;
        updateRoundDisplay();
      }
    });
    
    function updateRoundDisplay() {
      roundsDisplay.textContent = rounds;
      roundBreakdown.textContent = `${rounds} × Focus Time + ${rounds} × Short Break`;
    }
    
    // Close button
    cancelBtn.addEventListener('click', () => {
      this.closeModal();
    });
    
    // Start timer
    startBtn.addEventListener('click', () => {
      const task = taskInput.value.trim();
      const focusDuration = selectedMinutes * 60;
      const breakDuration = timerType === 'pomodoro' ? shortBreakMinutes * 60 : 0;
      
      timerController.setTimer(focusDuration, task, breakDuration, timerType === 'pomodoro' ? rounds : 1);
      this.closeModal();
    });
    
    // Show modal
    this.showModal(timerModal);
  },
  
  // Open background gallery modal
  openBackgroundModal() {
    // Clone modal template
    const backgroundModal = this.elements.backgroundModalTemplate.content.cloneNode(true);
    
    // Set up background toggle if applicable
    const soundBgToggle = backgroundModal.querySelector('#sound-background-toggle');
    const useSoundBgCheckbox = backgroundModal.querySelector('#use-sound-bg');
    
    if (!playerState.isMixMode && playerState.currentSound?.backgroundUrl) {
      soundBgToggle.classList.remove('hidden');
      useSoundBgCheckbox.checked = playerState.useBackgroundFromSound;
      
      useSoundBgCheckbox.addEventListener('change', () => {
        playerState.toggleUseBackgroundFromSound();
      });
    }
    
    // Populate background grid
    const backgroundGrid = backgroundModal.querySelector('#background-grid');
    
    backgroundImages.forEach(bg => {
      const bgItem = document.createElement('div');
      bgItem.className = 'background-item';
      bgItem.dataset.bgId = bg.id;
      
      if (bg.id === playerState.currentBackground.id && !playerState.useBackgroundFromSound) {
        bgItem.classList.add('active');
      }
      
      // Background image
      const img = document.createElement('img');
      img.src = bg.thumbnailUrl;
      img.alt = bg.name;
      bgItem.appendChild(img);
      
      // Background name
      const bgName = document.createElement('div');
      bgName.className = 'background-name';
      bgName.textContent = bg.name;
      bgItem.appendChild(bgName);
      
      // Click handler
      bgItem.addEventListener('click', () => {
        playerState.setBackground(bg);
        
        // Update active class
        document.querySelectorAll('.background-item').forEach(item => {
          item.classList.remove('active');
        });
        bgItem.classList.add('active');
      });
      
      backgroundGrid.appendChild(bgItem);
    });
    
    // Close button
    const closeBtn = backgroundModal.querySelector('.close-modal-btn');
    closeBtn.addEventListener('click', () => {
      this.closeModal();
    });
    
    // Show modal
    this.showModal(backgroundModal);
  },
  
  // Open explore drawer
  openExploreDrawer() {
    // Clone drawer template
    const exploreDrawer = this.elements.exploreDrawerTemplate.content.cloneNode(true);
    const drawer = exploreDrawer.querySelector('.drawer');
    
    // Set up close button
    const closeBtn = exploreDrawer.querySelector('.close-drawer-btn');
    closeBtn.addEventListener('click', () => {
      this.closeDrawer(drawer);
    });
    
    // Populate scenarios
    const scenariosList = exploreDrawer.querySelector('.scenarios-list');
    
    scenarios.forEach(scenario => {
      const scenarioBtn = document.createElement('button');
      scenarioBtn.className = 'scenario-btn';
      scenarioBtn.textContent = scenario.name;
      
      // In a full implementation, this would filter sounds
      scenarioBtn.addEventListener('click', () => {
        toast.info(`"${scenario.name}" scenario selected`);
      });
      
      scenariosList.appendChild(scenarioBtn);
    });
    
    // Populate sound categories
    const categoriesContainer = exploreDrawer.querySelector('.categories-container');
    
    soundCategories.forEach(category => {
      const categorySection = document.createElement('div');
      categorySection.className = 'category-section';
      
      const categoryTitle = document.createElement('h3');
      categoryTitle.className = 'section-title';
      categoryTitle.textContent = category;
      categorySection.appendChild(categoryTitle);
      
      const soundList = document.createElement('div');
      soundList.className = 'sound-list';
      
      // Filter sounds by category
      const categorySounds = sounds.filter(sound => sound.category === category);
      
      categorySounds.forEach(sound => {
        const soundItem = document.createElement('div');
        soundItem.className = 'sound-list-item';
        
        // Sound info
        const soundInfo = document.createElement('div');
        soundInfo.className = 'sound-info';
        
        const soundIconWrapper = document.createElement('div');
        soundIconWrapper.className = 'sound-info-icon';
        
        const iconElement = document.createElement('i');
        iconElement.className = `lucide-${sound.icon}`;
        soundIconWrapper.appendChild(iconElement);
        
        const soundName = document.createElement('span');
        soundName.textContent = sound.name;
        
        soundInfo.appendChild(soundIconWrapper);
        soundInfo.appendChild(soundName);
        
        // Play button
        const playBtn = document.createElement('button');
        playBtn.className = 'sound-play-btn';
        
        const isCurrentlyPlaying = playerState.isPlaying && 
          (playerState.isMixMode ? 
            playerState.activeSounds.some(s => s.id === sound.id) : 
            playerState.currentSound?.id === sound.id);
        
        const btnIcon = document.createElement('i');
        btnIcon.className = isCurrentlyPlaying ? 'lucide-arrow-right' : 'lucide-play';
        playBtn.appendChild(btnIcon);
        
        playBtn.addEventListener('click', () => {
          playerState.playSound(sound);
          this.closeDrawer(drawer);
        });
        
        // Append everything
        soundItem.appendChild(soundInfo);
        soundItem.appendChild(playBtn);
        soundList.appendChild(soundItem);
      });
      
      categorySection.appendChild(soundList);
      categoriesContainer.appendChild(categorySection);
    });
    
    // Show drawer
    this.showDrawer(exploreDrawer);
  },
  
  // Open settings drawer
  openSettingsDrawer() {
    // Clone drawer template
    const settingsDrawer = this.elements.settingsDrawerTemplate.content.cloneNode(true);
    const drawer = settingsDrawer.querySelector('.drawer');
    
    // Set up close button
    const closeBtn = drawer.querySelector('.drawer-header').appendChild(document.createElement('button'));
    closeBtn.className = 'close-drawer-btn';
    closeBtn.innerHTML = '<i class="lucide-x"></i>';
    closeBtn.addEventListener('click', () => {
      this.closeDrawer(drawer);
    });
    
    // Set up volume slider
    const volumeSlider = settingsDrawer.querySelector('#volume-slider');
    volumeSlider.value = playerState.volume;
    
    volumeSlider.addEventListener('input', (e) => {
      playerState.setVolume(parseFloat(e.target.value));
    });
    
    // Set up timer sound toggle
    const timerSoundToggle = settingsDrawer.querySelector('#timer-sound-toggle');
    timerSoundToggle.checked = playerState.timer.playSound !== false;
    
    timerSoundToggle.addEventListener('change', () => {
      timerController.updateTimerSettings({ playSound: timerSoundToggle.checked });
    });
    
    // Set up sound type radio buttons
    const soundTypeRadios = settingsDrawer.querySelectorAll('input[name="sound-type"]');
    soundTypeRadios.forEach(radio => {
      radio.checked = radio.value === (playerState.timer.soundType || 'beep');
      
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          timerController.updateTimerSettings({ soundType: e.target.value });
        }
      });
    });
    
    // Auto start toggle
    const autoStartToggle = settingsDrawer.querySelector('#auto-start-toggle');
    autoStartToggle.checked = playerState.timer.autoStart !== false;
    
    autoStartToggle.addEventListener('change', () => {
      timerController.updateTimerSettings({ autoStart: autoStartToggle.checked });
    });
    
    // Hide seconds toggle
    const hideSecondsToggle = settingsDrawer.querySelector('#hide-seconds-toggle');
    hideSecondsToggle.checked = playerState.timer.hideSeconds || false;
    
    hideSecondsToggle.addEventListener('change', () => {
      timerController.updateTimerSettings({ hideSeconds: hideSecondsToggle.checked });
    });
    
    // Notifications toggle
    const notificationsToggle = settingsDrawer.querySelector('#notifications-toggle');
    notificationsToggle.checked = playerState.timer.showNotifications || false;
    
    notificationsToggle.addEventListener('change', () => {
      if (notificationsToggle.checked) {
        notificationService.requestPermission().then(granted => {
          timerController.updateTimerSettings({ showNotifications: granted });
          if (!granted) {
            notificationsToggle.checked = false;
            toast.error('Notification permission denied');
          }
        });
      } else {
        timerController.updateTimerSettings({ showNotifications: false });
      }
    });
    
    // Show drawer
    this.showDrawer(settingsDrawer);
  },
  
  // Open mix drawer
  openMixDrawer() {
    // Clone drawer template
    const mixDrawer = this.elements.mixDrawerTemplate.content.cloneNode(true);
    const drawer = mixDrawer.querySelector('.drawer');
    
    // Set up close button
    const closeBtn = mixDrawer.querySelector('.close-drawer-btn');
    closeBtn.addEventListener('click', () => {
      this.closeDrawer(drawer);
    });
    
    // Set up saved mixes button
    const savedMixesBtn = mixDrawer.querySelector('#saved-mixes-btn');
    savedMixesBtn.addEventListener('click', () => {
      this.openSavedMixesModal();
    });
    
    // Set up save mix button
    const saveMixBtn = mixDrawer.querySelector('#save-mix-btn');
    saveMixBtn.addEventListener('click', () => {
      if (playerState.activeSounds.length === 0) {
        toast.error('No sounds to save');
        return;
      }
      
      const mixName = prompt('Enter a name for your mix', `Mix ${playerState.savedMixes.length + 1}`);
      if (mixName) {
        playerState.saveMix(mixName);
      }
    });
    
    // Render all sounds in a grid
    const mixSoundsGrid = mixDrawer.querySelector('#mix-sounds-grid');
    
    sounds.forEach(sound => {
      const mixTile = document.createElement('div');
      mixTile.className = 'mix-sound-tile';
      
      // Sound icon
      const mixTileIcon = document.createElement('div');
      mixTileIcon.className = 'mix-tile-icon';
      
      const isActive = playerState.activeSounds.some(s => s.id === sound.id);
      if (isActive) {
        mixTileIcon.classList.add('active');
      }
      
      const mixTileInner = document.createElement('div');
      mixTileInner.className = 'mix-tile-inner';
      
      const iconElement = document.createElement('i');
      iconElement.className = `lucide-${sound.icon}`;
      mixTileInner.appendChild(iconElement);
      mixTileIcon.appendChild(mixTileInner);
      
      // Click handler for icon
      mixTileIcon.addEventListener('click', () => {
        playerState.playSound(sound);
        
        // Update active state
        const isNowActive = playerState.activeSounds.some(s => s.id === sound.id);
        mixTileIcon.classList.toggle('active', isNowActive);
        
        // Show/hide volume slider
        volumeSlider.style.display = isNowActive ? 'block' : 'none';
      });
      
      // Sound name
      const mixTileName = document.createElement('div');
      mixTileName.className = 'mix-tile-name';
      mixTileName.textContent = sound.name;
      
      // Volume slider
      const volumeSlider = document.createElement('input');
      volumeSlider.type = 'range';
      volumeSlider.className = 'volume-slider';
      volumeSlider.min = '0';
      volumeSlider.max = '1';
      volumeSlider.step = '0.01';
      
      // Get volume for this sound if it's active
      const activeSound = playerState.activeSounds.find(s => s.id === sound.id);
      volumeSlider.value = activeSound ? activeSound.volume : playerState.volume;
      
      // Show volume slider only for active sounds
      const volumeWrapper = document.createElement('div');
      volumeWrapper.className = 'mix-tile-volume';
      volumeWrapper.style.display = isActive ? 'block' : 'none';
      
      volumeSlider.addEventListener('input', (e) => {
        playerState.updateSoundVolume(sound.id, parseFloat(e.target.value));
      });
      
      volumeWrapper.appendChild(volumeSlider);
      
      // Append all elements
      mixTile.appendChild(mixTileIcon);
      mixTile.appendChild(mixTileName);
      mixTile.appendChild(volumeWrapper);
      
      mixSoundsGrid.appendChild(mixTile);
    });
    
    // Show drawer
    this.showDrawer(mixDrawer);
  },
  
  // Open saved mixes modal
  openSavedMixesModal() {
    // Clone modal template
    const savedMixesModal = this.elements.savedMixesTemplate.content.cloneNode(true);
    const modal = savedMixesModal.querySelector('.modal');
    
    // Set up close button
    const closeBtn = modal.querySelector('.close-modal-btn');
    closeBtn.addEventListener('click', () => {
      this.closeModal();
    });
    
    // Populate saved mixes
    const savedMixesContainer = modal.querySelector('#saved-mixes-container');
    
    if (playerState.savedMixes.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <p>You haven't saved any mixes yet.</p>
        <p>Create a mix in Mix Mode and save it!</p>
      `;
      savedMixesContainer.appendChild(emptyState);
    } else {
      playerState.savedMixes.forEach(mix => {
        const mixItem = document.createElement('div');
        mixItem.className = 'saved-mix-item';
        mixItem.dataset.mixId = mix.id;
        
        const mixHeader = document.createElement('div');
        mixHeader.className = 'saved-mix-header';
        
        const mixInfo = document.createElement('div');
        const mixTitle = document.createElement('div');
        mixTitle.className = 'saved-mix-title';
        mixTitle.textContent = mix.name;
        
        const mixMeta = document.createElement('div');
        mixMeta.className = 'saved-mix-meta';
        
        // Format date
        const date = new Date(mix.createdAt);
        const formattedDate = date.toLocaleDateString();
        
        mixMeta.textContent = `${mix.sounds.length} sound${mix.sounds.length !== 1 ? 's' : ''} • ${formattedDate}`;
        
        mixInfo.appendChild(mixTitle);
        mixInfo.appendChild(mixMeta);
        
        // Mix actions
        const mixActions = document.createElement('div');
        mixActions.className = 'saved-mix-actions';
        
        // Share button
        const shareBtn = document.createElement('button');
        shareBtn.className = 'mix-action-btn';
        shareBtn.title = 'Share mix';
        shareBtn.innerHTML = '<i class="lucide-share-2"></i>';
        
        shareBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          playerState.shareMix(mix.id);
        });
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'mix-action-btn';
        deleteBtn.title = 'Delete mix';
        deleteBtn.innerHTML = '<i class="lucide-trash-2"></i>';
        
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`Delete mix "${mix.name}"?`)) {
            playerState.deleteMix(mix.id);
            mixItem.remove();
            
            // Show empty state if no mixes left
            if (playerState.savedMixes.length === 0) {
              const emptyState = document.createElement('div');
              emptyState.className = 'empty-state';
              emptyState.innerHTML = `
                <p>You haven't saved any mixes yet.</p>
                <p>Create a mix in Mix Mode and save it!</p>
              `;
              savedMixesContainer.appendChild(emptyState);
            }
          }
        });
        
        // Play button
        const playBtn = document.createElement('button');
        playBtn.className = 'mix-action-btn';
        playBtn.title = 'Play mix';
        playBtn.innerHTML = '<i class="lucide-play"></i>';
        
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          playerState.loadMix(mix.id);
          playerState.togglePlayPause();
          this.closeModal();
        });
        
        // Add buttons to actions
        mixActions.appendChild(shareBtn);
        mixActions.appendChild(deleteBtn);
        mixActions.appendChild(playBtn);
        
        // Complete the header
        mixHeader.appendChild(mixInfo);
        mixHeader.appendChild(mixActions);
        
        // Add header to mix item
        mixItem.appendChild(mixHeader);
        
        // Click handler for the whole item
        mixItem.addEventListener('click', () => {
          playerState.loadMix(mix.id);
          this.closeModal();
        });
        
        savedMixesContainer.appendChild(mixItem);
      });
    }
    
    // Show modal
    this.showModal(savedMixesModal);
  },
  
  // Show modal helper
  showModal(modalContent) {
    const container = this.elements.modalContainer;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Append new modal
    container.appendChild(modalContent);
    
    // Show the container
    container.classList.remove('hidden');
  },
  
  // Close modal helper
  closeModal() {
    this.elements.modalContainer.classList.add('hidden');
    
    // Clear after animation
    setTimeout(() => {
      this.elements.modalContainer.innerHTML = '';
    }, 300);
  },
  
  // Show drawer helper
  showDrawer(drawerContent) {
    const container = document.body;
    const drawer = drawerContent.querySelector('.drawer');
    
    // Append to body
    container.appendChild(drawerContent);
    
    // Add open class after a small delay to allow for animation
    setTimeout(() => {
      drawer.classList.add('open');
    }, 10);
  },
  
  // Close drawer helper
  closeDrawer(drawer) {
    // Remove open class
    drawer.classList.remove('open');
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (drawer.parentNode) {
        drawer.parentNode.removeChild(drawer);
      }
    }, 300);
  }
};

// Override updatePlayerUI from player.js
window.updatePlayerUI = () => {
  uiController.updatePlayerUI();
};

// Override updateTimerUI from timer.js
window.updateTimerUI = () => {
  uiController.updateTimerUI();
};
