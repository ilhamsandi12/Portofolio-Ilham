import { Easing, interpolate } from 'remotion'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

export const ramp = (frame: number, from: number, len = 12, ease = Easing.out(Easing.cubic)) =>
  interpolate(frame, [from, from + len], [0, 1], { ...clamp, easing: ease })

export const between = (frame: number, a: number, b: number, len = 8) =>
  Math.min(ramp(frame, a, len), 1 - ramp(frame, b, len))

// Getaran kamera: makin lama makin reda
export const shake = (frame: number, start: number, len: number, amp: number) => {
  if (frame < start || frame > start + len) return { x: 0, y: 0 }
  const k = amp * (1 - (frame - start) / len)
  return { x: Math.sin(frame * 2.7) * k, y: Math.cos(frame * 3.3) * k }
}
