
// Timer sound effects
const timerSounds = {
  beep: "https://api.substack.com/feed/podcast/159247735/d47b8fa79d5b4c3e0171d2d1b0f50e48.mp3",
  bell: "https://api.substack.com/feed/podcast/159247735/d47b8fa79d5b4c3e0171d2d1b0f50e48.mp3" // Using same sound for now
};

// Cache audio elements
const audioCache: Record<string, HTMLAudioElement> = {};

export const playTimerSound = (sound: 'beep' | 'bell' = 'beep') => {
  if (!audioCache[sound]) {
    audioCache[sound] = new Audio(timerSounds[sound]);
  }
  
  try {
    audioCache[sound].currentTime = 0;
    audioCache[sound].play().catch(err => {
      console.error('Error playing timer sound:', err);
    });
  } catch (error) {
    console.error('Error playing timer sound:', error);
  }
};

export const stopTimerSound = (sound: 'beep' | 'bell' = 'beep') => {
  if (audioCache[sound]) {
    audioCache[sound].pause();
    audioCache[sound].currentTime = 0;
  }
};

// Browser notifications
export const showTimerNotification = (title: string, body: string) => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return;
  }
  
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
};
