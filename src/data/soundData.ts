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
  
  createSound('traffic', 'Traffic', 'Urban', 'car', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/traffic.mp3'),
  createSound('road', 'Road', 'Urban', 'road', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/road.mp3'),
  createSound('highway', 'Highway', 'Urban', 'route', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/highway.mp3'),
  createSound('fireworks', 'Fireworks', 'Urban', 'sparkles', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/fireworks.mp3'),
  createSound('crowd', 'Crowd', 'Urban', 'users', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/crowd.mp3'),
  createSound('street', 'Street', 'Urban', 'map-pin', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/busy-street.mp3'),
  createSound('ambulance', 'Ambulance Siren', 'Urban', 'siren', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/ambulance-siren.mp3'),
  
  createSound('train', 'Train', 'Transport', 'train', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/train.mp3'),
  createSound('submarine', 'Submarine', 'Transport', 'anchor', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/submarine.mp3'),
  createSound('sailboat', 'Sailboat', 'Transport', 'ship', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/sailboat.mp3'),
  createSound('rowing-boat', 'Rowing Boat', 'Transport', 'boat', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/rowing-boat.mp3'),
  createSound('inside-train', 'Inside a Train', 'Transport', 'train-front', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/inside-a-train.mp3'),
  createSound('airplane', 'Airplane', 'Transport', 'plane', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/airplane.mp3'),
  
  createSound('windshield-wipers', 'Windshield Wipers', 'Things', 'wind', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/windshield-wipers.mp3'),
  createSound('wind-chimes', 'Wind Chimes', 'Things', 'bell', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/wind-chimes.mp3'),
  createSound('washing-machine', 'Washing Machine', 'Things', 'circle-dot', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/washing-machine.mp3'),
  createSound('vinyl-effect', 'Vinyl Effect', 'Things', 'disc', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/vinyl-effect.mp3'),
  createSound('tuning-radio', 'Tuning Radio', 'Things', 'radio', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/tuning-radio.mp3'),
  createSound('slide-projector', 'Slide Projector', 'Things', 'projector', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/slide-projector.mp3'),
  createSound('singing-bowl', 'Singing Bowl', 'Things', 'bowl', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/singing-bowl.mp3'),
  createSound('paper', 'Paper', 'Things', 'file-text', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/paper.mp3'),
  createSound('keyboard', 'Keyboard', 'Things', 'keyboard', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/keyboard.mp3'),
  
  createSound('rain-on-leaves', 'Rain on Leaves', 'Rain', 'leaf', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-leaves.mp3'),
  createSound('rain-on-tent', 'Rain on Tent', 'Rain', 'tent', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-tent.mp3'),
  createSound('rain-on-umbrella', 'Rain on Umbrella', 'Rain', 'umbrella', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-umbrella.mp3'),
  createSound('rain-on-window', 'Rain on Window', 'Rain', 'cloud-rain', 'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-window.mp3'),
];

export const soundCategories: SoundCategory[] = ['Focus', 'Relax', 'Sleep', 'Nature', 'Urban', 'Transport', 'Things', 'Rain'];

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
