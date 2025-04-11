
import { Sound, BackgroundImage, SoundCategory } from '@/types';

// Function to create a sound with default values
const createSound = (
  id: string, 
  name: string, 
  category: SoundCategory, 
  icon: string, 
  audio: string,
  isActive: boolean = false
): Sound => ({
  id,
  name,
  category,
  icon,
  audio,
  isActive
});

// Sound collection
export const sounds: Sound[] = [
  createSound('focus-1', 'Focus', 'Focus', 'grid', 'https://cdn.pixabay.com/download/audio/2021/10/25/audio_dafb863ed3.mp3?filename=ambient-piano-amp-strings-10711.mp3'),
  createSound('colored-noise', 'Colored Noises', 'Focus', 'circle-dot-dashed', 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3d73e2de0.mp3?filename=white-noise-10-min-22976.mp3'),
  createSound('dynamic-focus', 'Dynamic Focus', 'Focus', 'aperture', 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d16737d55c.mp3?filename=ambient-cinematic-background-music-21339.mp3'),
  createSound('study', 'Study', 'Focus', 'book-open', 'https://cdn.pixabay.com/download/audio/2022/04/20/audio_374cab6a9d.mp3?filename=study-music-25556.mp3'),
  createSound('deeper-focus', 'Deeper Focus', 'Focus', 'brain', 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_ef34d84af7.mp3?filename=cinematic-ambient-10566.mp3'),
  createSound('relax-1', 'Relax', 'Relax', 'circle', 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_d16325d61e.mp3?filename=gentle-ocean-waves-birdsong-and-gull-21879.mp3'),
  createSound('8d-odyssey', '8D Odyssey', 'Relax', 'infinity', 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1b8e5bc88d.mp3?filename=water-meditation-126120.mp3'),
  createSound('nature-elements', 'Nature Elements', 'Nature', 'leaf', 'https://cdn.pixabay.com/download/audio/2021/10/25/audio_ed33c93f85.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3'),
];

export const soundCategories: SoundCategory[] = ['Focus', 'Relax', 'Sleep', 'Nature'];

// Background images collection
export const backgroundImages: BackgroundImage[] = [
  {
    id: 'bg-starry-night',
    name: 'Starry Night',
    url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=2878',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=300'
  },
  {
    id: 'bg-forest-lights',
    name: 'Forest Lights',
    url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=2940',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=300'
  },
  {
    id: 'bg-lake-mountains',
    name: 'Lake Mountains',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2940',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300'
  },
  {
    id: 'bg-river-mountains',
    name: 'River Mountains',
    url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2940',
    thumbnailUrl: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=300'
  },
  {
    id: 'bg-foggy-mountain',
    name: 'Foggy Mountain',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2940',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=300'
  },
  {
    id: 'bg-geometric',
    name: 'Geometric',
    url: '/lovable-uploads/ba06eced-07c4-4c12-8184-7aa7950d6cb1.png',
    thumbnailUrl: '/lovable-uploads/ba06eced-07c4-4c12-8184-7aa7950d6cb1.png'
  }
];
