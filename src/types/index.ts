
export interface Sound {
  id: string;
  name: string;
  category: SoundCategory;
  icon: string;
  audio: string;
  isActive?: boolean;
}

export type SoundCategory = 'Focus' | 'Relax' | 'Sleep' | 'Nature';

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
}

export interface PlayerState {
  isPlaying: boolean;
  isHidden: boolean;
  currentSound: Sound | null;
  timer: TimerConfig;
  currentBackground: BackgroundImage;
  volume: number;
}
