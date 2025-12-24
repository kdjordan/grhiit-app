// Audio utilities for workout timer
// TODO: Add bundled audio files and use expo-audio for playback

// For now, we'll use a simple flag to track if audio is enabled
// Real implementation will use bundled audio files
let audioEnabled = true;

/**
 * Initialize audio mode
 * Note: expo-audio handles this automatically
 */
export async function initializeAudio() {
  // expo-audio configures audio mode automatically
  audioEnabled = true;
}

/**
 * Play a beep sound for work phase start
 * TODO: Replace with bundled audio file
 */
export async function playWorkBeep() {
  if (!audioEnabled) return;

  // For now, log the beep - we'll add real audio files later
  console.log("🔴 WORK BEEP");

  // When you have bundled audio files, use:
  // const player = useAudioPlayer(require('@/assets/sounds/work-beep.mp3'));
  // player.play();
}

/**
 * Play a beep sound for rest phase start
 * TODO: Replace with bundled audio file
 */
export async function playRestBeep() {
  if (!audioEnabled) return;

  // For now, log the beep - we'll add real audio files later
  console.log("🟢 REST BEEP");
}

/**
 * Play countdown beeps (3, 2, 1)
 * TODO: Replace with bundled audio file
 */
export async function playCountdownBeep() {
  if (!audioEnabled) return;

  console.log("⏱️ COUNTDOWN BEEP");
}

/**
 * Cleanup audio resources
 */
export async function cleanupAudio() {
  // expo-audio handles cleanup automatically
}

/**
 * Disable audio (for testing)
 */
export function disableAudio() {
  audioEnabled = false;
}

/**
 * Enable audio
 */
export function enableAudio() {
  audioEnabled = true;
}
