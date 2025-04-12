
export interface Sound {
  id: string;
  name: string;
  category: SoundCategory;
  icon: string;
  audio: string;
  isActive?: boolean;
  volume?: number; // Individual sound volume
}

export type SoundCategory = 'Focus' | 'Relax' | 'Sleep' | 'Nature' | 'Urban' | 'Transport' | 'Things' | 'Rain';

export interface BackgroundImage {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
}

export interface TimerConfig {
  isActive: boolean;
  duration: number; // in seconds
  remaining: number; // in seconds
  task?: string; // Added task property for storing what's getting done
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
}
