
/**
 * Timer functionality module
 */

// Timer interval reference
let timerInterval = null;

// Timer functionality
const timerController = {
  init() {
    // Initialize timer from saved preferences if any
    this.loadTimerPreferences();
  },
  
  // Load timer preferences from localStorage
  loadTimerPreferences() {
    const timerSettings = localStorage.getItem('timerSettings');
    if (timerSettings) {
      try {
        const settings = JSON.parse(timerSettings);
        playerState.timer = { ...playerState.timer, ...settings };
      } catch (e) {
        console.error('Error parsing timer settings:', e);
      }
    }
  },
  
  // Save timer preferences to localStorage
  saveTimerPreferences() {
    const settings = {
      hideSeconds: playerState.timer.hideSeconds,
      playSound: playerState.timer.playSound,
      soundType: playerState.timer.soundType,
      autoStart: playerState.timer.autoStart,
      showNotifications: playerState.timer.showNotifications
    };
    
    localStorage.setItem('timerSettings', JSON.stringify(settings));
  },
  
  // Update timer settings
  updateTimerSettings(settings) {
    playerState.timer = { ...playerState.timer, ...settings };
    this.saveTimerPreferences();
    updateTimerUI();
  },
  
  // Set a new timer
  setTimer(duration, task = "", breakDuration = 0, rounds = 1) {
    // Clear any existing timer
    this.cancelTimer();
    
    playerState.timer.isActive = true;
    playerState.timer.duration = duration;
    playerState.timer.remaining = duration;
    playerState.timer.breakDuration = breakDuration;
    playerState.timer.totalRounds = rounds;
    playerState.timer.currentRound = 0;
    playerState.timer.completedRounds = 0;
    playerState.timer.mode = 'focus';
    playerState.timer.isPaused = false;
    playerState.timer.task = task;
    
    // Start the timer countdown
    this.startTimerCountdown();
    
    // Update UI
    updateTimerUI();
    
    const roundsLabel = rounds > 1 ? `${rounds} rounds` : '1 round';
    const breakInfo = breakDuration > 0 ? `, ${Math.floor(breakDuration / 60)} min break` : '';
    toast.success(`Timer set for ${Math.floor(duration / 60)} min focus${breakInfo}, ${roundsLabel}`);
  },
  
  // Start timer countdown
  startTimerCountdown() {
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
      if (playerState.timer.isPaused) {
        return;
      }
      
      const remaining = playerState.timer.remaining - 1;
      
      if (remaining <= 0) {
        // Timer finished
        if (playerState.timer.playSound) {
          playTimerSound(playerState.timer.soundType || 'beep');
        }
        
        if (playerState.timer.showNotifications) {
          const mode = playerState.timer.mode === 'focus' ? 'Focus' : 'Break';
          notificationService.showNotification(
            `${mode} time is up!`, 
            `Your ${mode.toLowerCase()} time has ended.`
          );
        }
        
        // Handle rounds and breaks
        if (playerState.timer.mode === 'focus' && playerState.timer.breakDuration > 0) {
          // Switch to break mode
          playerState.timer.mode = 'break';
          playerState.timer.remaining = playerState.timer.breakDuration;
        } else if (playerState.timer.mode === 'break') {
          // Completed a full round
          playerState.timer.completedRounds++;
          playerState.timer.currentRound++;
          
          // Check if all rounds are completed
          if (playerState.timer.currentRound >= playerState.timer.totalRounds) {
            // All rounds completed
            clearInterval(timerInterval);
            playerState.timer.isActive = false;
            playerState.timer.remaining = 0;
          } else {
            // Start next round
            playerState.timer.mode = 'focus';
            playerState.timer.remaining = playerState.timer.duration;
          }
        } else {
          // Simple timer with no breaks, just end it
          clearInterval(timerInterval);
          playerState.timer.isActive = false;
          playerState.timer.remaining = 0;
        }
      } else {
        // Just update the remaining time
        playerState.timer.remaining = remaining;
      }
      
      // Update UI
      updateTimerUI();
      
    }, 1000);
  },
  
  // Cancel the current timer
  cancelTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    const oldSettings = {
      playSound: playerState.timer.playSound,
      soundType: playerState.timer.soundType,
      hideSeconds: playerState.timer.hideSeconds,
      autoStart: playerState.timer.autoStart,
      showNotifications: playerState.timer.showNotifications
    };
    
    // Reset timer state
    playerState.timer = {
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
      // Preserve settings
      ...oldSettings
    };
    
    // Update UI
    updateTimerUI();
    
    toast.info('Timer canceled');
  },
  
  // Reset the current timer or change mode
  resetTimer(mode) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    if (mode) {
      // Switch to specified mode
      playerState.timer.mode = mode;
      playerState.timer.remaining = mode === 'focus' ? 
        playerState.timer.duration : playerState.timer.breakDuration;
      playerState.timer.isPaused = false;
      
      // Start countdown
      this.startTimerCountdown();
      
      toast.info(`Switched to ${mode} timer`);
    } else if (playerState.timer.duration > 0) {
      // Reset to beginning
      playerState.timer.remaining = playerState.timer.duration;
      playerState.timer.mode = 'focus';
      playerState.timer.isPaused = false;
      playerState.timer.currentRound = 0;
      playerState.timer.completedRounds = 0;
      
      // Start countdown
      this.startTimerCountdown();
      
      toast.info('Timer reset');
    }
    
    // Update UI
    updateTimerUI();
  },
  
  // Pause or resume the timer
  pauseResumeTimer() {
    if (!playerState.timer.isActive) return;
    
    playerState.timer.isPaused = !playerState.timer.isPaused;
    
    toast.info(playerState.timer.isPaused ? 'Timer paused' : 'Timer resumed');
    
    // Update UI
    updateTimerUI();
  },
  
  // Add minutes to the current timer
  addMinutesToTimer(minutes) {
    if (!playerState.timer.isActive) return;
    
    playerState.timer.remaining += (minutes * 60);
    
    // Update UI
    updateTimerUI();
    
    toast.success(`Added ${minutes} minutes to timer`);
  }
};

// Function to be implemented in ui.js to update the timer interface
function updateTimerUI() {
  // This will be implemented in ui.js
  // It's declared here to avoid errors
}
