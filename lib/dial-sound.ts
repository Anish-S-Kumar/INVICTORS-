"use client"

/**
 * Web Audio API procedural sound engine for the Mobile Rotary Dial.
 * Synthesizes realistic mechanical knob ticks, detent thunks, and open chimes without audio assets.
 * 
 * Notes:
 * - iOS Safari obeys the hardware silent switch for Web Audio.
 * - Vibration API is not supported on iOS Safari; handled with graceful try/catch.
 */

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let compressor: DynamicsCompressorNode | null = null
let noiseBuffer: AudioBuffer | null = null

let isSoundMuted = false
let lastTickTime = 0
let ticksInCurrentFrame = 0
let lastFrameTime = 0

// Initialize AudioContext lazily on user gesture
export function initDialAudio(): boolean {
  if (typeof window === "undefined") return false

  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return false

      audioCtx = new AudioContextClass()

      // Dynamics compressor to prevent clipping
      compressor = audioCtx.createDynamicsCompressor()
      compressor.threshold.setValueAtTime(-12, audioCtx.currentTime)
      compressor.knee.setValueAtTime(30, audioCtx.currentTime)
      compressor.ratio.setValueAtTime(12, audioCtx.currentTime)
      compressor.attack.setValueAtTime(0.003, audioCtx.currentTime)
      compressor.release.setValueAtTime(0.15, audioCtx.currentTime)

      // Master gain
      masterGain = audioCtx.createGain()
      masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime)

      masterGain.connect(compressor)
      compressor.connect(audioCtx.destination)

      // Pre-generate 30ms white noise buffer for crisp mechanical ticks
      const sampleRate = audioCtx.sampleRate
      const bufferSize = Math.floor(sampleRate * 0.03) // 30ms
      noiseBuffer = audioCtx.createBuffer(1, bufferSize, sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      // Check persisted mute preference
      try {
        const savedMute = localStorage.getItem("invictors_dial_muted")
        isSoundMuted = savedMute === "true"
      } catch {
        // ignore
      }

      // Suspend audio when tab is hidden to save power
      document.addEventListener("visibilitychange", () => {
        if (!audioCtx) return
        if (document.hidden && audioCtx.state === "running") {
          audioCtx.suspend().catch(() => {})
        } else if (!document.hidden && audioCtx.state === "suspended") {
          audioCtx.resume().catch(() => {})
        }
      })
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {})
    }

    return true
  } catch {
    return false
  }
}

/**
 * Play a high-frequency mechanical tick when the dial passes a 10-degree mark.
 */
export function playDialTick(speed = 1): void {
  if (isSoundMuted || !initDialAudio() || !audioCtx || !masterGain || !noiseBuffer) return

  const now = performance.now()

  // Reset frame tick counter
  if (now - lastFrameTime > 20) {
    ticksInCurrentFrame = 0
    lastFrameTime = now
  }

  // Rate-limiting: at most 3 ticks per frame and at least 28ms between ticks
  if (ticksInCurrentFrame >= 3 || now - lastTickTime < 28) {
    return
  }

  lastTickTime = now
  ticksInCurrentFrame++

  try {
    const ctx = audioCtx
    const t = ctx.currentTime

    // White noise source
    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = noiseBuffer

    // Bandpass filter centered at 2400Hz - 3200Hz with high Q for metallic click
    const filter = ctx.createBiquadFilter()
    filter.type = "bandpass"
    const pitchJitter = 1 + (Math.random() * 0.08 - 0.04) // +-4% pitch jitter
    filter.frequency.setValueAtTime(2700 * pitchJitter, t)
    filter.Q.setValueAtTime(6.5, t)

    // Gain envelope with 12ms exponential decay
    const gainNode = ctx.createGain()
    const gainJitter = 1 + (Math.random() * 0.2 - 0.1) // +-10% gain jitter
    const speedBoost = Math.min(1.4, Math.max(0.8, Math.abs(speed)))
    const peakGain = 0.12 * gainJitter * speedBoost

    gainNode.gain.setValueAtTime(peakGain, t)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.015)

    noiseSource.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(masterGain)

    noiseSource.start(t)
    noiseSource.stop(t + 0.03)
  } catch {
    // Fail silently
  }
}

/**
 * Play a solid "thunk" when the dial settles onto a 60-degree item detent.
 */
export function playDialDetent(): void {
  // Always trigger haptics on detent if not muted
  if (!isSoundMuted) {
    try {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(6)
      }
    } catch {
      // ignore
    }
  }

  if (isSoundMuted || !initDialAudio() || !audioCtx || !masterGain) return

  try {
    const ctx = audioCtx
    const t = ctx.currentTime

    // Layer 1: Triangle oscillator gliding 220Hz -> 110Hz for weighty mechanical feel
    const osc = ctx.createOscillator()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(220, t)
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.07)

    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0.22, t)
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075)

    osc.connect(oscGain)
    oscGain.connect(masterGain)

    osc.start(t)
    osc.stop(t + 0.08)

    // Layer 2: Accompanying high tick for mechanical bite
    playDialTick(1.2)
  } catch {
    // Fail silently
  }
}

/**
 * Play a soft rising two-note chime when an action button opens a card.
 */
export function playOpenChime(): void {
  if (isSoundMuted || !initDialAudio() || !audioCtx || !masterGain) return

  try {
    const ctx = audioCtx
    const t = ctx.currentTime

    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator()
      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, startTime)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.15, startTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

      osc.connect(gain)
      gain.connect(masterGain!)

      osc.start(startTime)
      osc.stop(startTime + duration)
    }

    playNote(523.25, t, 0.18) // C5
    playNote(659.25, t + 0.09, 0.28) // E5
  } catch {
    // Fail silently
  }
}

/**
 * Mute / Unmute state management with localStorage persistence.
 */
export function setDialSoundMuted(muted: boolean): void {
  isSoundMuted = muted
  try {
    localStorage.setItem("invictors_dial_muted", String(muted))
  } catch {
    // ignore
  }
}

export function isDialSoundMuted(): boolean {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("invictors_dial_muted")
      if (saved !== null) {
        isSoundMuted = saved === "true"
      }
    } catch {
      // ignore
    }
  }
  return isSoundMuted
}
