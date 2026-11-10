"use client"

/**
 * Web Audio API procedural sound engine for the Mobile Rotary Dial.
 * Synthesizes realistic mechanical knob ticks, detent thunks, and open chimes without audio assets.
 * 
 * Note: Dial noise is disabled as per user specification. Functions return silently.
 */

let isSoundMuted = true

// Initialize AudioContext lazily on user gesture
export function initDialAudio(): boolean {
  return false
}

/**
 * Play a high-frequency mechanical tick when the dial passes a 10-degree mark.
 * (Disabled for silent mobile dial experience)
 */
export function playDialTick(_speed = 1): void {
  // Silent - dial sound disabled
}

/**
 * Play a solid "thunk" when the dial settles onto a 60-degree item detent.
 * (Disabled for silent mobile dial experience)
 */
export function playDialDetent(): void {
  // Silent - dial sound disabled
}

/**
 * Play a soft rising two-note chime when an action button opens a card.
 * (Disabled for silent mobile dial experience)
 */
export function playOpenChime(): void {
  // Silent - dial sound disabled
}

/**
 * Mute / Unmute state management with localStorage persistence.
 */
export function setDialSoundMuted(_muted: boolean): void {
  isSoundMuted = true
}

export function isDialSoundMuted(): boolean {
  return true
}
