
import { SavedMix, SoundMixItem } from '@/types';

/**
 * Generates a shareable URL with the mix data encoded
 */
export const generateShareableUrl = (mix: SavedMix): string => {
  // Create a simplified object with just the necessary data
  const mixData = {
    n: mix.name,
    s: mix.sounds.map(sound => ({
      i: sound.id,
      v: Math.round(sound.volume * 100) / 100
    })),
    b: mix.backgroundId
  };
  
  // Convert to base64
  const encodedData = btoa(JSON.stringify(mixData));
  
  // Create URL with the encoded mix as a parameter
  const url = new URL(window.location.href);
  url.searchParams.set('mix', encodedData);
  
  return url.toString();
};

/**
 * Parses a mix from the encoded URL parameter
 */
export const parseMixFromUrl = (encodedMix: string): SavedMix | null => {
  try {
    // Decode from base64
    const decodedData = atob(encodedMix);
    const mixData = JSON.parse(decodedData);
    
    // Convert back to SavedMix format
    return {
      id: `shared_${Date.now().toString(36)}`,
      name: mixData.n || 'Shared Mix',
      sounds: mixData.s.map((s: any) => ({
        id: s.i,
        volume: s.v
      })),
      createdAt: new Date().toISOString(),
      backgroundId: mixData.b
    };
  } catch (error) {
    console.error('Error parsing mix from URL:', error);
    return null;
  }
};
