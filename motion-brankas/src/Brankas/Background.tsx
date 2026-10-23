import { AbsoluteFill, interpolate } from 'remotion'
import { COLORS } from './timeline'

export const Background = ({ frame, open }: { frame: number; open: number }) => {
  const sweep = interpolate(frame, [10, 70], [-60, 160], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: `${frame * 0.3}px ${frame * 0.15}px`,
          WebkitMaskImage: 'radial-gradient(ellipse at 65% 50%, black 10%, transparent 70%)',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 68% 50%, rgba(245,185,66,${0.08 + 0.32 * open}) 0%, transparent ${38 + 14 * open}%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,255,255,0.07) ${sweep}%, transparent ${sweep + 12}%)`,
        }}
      />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)' }} />
    </AbsoluteFill>
  )
}
