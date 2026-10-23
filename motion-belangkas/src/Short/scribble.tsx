import { random } from 'remotion'
import { C } from './theme'

// Coretan tangan yang "digambar" sesuai progress p (0..1). Filter #chalk didefinisikan di Film.tsx
type Base = { p: number; color?: string; sw?: number }

const stroke = (p: number, color: string, sw: number) => ({
  fill: 'none',
  stroke: color,
  strokeWidth: sw,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - Math.max(0, Math.min(1, p)),
  filter: 'url(#chalk)',
})

export const ScribbleCircle = ({ w, h, p, color = C.red, sw = 8, seed = 'c' }: Base & { w: number; h: number; seed?: string }) => {
  const pts: string[] = []
  const turns = 1.18
  for (let i = 0; i <= 64; i++) {
    const a = -Math.PI / 2 - 0.3 + (i / 64) * Math.PI * 2 * turns
    const wob = 1 + (random(`${seed}${i % 9}`) - 0.5) * 0.06 + i * 0.0009
    pts.push(`${(w / 2 + Math.cos(a) * (w / 2 - sw) * wob).toFixed(1)} ${(h / 2 + Math.sin(a) * (h / 2 - sw) * wob).toFixed(1)}`)
  }
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <path d={`M${pts.join(' L')}`} {...stroke(p, color, sw)} />
    </svg>
  )
}

export const ScribbleCross = ({ size, p, color = C.red, sw = 12 }: Base & { size: number }) => (
  <svg width={size} height={size} style={{ overflow: 'visible' }}>
    <path d={`M${size * 0.08} ${size * 0.12} Q${size * 0.5} ${size * 0.45} ${size * 0.92} ${size * 0.9}`} {...stroke(p * 2, color, sw)} />
    <path d={`M${size * 0.9} ${size * 0.1} Q${size * 0.48} ${size * 0.52} ${size * 0.1} ${size * 0.88}`} {...stroke(p * 2 - 1, color, sw)} />
  </svg>
)

export const ScribbleCheck = ({ size, p, color = C.cream, sw = 12 }: Base & { size: number }) => (
  <svg width={size} height={size} style={{ overflow: 'visible' }}>
    <path d={`M${size * 0.08} ${size * 0.55} L${size * 0.38} ${size * 0.85} L${size * 0.95} ${size * 0.1}`} {...stroke(p, color, sw)} />
  </svg>
)

export const ScribbleUnderline = ({ w, p, color = C.red, sw = 9 }: Base & { w: number }) => (
  <svg width={w} height={40} style={{ overflow: 'visible' }}>
    <path d={`M4 24 C${w * 0.3} 10 ${w * 0.6} 30 ${w - 4} 14 M${w * 0.15} 34 C${w * 0.45} 22 ${w * 0.7} 36 ${w * 0.9} 28`} {...stroke(p, color, sw)} />
  </svg>
)

// Panah melengkung dari (x1,y1) ke (x2,y2) dalam kanvas w×h
export const ScribbleArrow = ({ w, h, x1, y1, x2, y2, bend = 0.3, p, color = C.cream, sw = 7 }: Base & { w: number; h: number; x1: number; y1: number; x2: number; y2: number; bend?: number }) => {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend
  const my = (y1 + y2) / 2 + (x2 - x1) * bend
  const ang = Math.atan2(y2 - my, x2 - mx)
  const head = 30
  const h1 = `${x2 - Math.cos(ang - 0.5) * head} ${y2 - Math.sin(ang - 0.5) * head}`
  const h2 = `${x2 - Math.cos(ang + 0.5) * head} ${y2 - Math.sin(ang + 0.5) * head}`
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} {...stroke(p * 1.25, color, sw)} />
      <path d={`M${h1} L${x2} ${y2} L${h2}`} {...stroke((p - 0.8) * 5, color, sw)} />
    </svg>
  )
}

// Garis kapur lurus/lengkung bebas (untuk pohon evolusi)
export const ChalkPath = ({ d, p, color = C.cream, sw = 8 }: Base & { d: string }) => <path d={d} {...stroke(p, color, sw)} />
