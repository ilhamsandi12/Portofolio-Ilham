import { Dial } from './Dial'
import { COLORS } from './timeline'

export const DOOR = 620
const R = DOOR / 2
const THICKNESS = 44

const steel = `
  radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18), transparent 55%),
  repeating-conic-gradient(from 0deg, rgba(255,255,255,0.035) 0deg 2deg, rgba(0,0,0,0.05) 2deg 4deg),
  radial-gradient(circle, #4a525d 0%, #2b3139 60%, #1a1e24 100%)
`

const face: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  borderRadius: '50%',
  backfaceVisibility: 'hidden',
}

const BOLTS = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5)

const Bolts = ({ retract }: { retract: number }) => (
  <>
    {BOLTS.map((a) => (
      <div
        key={a}
        style={{
          position: 'absolute',
          left: R,
          top: R - 17,
          width: 78,
          height: 34,
          transformOrigin: '0 50%',
          transform: `rotate(${a}deg) translateX(${R - 34 - retract * 52}px)`,
          borderRadius: 8,
          background: 'linear-gradient(180deg, #d7dde5, #8f99a6 45%, #59616c)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      />
    ))}
  </>
)

const Wheel = ({ angle }: { angle: number }) => (
  <svg
    width={DOOR}
    height={DOOR}
    style={{ position: 'absolute', inset: 0, transform: `rotate(${angle}deg)`, filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.6))' }}
  >
    <defs>
      <linearGradient id="spoke" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#59616c" />
        <stop offset="50%" stopColor="#c9d0d9" />
        <stop offset="100%" stopColor="#59616c" />
      </linearGradient>
      <radialGradient id="knob" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffe3a1" />
        <stop offset="60%" stopColor={COLORS.gold} />
        <stop offset="100%" stopColor={COLORS.goldDeep} />
      </radialGradient>
    </defs>
    {[60, 180, 300].map((a) => (
      <g key={a} transform={`rotate(${a} ${R} ${R})`}>
        <rect x={R - 9} y={R - 232} width={18} height={232} rx={9} fill="url(#spoke)" />
        <circle cx={R} cy={R - 236} r={22} fill="url(#knob)" stroke="#6b4a10" strokeWidth={2} />
      </g>
    ))}
  </svg>
)

const Rings = () => (
  <svg width={DOOR} height={DOOR} style={{ position: 'absolute', inset: 0 }}>
    <circle cx={R} cy={R} r={R - 6} fill="none" stroke="#0c0e11" strokeWidth={10} />
    <circle cx={R} cy={R} r={R - 34} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
    <circle cx={R} cy={R} r={R - 40} fill="none" stroke="#14171b" strokeWidth={6} />
    <circle cx={R} cy={R} r={176} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={30} />
    {Array.from({ length: 32 }, (_, i) => (
      <circle
        key={i}
        cx={R + Math.cos((i / 32) * Math.PI * 2) * (R - 20)}
        cy={R + Math.sin((i / 32) * Math.PI * 2) * (R - 20)}
        r={4}
        fill="#9aa3ae"
        stroke="#1a1d22"
        strokeWidth={1.5}
      />
    ))}
  </svg>
)

type Props = { dial: number; flash: number; unlock: number; open: number }

export const Door = ({ dial, flash, unlock, open }: Props) => (
  <div style={{ position: 'absolute', inset: 0, perspective: 2400 }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        transformOrigin: '0% 50%',
        transform: `rotateY(${-84 * open}deg)`,
      }}
    >
      {Array.from({ length: THICKNESS / 4 }, (_, i) => (
        <div
          key={i}
          style={{ ...face, backfaceVisibility: 'visible', background: '#20252c', transform: `translateZ(${-(i + 1) * 4}px)` }}
        />
      ))}
      <div style={{ ...face, background: '#2a3037', transform: `translateZ(${-THICKNESS}px) rotateY(180deg)` }} />
      {/* Pengunci di belakang muka pintu: yang terlihat hanya ujung yang menancap ke kusen */}
      <div style={{ position: 'absolute', inset: 0, transform: 'translateZ(-18px)' }}>
        <Bolts retract={unlock} />
      </div>
      <div style={{ ...face, background: steel, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7), 0 0 0 2px #0a0c0f' }}>
        <Rings />
        <Wheel angle={unlock * 120} />
        <Dial angle={dial} flash={flash} />
      </div>
    </div>
  </div>
)
