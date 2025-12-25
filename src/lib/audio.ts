// Audio utilities for workout timer
import { createAudioPlayer, AudioPlayer } from "expo-audio";

// Audio player reference
let beepPlayer: AudioPlayer | null = null;
let audioEnabled = true;

// Sound source
const beepSource = require("../../assets/sounds/single-beep.wav");

/**
 * Initialize audio - create the player
 */
export async function initializeAudio() {
  try {
    beepPlayer = createAudioPlayer(beepSource);
    audioEnabled = true;
  } catch (error) {
    console.warn("Failed to initialize audio:", error);
    audioEnabled = false;
  }
}

/**
 * Play beep sound once
 */
async function playBeep() {
  if (!audioEnabled || !beepPlayer) return;

  try {
    beepPlayer.seekTo(0);
    beepPlayer.play();
  } catch (error) {
    console.warn("Failed to play beep:", error);
  }
}

/**
 * Play beep multiple times with delay
 */
async function playBeepMultiple(times: number, delayMs: number = 150) {
  for (let i = 0; i < times; i++) {
    await playBeep();
    if (i < times - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Play beep for work phase start (single beep)
 */
export async function playWorkBeep() {
  await playBeep();
}

/**
 * Play beep for rest phase start (single beep)
 */
export async function playRestBeep() {
  await playBeep();
}

/**
 * Play countdown beep (single beep)
 */
export async function playCountdownBeep() {
  await playBeep();
}

/**
 * Play beep for block completion (5 beeps)
 */
export async function playBlockCompleteBeep() {
  await playBeepMultiple(5, 150);
}

/**
 * Cleanup audio resources
 */
export async function cleanupAudio() {
  if (beepPlayer) {
    beepPlayer.remove();
    beepPlayer = null;
  }
}

/**
 * Disable audio
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
