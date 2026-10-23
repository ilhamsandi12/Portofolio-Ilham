import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'
import { ramp, shake } from '../anim'
import { Art, GLOBE, SKULL } from '../Art'
import { Belangkas } from '../Belangkas'
import { Backdrop } from '../Backdrop'
import { Hand, Line, Pop } from '../collage'
import { ScribbleArrow, ScribbleCircle, ScribbleCross } from '../scribble'
import { C, SERIF } from '../theme'
import { fr, W } from '../timing'

export const Hook = () => {
  const frame = useCurrentFrame()
  const bumi = fr(W.bumi)
  const reset = fr(W.reset)
  const hewan = fr(W.hewan)
  const lolos = fr(W.lolos)

  const count = Math.round(interpolate(frame, [2, 42], [0, 445], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }))
  const shrink = ramp(frame, bumi - 4, 14)
  const glitch = frame >= reset && frame < reset + 14
  const dead = ramp(frame, reset + 10, 10)
  const away = ramp(frame, hewan - 4, 12)
  const sh = shake(frame, reset, 14, 22)

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Backdrop variant="maroon" />

      {/* 445 juta tahun */}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 610,
          transform: `translate(-50%, -50%) translateY(${shrink * -330}px) scale(${1 - shrink * 0.55})`,
          opacity: 1 - away,
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 400, lineHeight: 0.9, color: C.cream, letterSpacing: -10 }}>{count}</div>
        <div style={{ position: 'absolute', left: -60, top: -40 }}>
          <ScribbleCircle w={640} h={460} p={ramp(frame, 22, 18)} color={C.red} sw={10} seed="hook" />
        </div>
      </div>
      <Line text="juta tahun." at={fr(5) - 2} y={860} size={120} italic weight={600} exitAt={bumi - 4} />
      <Pop at={30} x={540} y={300} rotate={-3} shadow={false} exitAt={bumi - 4}>
        <Hand size={58} color={C.creamDim}>sejak zaman Ordovisium</Hand>
      </Pop>

      {/* Bumi di-reset */}
      <Pop at={bumi} x={540} y={820} exitAt={hewan + 6}>
        <div style={{ position: 'relative', transform: `rotate(${frame * 0.3}deg)`, filter: `grayscale(${dead}) brightness(${1 - dead * 0.45})` }}>
          <Art parts={GLOBE} size={560} />
          {glitch &&
            [0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: `inset(${i * 25}% 0 ${75 - i * 25}% 0)`,
                  transform: `translateX(${Math.sin(frame * 7 + i * 3) * 50}px)`,
                  mixBlendMode: 'screen',
                  filter: `hue-rotate(${i * 90}deg) saturate(3)`,
                }}
              >
                <Art parts={GLOBE} size={560} />
              </div>
            ))}
        </div>
      </Pop>
      <Pop at={reset} x={560} y={830} rotate={-9} from="slam" shadow={false} exitAt={hewan}>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontStyle: 'italic', fontSize: 210, color: C.red, letterSpacing: 4, textShadow: '0 6px 0 rgba(0,0,0,0.35)' }}>RESET</div>
          <div style={{ position: 'absolute', left: -30, top: 10 }}>
            <ScribbleCross size={680} p={ramp(frame, reset + 8, 14)} color={C.cream} sw={12} />
          </div>
        </div>
      </Pop>
      {[0, 1, 2, 3, 4].map((i) => (
        <Pop key={i} at={reset + 12 + i * 3} x={180 + i * 180} y={1200} rotate={(i - 2) * 5} exitAt={hewan}>
          <Art parts={SKULL} size={130} />
        </Pop>
      ))}

      {/* Hewan ini selalu lolos */}
      <Pop at={hewan} x={540} y={820} from="bottom" rotate={-5}>
        <Belangkas height={820} frame={frame} />
      </Pop>
      <Pop at={lolos - 4} x={820} y={360} rotate={6} shadow={false}>
        <Hand size={86} color={C.cream}>selalu lolos!</Hand>
      </Pop>
      {frame >= lolos - 4 && <ScribbleArrow w={1080} h={1920} x1={830} y1={420} x2={700} y2={600} bend={-0.35} p={ramp(frame, lolos - 2, 14)} color={C.cream} />}
    </AbsoluteFill>
  )
}
