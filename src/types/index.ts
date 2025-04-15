
export interface Sound {
  id: string;
  name: string;
  category: SoundCategory;
  icon: string;
  audio: string;
  isActive?: boolean;
  volume?: number; // Individual sound volume
  imageUrl?: string; // Small thumbnail for sound card
  backgroundUrl?: string; // High-resolution image for background
}

export type SoundCategory = 'Focus' | 'Relax' | 'Sleep' | 'Nature' | 'Urban' | 'Transport' | 'Things' | 'Rain';

export interface BackgroundImage {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  isDefault?: boolean; // Indicates if this is a user-selected background
}

export interface TimerConfig {
  isActive: boolean;
  duration: number; // in seconds (focus time)
  remaining: number; // in seconds
  breakDuration?: number; // in seconds (break time)
  totalRounds: number; // Total number of rounds
  currentRound: number; // Current round (0-indexed)
  completedRounds: number; // Number of completed rounds
  mode?: 'focus' | 'break'; // Current mode
  isPaused?: boolean; // Timer paused state
  task?: string; // What's getting done
  hideSeconds?: boolean; // Whether to hide seconds in the display
  playSound?: boolean; // Whether to play a sound when timer ends
  soundType?: 'beep' | 'bell'; // Which sound to play
  autoStart?: boolean; // Whether to auto-start the next timer
  showNotifications?: boolean; // Whether to show browser notifications
}

export interface SoundMixItem {
  id: string;
  volume: number;
}

export interface SavedMix {
  id: string;
  name: string;
  sounds: SoundMixItem[];
  createdAt: string;
  backgroundId?: string;
  autoPlay?: boolean; // Flag to indicate if mix should auto-play when loaded
}

export interface PlayerState {
  isPlaying: boolean;
  isHidden: boolean;
  currentSound: Sound | null;
  activeSounds: Sound[]; // Multiple active sounds
  isMixMode: boolean; // Toggle for mix mode
  timer: TimerConfig;
  currentBackground: BackgroundImage;
  volume: number; // Master volume
  useBackgroundFromSound: boolean; // Whether to use sound's background image
  savedMixes: SavedMix[]; // User's saved mixes
}
