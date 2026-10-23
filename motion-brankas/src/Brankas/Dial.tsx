import { COLORS } from './timeline'

const SIZE = 240
const C = SIZE / 2

const ticks = Array.from({ length: 100 }, (_, i) => {
  const long = i % 10 === 0
  const mid = i % 5 === 0
  const len = long ? 16 : mid ? 11 : 6
  return { i, a: i * 3.6, len, w: long ? 2.4 : 1.2, long }
})

export const Dial = ({ angle, flash }: { angle: number; flash: number }) => (
  <div style={{ position: 'absolute', left: '50%', top: '50%', width: SIZE, height: SIZE, marginLeft: -C, marginTop: -C }}>
    <div
      style={{
        position: 'absolute',
        inset: -18,
        borderRadius: '50%',
        border: `3px solid ${COLORS.gold}`,
        opacity: flash,
        transform: `scale(${1 + (1 - flash) * 0.25})`,
        boxShadow: `0 0 40px ${COLORS.gold}`,
      }}
    />
    <svg width={SIZE} height={SIZE} style={{ position: 'absolute', transform: `rotate(${angle}deg)` }}>
      <defs>
        <radialGradient id="dialFace" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#5a626d" />
          <stop offset="55%" stopColor="#262b32" />
          <stop offset="100%" stopColor="#111418" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={C - 2} fill="url(#dialFace)" stroke="#0b0d10" strokeWidth={4} />
      {ticks.map((t) => (
        <line
          key={t.i}
          x1={C}
          y1={8}
          x2={C}
          y2={8 + t.len}
          stroke={t.long ? COLORS.text : COLORS.steelLight}
          strokeWidth={t.w}
          transform={`rotate(${t.a} ${C} ${C})`}
        />
      ))}
      {ticks.filter((t) => t.long).map((t) => (
        <text
          key={t.i}
          x={C}
          y={46}
          fill={COLORS.text}
          fontSize={15}
          fontWeight={600}
          textAnchor="middle"
          fontFamily="JetBrains Mono"
          transform={`rotate(${t.a} ${C} ${C})`}
        >
          {String(t.i).padStart(2, '0')}
        </text>
      ))}
      <circle cx={C} cy={C} r={58} fill="#15181d" stroke="#3b424c" strokeWidth={2} />
      <circle cx={C} cy={C} r={44} fill="url(#dialFace)" />
      <rect x={C - 6} y={C - 40} width={12} height={80} rx={6} fill="#0d0f12" />
    </svg>
    <svg width={30} height={22} style={{ position: 'absolute', left: C - 15, top: -24 }}>
      <path d="M2 2 L28 2 L15 20 Z" fill={COLORS.gold} />
    </svg>
  </div>
)
