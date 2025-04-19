/**
 * Main application entry point
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize toast system
  toast.init();
  
  // Initialize player state
  playerState.init();
  
  // Initialize timer controller
  timerController.init();
  
  // Initialize UI controller last, after all other systems are ready
  uiController.init();
  
  // Check for URL parameters (e.g., for shared mixes)
  const urlParams = new URLSearchParams(window.location.search);
  const mixParam = urlParams.get('mix');
  
  if (mixParam) {
    try {
      const mixData = parseMixFromUrl(mixParam);
      if (mixData && mixData.sounds.length > 0) {
        // Enable mix mode
        if (!playerState.isMixMode) {
          playerState.toggleMixMode();
        }
        
        // Add each sound
        mixData.sounds.forEach(soundInfo => {
          const sound = sounds.find(s => s.id === soundInfo.id);
          if (sound) {
            // Create a modified sound with the stored volume
            const soundWithVolume = { ...sound, volume: soundInfo.volume };
            
            // Add to active sounds
            playerState.activeSounds.push(soundWithVolume);
            
            // Set the audio element's volume
            const audioElement = playerState.audioElements.get(sound.id);
            if (audioElement) {
              audioElement.volume = soundInfo.volume;
              
              // Play if autoPlay is true
              if (mixData.autoPlay) {
                audioElement.play().catch(console.error);
                playerState.isPlaying = true;
              }
            }
          }
        });
        
        // Update UI
        updatePlayerUI();
        
        toast.success("Mix loaded from shared link!");
      }
    } catch (e) {
      console.error('Error loading mix from URL:', e);
      toast.error('Could not load the shared mix');
    }
    
    // Clean up URL to prevent repeated loading
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Page is visible again, check if we need to refresh any UI
    updatePlayerUI();
  }
});

// Prevent accidental navigation away if sounds are playing
window.addEventListener('beforeunload', (event) => {
  if (playerState.isPlaying) {
    event.preventDefault();
    event.returnValue = 'You have sounds playing. Are you sure you want to leave?';
    return event.returnValue;
  }
});
