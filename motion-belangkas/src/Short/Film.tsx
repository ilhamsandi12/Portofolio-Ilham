import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from 'remotion'

// Lapisan film: grain berganti tiap 2 frame, vinyet, kedip cahaya, debu dan goresan
export const Film = () => {
  const frame = useCurrentFrame()
  const g = Math.floor(frame / 2) % 6
  const flicker = 0.04 * (random(`f${Math.floor(frame / 2)}`) - 0.5)
  const scratch = random(`s${Math.floor(frame / 3)}`) > 0.82
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="chalk">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
      </svg>
      <Img
        src={staticFile(`tex/grain${g}.png`)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'overlay', opacity: 0.32 }}
      />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 48%, transparent 50%, rgba(0,0,0,0.55) 100%)' }} />
      <AbsoluteFill style={{ background: flicker > 0 ? `rgba(255,240,220,${flicker})` : `rgba(0,0,0,${-flicker * 2})` }} />
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 7 }, (_, i) => {
          const k = `${i}-${Math.floor(frame / 3)}`
          return <circle key={i} cx={random(`x${k}`) * 1080} cy={random(`y${k}`) * 1920} r={1 + random(`r${k}`) * 2.5} fill="rgba(240,230,210,0.5)" />
        })}
        {scratch && (
          <line
            x1={random(`sx${Math.floor(frame / 3)}`) * 1080}
            x2={random(`sx${Math.floor(frame / 3)}`) * 1080 + 6}
            y1="0"
            y2="1920"
            stroke="rgba(240,230,210,0.18)"
            strokeWidth="2"
          />
        )}
      </svg>
    </AbsoluteFill>
  )
}
