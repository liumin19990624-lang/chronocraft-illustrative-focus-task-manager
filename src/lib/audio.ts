/**
 * Professional audio feedback utility for ChronoCraft
 */
type SoundEffect = 'ding' | 'success' | 'click';
const SOUNDS: Record<SoundEffect, string> = {
  // Using reliable high-quality public notification sounds
  ding: 'https://cdn.freesound.org/previews/242/242857_4413162-lq.mp3',
  success: 'https://cdn.freesound.org/previews/511/511484_10825368-lq.mp3',
  click: 'https://cdn.freesound.org/previews/256/256113_3263906-lq.mp3'
};
const audioCache: Record<string, HTMLAudioElement> = {};
export const playSound = (effect: SoundEffect) => {
  try {
    if (!audioCache[effect]) {
      audioCache[effect] = new Audio(SOUNDS[effect]);
      audioCache[effect].volume = 0.4;
    }
    // Reset sound to start if it's already playing
    audioCache[effect].currentTime = 0;
    const playPromise = audioCache[effect].play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Autoplay policy usually prevents sounds until first interaction
        console.warn("Audio playback blocked by browser:", error);
      });
    }
  } catch (err) {
    console.error("Failed to play sound effect:", err);
  }
};