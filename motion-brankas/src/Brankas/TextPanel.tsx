import { interpolate, spring, useVideoConfig } from 'remotion'
import { CODE, COLORS, T, codeLocked, fade } from './timeline'

const TITLE = 'BRANKAS'

const Slot = ({ value, state }: { value: string; state: 'idle' | 'active' | 'locked' }) => (
  <div
    style={{
      width: 112,
      height: 92,
      borderRadius: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'JetBrains Mono',
      fontSize: 46,
      fontWeight: 700,
      color: state === 'locked' ? COLORS.bg : state === 'active' ? COLORS.gold : COLORS.muted,
      background: state === 'locked' ? COLORS.gold : 'rgba(255,255,255,0.03)',
      border: `2px solid ${state === 'idle' ? 'rgba(255,255,255,0.12)' : COLORS.gold}`,
      boxShadow: state === 'locked' ? `0 0 30px rgba(245,185,66,0.45)` : 'none',
    }}
  >
    {value}
  </div>
)

type Props = { frame: number; dialNum: number; unlock: number }

export const TextPanel = ({ frame, dialNum, unlock }: Props) => {
  const { fps } = useVideoConfig()
  const activeSlot = CODE.findIndex((_, i) => !codeLocked(frame, i))
  const opened = frame >= T.open
  const statusColor = unlock > 0.5 ? COLORS.green : COLORS.red

  return (
    <div style={{ position: 'absolute', left: 150, top: 230, width: 680, color: COLORS.text, fontFamily: 'Space Grotesk' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontSize: 22,
          letterSpacing: 6,
          color: COLORS.gold,
          opacity: fade(frame, 8),
          transform: `translateX(${(1 - fade(frame, 8)) * -30}px)`,
        }}
      >
        <div style={{ width: 56 * fade(frame, 8, 20), height: 2, background: COLORS.gold }} />
        SISTEM KEAMANAN · SERI 01
      </div>

      <div style={{ display: 'flex', marginTop: 18, overflow: 'hidden', height: 170 }}>
        {TITLE.split('').map((ch, i) => {
          const p = spring({ frame: frame - 14 - i * 3, fps, config: { damping: 14 } })
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                fontSize: 156,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -2,
                transform: `translateY(${(1 - p) * 170}px)`,
              }}
            >
              {ch}
            </span>
          )
        })}
      </div>

      <div style={{ position: 'relative', height: 40, marginTop: 6, fontSize: 28, color: COLORS.muted, whiteSpace: 'nowrap' }}>
        <div style={{ position: 'absolute', opacity: fade(frame, 30) * (1 - fade(frame, T.open, 12)) }}>
          Simpan yang berharga. Buka dengan kode yang tepat.
        </div>
        <div style={{ position: 'absolute', color: COLORS.text, opacity: fade(frame, T.open + 6, 14) }}>
          Akses diberikan. Semuanya tetap aman.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, marginTop: 60, opacity: fade(frame, 38), transform: `translateY(${(1 - fade(frame, 38)) * 20}px)` }}>
        {CODE.map((n, i) => {
          const locked = codeLocked(frame, i)
          const active = i === activeSlot && frame >= T.dial[0] - 5
          return (
            <Slot
              key={i}
              value={locked ? String(n).padStart(2, '0') : active ? String(dialNum).padStart(2, '0') : '––'}
              state={locked ? 'locked' : active ? 'active' : 'idle'}
            />
          )
        })}
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          marginTop: 44,
          padding: '14px 26px',
          borderRadius: 999,
          border: `2px solid ${statusColor}`,
          color: statusColor,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: 5,
          opacity: fade(frame, 44),
          background: unlock > 0.5 ? 'rgba(61,220,151,0.08)' : 'rgba(255,77,90,0.08)',
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: statusColor,
            boxShadow: `0 0 ${12 + 8 * Math.sin(frame / 5)}px ${statusColor}`,
          }}
        />
        {opened ? 'TERBUKA' : unlock > 0.5 ? 'TIDAK TERKUNCI' : 'TERKUNCI'}
      </div>

      <div
        style={{
          marginTop: 70,
          fontSize: 20,
          letterSpacing: 4,
          color: COLORS.muted,
          opacity: interpolate(frame, [T.outro, T.outro + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        MOTION · ILHAM SANDI
      </div>
    </div>
  )
}
