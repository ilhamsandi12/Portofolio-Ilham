import { Easing, interpolate, spring } from 'remotion'

export const FPS = 30
export const DURATION = 360

export const CODE = [27, 8, 64]

// Frame tiap babak animasi
export const T = {
  enter: 0,
  dial: [50, 105, 155],
  dialLen: 40,
  unlock: 200,
  open: 238,
  outro: 300,
}

export const COLORS = {
  bg: '#06080b',
  steelDark: '#1b1f25',
  steel: '#3a414b',
  steelLight: '#8a94a3',
  gold: '#f5b942',
  goldDeep: '#b8801c',
  red: '#ff4d5a',
  green: '#3ddc97',
  text: '#e8ecf1',
  muted: '#7d8794',
}

// Sudut dial (derajat) supaya angka N tepat di bawah penunjuk atas
const angleFor = (n: number, turns: number) => ((360 - n * 3.6) % 360) + turns * 360

const DIAL_STOPS = [0, angleFor(CODE[0], 1), angleFor(CODE[1], 0), angleFor(CODE[2], 1)]

export const dialAngle = (frame: number, fps: number) =>
  T.dial.reduce((angle, start, i) => {
    const p = spring({ frame: frame - start, fps, durationInFrames: T.dialLen, config: { damping: 16, mass: 0.9 } })
    return angle + (DIAL_STOPS[i + 1] - DIAL_STOPS[i]) * p
  }, DIAL_STOPS[0])

export const dialNumber = (angle: number) => {
  const n = Math.round(-angle / 3.6) % 100
  return (n + 100) % 100
}

export const codeLocked = (frame: number, i: number) => frame >= T.dial[i] + T.dialLen - 6

export const unlockProgress = (frame: number, fps: number) =>
  spring({ frame: frame - T.unlock, fps, durationInFrames: 34, config: { damping: 200 } })

export const openProgress = (frame: number, fps: number) =>
  spring({ frame: frame - T.open, fps, durationInFrames: 60, config: { damping: 22, mass: 1.6 } })

export const fade = (frame: number, from: number, len = 15) =>
  interpolate(frame, [from, from + len], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
