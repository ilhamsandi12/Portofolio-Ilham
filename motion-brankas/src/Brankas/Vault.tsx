import { random } from 'remotion'
import { Door, DOOR } from './Door'
import { COLORS } from './timeline'

export const FRAME = 820
const INSET = (FRAME - DOOR) / 2

const sparks = Array.from({ length: 28 }, (_, i) => ({
  x: random(`x${i}`) * DOOR,
  y: random(`y${i}`) * DOOR,
  s: 2 + random(`s${i}`) * 4,
  speed: 0.4 + random(`v${i}`) * 1.2,
  phase: random(`p${i}`) * Math.PI * 2,
}))

const Bars = () => (
  <svg width={360} height={200} viewBox="0 0 360 200" style={{ position: 'absolute', left: (DOOR - 360) / 2, bottom: 110 }}>
    <defs>
      <linearGradient id="barTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff1c4" />
        <stop offset="100%" stopColor={COLORS.gold} />
      </linearGradient>
      <linearGradient id="barSide" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={COLORS.gold} />
        <stop offset="100%" stopColor={COLORS.goldDeep} />
      </linearGradient>
    </defs>
    {[
      [0, 140], [120, 140], [240, 140],
      [60, 80], [180, 80],
      [120, 20],
    ].map(([x, y]) => (
      <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
        <path d="M14 0 H106 L120 22 H0 Z" fill="url(#barTop)" />
        <rect y={22} width={120} height={36} fill="url(#barSide)" />
        <rect x={12} y={30} width={96} height={4} fill="rgba(255,255,255,0.35)" />
      </g>
    ))}
  </svg>
)

const Interior = ({ frame, glow }: { frame: number; glow: number }) => (
  <div
    style={{
      position: 'absolute',
      left: INSET,
      top: INSET,
      width: DOOR,
      height: DOOR,
      borderRadius: '50%',
      overflow: 'hidden',
      background: `radial-gradient(circle at 50% 62%, rgba(245,185,66,${0.55 * glow}) 0%, #120d05 55%, #050403 100%)`,
      boxShadow: 'inset 0 30px 80px rgba(0,0,0,0.95)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: -200,
        opacity: 0.35 * glow,
        transform: `rotate(${frame * 0.4}deg)`,
        background: 'repeating-conic-gradient(from 0deg, rgba(255,214,128,0.6) 0deg 6deg, transparent 6deg 22deg)',
        WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 60%)',
      }}
    />
    <div style={{ position: 'absolute', inset: 0, opacity: glow }}>
      <Bars />
    </div>
    {sparks.map((p, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: p.x,
          top: (p.y - frame * p.speed + DOOR * 2) % DOOR,
          width: p.s,
          height: p.s,
          borderRadius: '50%',
          background: '#ffe6a6',
          boxShadow: '0 0 8px #ffd27a',
          opacity: glow * (0.4 + 0.6 * Math.sin(frame / 8 + p.phase) ** 2),
        }}
      />
    ))}
  </div>
)

const Frame = () => (
  <>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: `
          radial-gradient(circle at 30% 25%, rgba(255,255,255,0.14), transparent 50%),
          radial-gradient(circle, #2c323a 60%, #15191e 72%, #0b0d10 100%)
        `,
        boxShadow: '0 60px 120px rgba(0,0,0,0.8), inset 0 0 0 3px #0a0c0f, inset 0 0 40px rgba(0,0,0,0.6)',
      }}
    />
    <svg width={FRAME} height={FRAME} style={{ position: 'absolute', inset: 0 }}>
      <circle cx={FRAME / 2} cy={FRAME / 2} r={DOOR / 2 + 10} fill="none" stroke="#07080a" strokeWidth={20} />
      <circle cx={FRAME / 2} cy={FRAME / 2} r={FRAME / 2 - 22} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={2} />
      {Array.from({ length: 40 }, (_, i) => (
        <circle
          key={i}
          cx={FRAME / 2 + Math.cos((i / 40) * Math.PI * 2) * (FRAME / 2 - 46)}
          cy={FRAME / 2 + Math.sin((i / 40) * Math.PI * 2) * (FRAME / 2 - 46)}
          r={5}
          fill="#7d8794"
          stroke="#111"
          strokeWidth={1.5}
        />
      ))}
    </svg>
    {[-170, 110].map((y) => (
      <div
        key={y}
        style={{
          position: 'absolute',
          left: INSET - 34,
          top: FRAME / 2 + y,
          width: 60,
          height: 60,
          borderRadius: 10,
          background: 'linear-gradient(90deg, #59616c, #c9d0d9 50%, #59616c)',
          boxShadow: '0 6px 14px rgba(0,0,0,0.6)',
        }}
      />
    ))}
  </>
)

type Props = { frame: number; dial: number; flash: number; unlock: number; open: number }

export const Vault = ({ frame, dial, flash, unlock, open }: Props) => (
  <div style={{ position: 'relative', width: FRAME, height: FRAME }}>
    <Frame />
    <Interior frame={frame} glow={open} />
    <div style={{ position: 'absolute', left: INSET, top: INSET, width: DOOR, height: DOOR }}>
      <Door dial={dial} flash={flash} unlock={unlock} open={open} />
    </div>
  </div>
)
