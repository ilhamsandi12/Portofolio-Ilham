import { AbsoluteFill, Img, staticFile } from 'remotion'
import { C } from './theme'

export type Variant = 'maroon' | 'blood' | 'paper' | 'ink'

export const Backdrop = ({ variant, glow = 0 }: { variant: Variant; glow?: number }) => {
  if (variant === 'paper') {
    return (
      <AbsoluteFill>
        <Img src={staticFile('tex/paper.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(80,60,30,0.28) 100%)' }} />
      </AbsoluteFill>
    )
  }
  const bg = {
    maroon: `radial-gradient(ellipse at 50% 42%, #84202a 0%, ${C.maroon} 38%, ${C.maroonDeep} 82%, #120103 100%)`,
    blood: `radial-gradient(ellipse at 50% 60%, #c2361f 0%, #6e0d10 40%, #2a0306 85%, #0f0102 100%)`,
    ink: 'radial-gradient(ellipse at 50% 45%, #2b2124 0%, #151012 55%, #070506 100%)',
  }[variant]
  return (
    <AbsoluteFill style={{ background: bg }}>
      {glow > 0 && <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,214,160,0.35), transparent 55%)', opacity: glow }} />}
    </AbsoluteFill>
  )
}
