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
  
  // Initialize mix mode handler
  const mixParam = new URLSearchParams(window.location.search).get('mix');
  
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
            const soundWithVolume = { ...sound, volume: soundInfo.volume };
            playerState.activeSounds.push(soundWithVolume);
            
            const audioElement = playerState.audioElements.get(sound.id);
            if (audioElement) {
              audioElement.volume = soundInfo.volume;
              
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
    
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  // Initialize UI controller last
  uiController.init();
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
