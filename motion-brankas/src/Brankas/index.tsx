import { loadFont } from '@remotion/fonts'
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { Background } from './Background'
import { TextPanel } from './TextPanel'
import { Vault } from './Vault'
import { CODE, DURATION, T, codeLocked, dialAngle, dialNumber, openProgress, unlockProgress } from './timeline'

// Font disimpan lokal di public/fonts supaya render tetap jalan tanpa internet
loadFont({ family: 'Space Grotesk', url: staticFile('fonts/SpaceGrotesk.woff2'), weight: '300 700' })
loadFont({ family: 'JetBrains Mono', url: staticFile('fonts/JetBrainsMono.woff2'), weight: '100 800' })

export const Brankas = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const dial = dialAngle(frame, fps)
  const unlock = unlockProgress(frame, fps)
  const open = openProgress(frame, fps)

  // Kilatan cincin emas tiap angka kode terkunci
  const flash = CODE.reduce((max, _, i) => {
    const at = T.dial[i] + T.dialLen - 6
    const f = codeLocked(frame, i) ? interpolate(frame, [at, at + 14], [1, 0], { extrapolateRight: 'clamp' }) : 0
    return Math.max(max, f)
  }, 0)

  const enter = spring({ frame, fps, config: { damping: 18, mass: 1.2 } })
  const push = interpolate(frame, [T.open, DURATION], [1, 1.1], { extrapolateLeft: 'clamp' })
  const shake = frame >= T.unlock && frame < T.unlock + 10 ? Math.sin(frame * 3) * (T.unlock + 10 - frame) * 0.6 : 0
  const fadeOut = interpolate(frame, [DURATION - 12, DURATION], [1, 0], { extrapolateLeft: 'clamp' })

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Background frame={frame} open={open} />
      <div
        style={{
          position: 'absolute',
          left: 1000,
          top: 130,
          transform: `translate(${shake}px, ${(1 - enter) * 80 + Math.sin(frame / 30) * 4}px) scale(${(0.82 + 0.18 * enter) * push})`,
          opacity: enter,
        }}
      >
        <Vault frame={frame} dial={dial} flash={flash} unlock={unlock} open={open} />
      </div>
      <TextPanel frame={frame} dialNum={dialNumber(dial)} unlock={unlock} />
    </AbsoluteFill>
  )
}
