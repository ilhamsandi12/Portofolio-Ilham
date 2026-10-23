import React from 'react'
import { spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { ramp } from './anim'
import { C, HAND, SERIF } from './theme'

type From = 'scale' | 'bottom' | 'top' | 'left' | 'right' | 'slam'

type PopProps = {
  at: number
  x: number
  y: number
  rotate?: number
  from?: From
  exitAt?: number
  shadow?: boolean
  style?: React.CSSProperties
  children: React.ReactNode
}

// Potongan kertas yang "ditempel" ke layar: masuk dengan pegas, keluar dengan fade
export const Pop = ({ at, x, y, rotate = 0, from = 'scale', exitAt, shadow = true, style, children }: PopProps) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  if (frame < at) return null
  const s = spring({ frame: frame - at, fps, config: from === 'slam' ? { damping: 12, mass: 0.6 } : { damping: 14, mass: 0.8 } })
  const out = exitAt === undefined ? 0 : ramp(frame, exitAt, 8)
  if (out >= 1) return null
  const off = 1 - s
  const t = frame - at
  const floatY = Math.sin(t / 22 + x * 0.01) * 7
  const floatR = Math.sin(t / 31 + y * 0.01) * 1.4
  const dx = from === 'left' ? -1100 * off : from === 'right' ? 1100 * off : 0
  const dy = from === 'bottom' ? 1300 * off : from === 'top' ? -1300 * off : 0
  const sc = from === 'scale' ? 0.3 + 0.7 * s : from === 'slam' ? 1 + 0.9 * off : 1
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: Math.min(1, s * 3) * (1 - out),
        transform: `translate(-50%, -50%) translate(${dx}px, ${dy + floatY}px) rotate(${rotate + floatR + off * (from === 'scale' ? -14 : 6)}deg) scale(${sc * (1 - out * 0.1)})`,
        filter: shadow ? 'drop-shadow(0 22px 26px rgba(0,0,0,0.45))' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

type LineProps = {
  text: string
  at: number
  y: number
  size: number
  x?: number
  italic?: boolean
  weight?: number
  color?: string
  exitAt?: number
  tracking?: number
}

// Satu baris tipografi editorial yang naik dari balik masker
export const Line = ({ text, at, y, size, x = 540, italic, weight = 800, color = C.cream, exitAt, tracking = 0 }: LineProps) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  if (frame < at) return null
  const s = spring({ frame: frame - at, fps, config: { damping: 16, mass: 0.7 } })
  const out = exitAt === undefined ? 0 : ramp(frame, exitAt, 8)
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        overflow: 'hidden',
        padding: `0 ${size * 0.15}px ${size * 0.12}px`,
        opacity: 1 - out,
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: italic ? 'italic' : 'normal',
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1.05,
          letterSpacing: tracking,
          color,
          whiteSpace: 'nowrap',
          transform: `translateY(${(1 - s) * 110}%) translateY(${-out * 40}px)`,
        }}
      >
        {text}
      </div>
    </div>
  )
}

export const Hand = ({ children, size = 64, color = C.cream, rotate = -4 }: { children: React.ReactNode; size?: number; color?: string; rotate?: number }) => (
  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, color, lineHeight: 1, whiteSpace: 'nowrap', transform: `rotate(${rotate}deg)` }}>
    {children}
  </div>
)

// Label stempel: kotak bergaris dengan huruf serif kapital
export const Stamp = ({ children, color = C.red, size = 40 }: { children: React.ReactNode; color?: string; size?: number }) => (
  <div
    style={{
      fontFamily: SERIF,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: size * 0.12,
      color,
      border: `${Math.max(3, size / 9)}px solid ${color}`,
      padding: `${size * 0.15}px ${size * 0.4}px`,
      borderRadius: 6,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      mixBlendMode: 'normal',
    }}
  >
    {children}
  </div>
)

export const Tape = ({ w = 150, rotate = -20 }: { w?: number; rotate?: number }) => (
  <div style={{ width: w, height: w * 0.32, background: 'rgba(239,230,210,0.72)', transform: `rotate(${rotate}deg)`, boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
)
