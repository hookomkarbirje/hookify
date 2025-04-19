
/**
 * Utility functions for the sound player
 */

// Toast notification system
const toast = {
  container: null,
  
  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },
  
  show(message, type = 'info', duration = 3000) {
    const toastElement = document.createElement('div');
    toastElement.className = `toast toast-${type}`;
    
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'lucide-check-circle' : 
                    type === 'error' ? 'lucide-alert-circle' : 'lucide-info';
    
    toastElement.appendChild(icon);
    toastElement.appendChild(document.createTextNode(message));
    
    this.container.appendChild(toastElement);
    
    // Remove toast after duration
    setTimeout(() => {
      toastElement.classList.add('closing');
      setTimeout(() => {
        if (toastElement.parentNode === this.container) {
          this.container.removeChild(toastElement);
        }
      }, 300); // Match animation duration
    }, duration);
    
    return toastElement;
  },
  
  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  },
  
  error(message, duration = 3000) {
    return this.show(message, 'error', duration);
  },
  
  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
};

// Cookie utilities
const cookies = {
  set(name, value, days = 30) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}${expires}; path=/`;
  },
  
  get(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = c.substring(nameEQ.length, c.length);
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  },
  
  delete(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

// Format time from seconds to MM:SS display
function formatTime(seconds, hideSeconds = false) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = hideSeconds ? 0 : Math.floor(seconds % 60);
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
}

// Sound utilities
function playTimerSound(type = 'beep') {
  const soundUrl = type === 'bell' 
    ? 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/bell-sound.mp3'
    : 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/beep-sound.mp3';
  
  const audio = new Audio(soundUrl);
  audio.volume = 0.8;
  audio.play().catch(error => console.error('Error playing timer sound:', error));
}

// Browser notification service
const notificationService = {
  async requestPermission() {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }
    
    if (Notification.permission === "granted") {
      return true;
    }
    
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    
    return false;
  },
  
  async showNotification(title, body) {
    const hasPermission = await this.requestPermission();
    
    if (hasPermission) {
      return new Notification(title, {
        body: body,
        icon: '/favicon.ico'
      });
    }
    
    return null;
  }
};

// Get share URL for mixes
function generateShareableUrl(mix) {
  // Convert mix to a base64 string to be included in URL
  const mixData = {
    sounds: mix.sounds,
    name: mix.name,
    autoPlay: true
  };
  
  const mixString = btoa(JSON.stringify(mixData));
  const url = new URL(window.location.href);
  url.searchParams.set('mix', mixString);
  
  return url.toString();
}

// Parse mix from URL
function parseMixFromUrl(mixParam) {
  try {
    const mixData = JSON.parse(atob(mixParam));
    return mixData;
  } catch (e) {
    console.error('Error parsing mix from URL:', e);
    return null;
  }
}

// Detect if user is on mobile
function isMobileDevice() {
  return window.innerWidth < 640 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Generate a random ID
function generateId() {
  return `_${Math.random().toString(36).substring(2, 11)}`;
}
