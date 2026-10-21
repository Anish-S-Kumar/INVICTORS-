/**
 * Configuration for the Video Introduction
 */

export interface IntroVideoConfig {
  desktopSrc: string
  mobileSrc?: string
  posterSrc?: string
  hasAudio: boolean
  fit: "contain" | "cover"
  bufferTimeoutMs: number
  maxDurationMs: number
}

export const INTRO_CONFIG: IntroVideoConfig = {
  // Video.mp4 is available directly in /public/Video.mp4 or via the HTTP 206 streaming route /api/intro-video
  desktopSrc: "/api/intro-video",
  mobileSrc: undefined, // Will fallback to desktopSrc if undefined
  posterSrc: "/assets/invictors-logo.png", // High quality fallback poster
  hasAudio: true, // Show "Tap for sound" button if enabled
  fit: "contain",
  bufferTimeoutMs: 4000,
  maxDurationMs: 15000,
}
