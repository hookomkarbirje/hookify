
/**
 * Sound data structures and helper functions
 */

// Define sound categories
const soundCategories = ['Focus', 'Relax', 'Sleep', 'Nature', 'Urban', 'Transport', 'Things', 'Rain'];

// Define scenarios
const scenarios = [
  { name: "Attention Boost" },
  { name: "ASMR" },
  { name: "Binaural Beats" },
  { name: "Brain Massage" },
  { name: "Create" },
  { name: "Deep Work" },
  { name: "Self Care" },
  { name: "Read" },
  { name: "Power Nap" },
  { name: "Meditate" },
  { name: "Tinnitus Relief" },
];

// Create sound objects with helper function
const createSound = (
  id,
  name,
  category,
  icon,
  audio,
  imageUrl,
  backgroundUrl = null
) => ({
  id,
  name,
  category,
  icon,
  audio,
  imageUrl,
  backgroundUrl: backgroundUrl || imageUrl,
  isActive: false
});

// Sound collection
const sounds = [
  // Urban sounds
  createSound('traffic', 'Traffic', 'Urban', 'car', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/traffic.mp3',
    'https://images.unsplash.com/photo-1516410529446-2c777cb7366d?w=500&auto=format',
    'https://images.unsplash.com/photo-1516410529446-2c777cb7366d?w=1920&auto=format'),
  createSound('road', 'Road', 'Urban', 'road', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/road.mp3',
    'https://images.unsplash.com/photo-1536854150886-354a3260b988?w=500&auto=format',
    'https://images.unsplash.com/photo-1536854150886-354a3260b988?w=1920&auto=format'),
  createSound('highway', 'Highway', 'Urban', 'route', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/highway.mp3',
    'https://images.unsplash.com/photo-1471958680802-1345a694ba6d?w=500&auto=format',
    'https://images.unsplash.com/photo-1471958680802-1345a694ba6d?w=1920&auto=format'),
  createSound('fireworks', 'Fireworks', 'Urban', 'sparkles', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/fireworks.mp3',
    'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500&auto=format',
    'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1920&auto=format'),
  createSound('crowd', 'Crowd', 'Urban', 'users', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/crowd.mp3',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&auto=format',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&auto=format'),
  createSound('street', 'Street', 'Urban', 'map-pin', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/busy-street.mp3',
    'https://images.unsplash.com/photo-1522083091704-4b9da564bac0?w=500&auto=format',
    'https://images.unsplash.com/photo-1522083091704-4b9da564bac0?w=1920&auto=format'),
  createSound('ambulance', 'Ambulance Siren', 'Urban', 'siren', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/urban/ambulance-siren.mp3',
    'https://images.unsplash.com/photo-1550531996-ff3dcede9477?w=500&auto=format',
    'https://images.unsplash.com/photo-1550531996-ff3dcede9477?w=1920&auto=format'),
  
  // Transport sounds
  createSound('train', 'Train', 'Transport', 'train', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/train.mp3',
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500&auto=format',
    'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1920&auto=format'),
  createSound('submarine', 'Submarine', 'Transport', 'anchor', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/submarine.mp3',
    'https://images.unsplash.com/photo-1565963014686-8beb078aaae8?w=500&auto=format',
    'https://images.unsplash.com/photo-1565963014686-8beb078aaae8?w=1920&auto=format'),
  createSound('sailboat', 'Sailboat', 'Transport', 'ship', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/sailboat.mp3',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format'),
  createSound('rowing-boat', 'Rowing Boat', 'Transport', 'boat', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/rowing-boat.mp3',
    'https://images.unsplash.com/photo-1580158232593-693f55942e98?w=500&auto=format',
    'https://images.unsplash.com/photo-1580158232593-693f55942e98?w=1920&auto=format'),
  createSound('inside-train', 'Inside a Train', 'Transport', 'train-front', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/inside-a-train.mp3',
    'https://images.unsplash.com/photo-1553409522-77e1b85d33e5?w=500&auto=format',
    'https://images.unsplash.com/photo-1553409522-77e1b85d33e5?w=1920&auto=format'),
  createSound('airplane', 'Airplane', 'Transport', 'plane', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/transport/airplane.mp3',
    'https://images.unsplash.com/photo-1534422646206-2fa45f83fa41?w=500&auto=format',
    'https://images.unsplash.com/photo-1534422646206-2fa45f83fa41?w=1920&auto=format'),
  
  // Things sounds
  createSound('windshield-wipers', 'Windshield Wipers', 'Things', 'wind', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/windshield-wipers.mp3',
    'https://images.unsplash.com/photo-1575581571306-7b5017f9c503?w=500&auto=format',
    'https://images.unsplash.com/photo-1575581571306-7b5017f9c503?w=1920&auto=format'),
  createSound('wind-chimes', 'Wind Chimes', 'Things', 'bell', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/wind-chimes.mp3',
    'https://images.unsplash.com/photo-1598519502158-282d2ba40e19?w=500&auto=format',
    'https://images.unsplash.com/photo-1598519502158-282d2ba40e19?w=1920&auto=format'),
  createSound('washing-machine', 'Washing Machine', 'Things', 'circle-dot', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/washing-machine.mp3',
    'https://images.unsplash.com/photo-1585575141647-c2c436949714?w=500&auto=format',
    'https://images.unsplash.com/photo-1585575141647-c2c436949714?w=1920&auto=format'),
  createSound('vinyl-effect', 'Vinyl Effect', 'Things', 'disc', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/vinyl-effect.mp3',
    'https://images.unsplash.com/photo-1585575141650-29658d49e393?w=500&auto=format',
    'https://images.unsplash.com/photo-1585575141650-29658d49e393?w=1920&auto=format'),
  createSound('tuning-radio', 'Tuning Radio', 'Things', 'radio', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/tuning-radio.mp3',
    'https://images.unsplash.com/photo-1593078165899-c7d2ac0d6aea?w=500&auto=format',
    'https://images.unsplash.com/photo-1593078165899-c7d2ac0d6aea?w=1920&auto=format'),
  createSound('slide-projector', 'Slide Projector', 'Things', 'projector', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/slide-projector.mp3',
    'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=500&auto=format',
    'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=1920&auto=format'),
  createSound('singing-bowl', 'Singing Bowl', 'Things', 'bowl', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/singing-bowl.mp3',
    'https://images.unsplash.com/photo-1602177879433-be86170fe2fb?w=500&auto=format',
    'https://images.unsplash.com/photo-1602177879433-be86170fe2fb?w=1920&auto=format'),
  createSound('paper', 'Paper', 'Things', 'file-text', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/paper.mp3',
    'https://images.unsplash.com/photo-1586074299757-dc655f18518c?w=500&auto=format',
    'https://images.unsplash.com/photo-1586074299757-dc655f18518c?w=1920&auto=format'),
  createSound('keyboard', 'Keyboard', 'Things', 'keyboard', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/things/keyboard.mp3',
    'https://images.unsplash.com/photo-1563191911-e65f8655ebf9?w=500&auto=format',
    'https://images.unsplash.com/photo-1563191911-e65f8655ebf9?w=1920&auto=format'),
  
  // Rain sounds
  createSound('rain-on-leaves', 'Rain on Leaves', 'Rain', 'leaf', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-leaves.mp3',
    'https://images.unsplash.com/photo-1519692933481-e8ef74ad3eb1?w=500&auto=format',
    'https://images.unsplash.com/photo-1519692933481-e8ef74ad3eb1?w=1920&auto=format'),
  createSound('rain-on-tent', 'Rain on Tent', 'Rain', 'tent', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-tent.mp3',
    'https://images.unsplash.com/photo-1478827387698-1527781a4887?w=500&auto=format',
    'https://images.unsplash.com/photo-1478827387698-1527781a4887?w=1920&auto=format'),
  createSound('rain-on-umbrella', 'Rain on Umbrella', 'Rain', 'umbrella', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-umbrella.mp3',
    'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=500&auto=format',
    'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1920&auto=format'),
  createSound('rain-on-window', 'Rain on Window', 'Rain', 'cloud-rain', 
    'https://cdn.jsdelivr.net/gh/lofidot/moodist@main/public/sounds/rain/rain-on-window.mp3',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500&auto=format',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&auto=format'),
];

// Background image collection
const backgroundImages = [
  {
    id: 'bg-starry-night',
    name: 'Starry Night',
    url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=2878',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=300',
    isDefault: true
  },
  {
    id: 'bg-forest-lights',
    name: 'Forest Lights',
    url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=2940',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=300',
    isDefault: true
  },
  {
    id: 'bg-lake-mountains',
    name: 'Lake Mountains',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2940',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300',
    isDefault: true
  },
  {
    id: 'bg-river-mountains',
    name: 'River Mountains',
    url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=2940',
    thumbnailUrl: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=300',
    isDefault: true
  },
  {
    id: 'bg-foggy-mountain',
    name: 'Foggy Mountain',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2940',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=300',
    isDefault: true
  },
  {
    id: 'bg-geometric',
    name: 'Geometric',
    url: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?q=80&w=2940',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?q=80&w=300',
    isDefault: true
  }
];
