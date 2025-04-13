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
  mode?: 'focus' | 'break'; // Current mode
  isPaused?: boolean; // Timer paused state
  task?: string; // What's getting done
  totalRounds?: number; // Total rounds to complete
  currentRound?: number; // Current round being worked on
  completed?: boolean; // Whether the timer has completed all rounds
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
}
