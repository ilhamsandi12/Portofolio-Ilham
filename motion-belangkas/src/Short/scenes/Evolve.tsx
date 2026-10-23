import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { ramp } from '../anim'
import { Art, dnaParts } from '../Art'
import { Belangkas } from '../Belangkas'
import { Backdrop } from '../Backdrop'
import { Hand, Line, Pop } from '../collage'
import { ScribbleCheck, ScribbleUnderline } from '../scribble'
import { C } from '../theme'
import { fr, SCENES, W } from '../timing'

const DNA = dnaParts()

// Posisi heliks pada tiap tahap duplikasi: 1 → 2 → 4 → 8
const layout = (stage: number, k: number): [number, number, number] => {
  if (stage === 0) return [540, 840, 560]
  if (stage === 1) return [420 + k * 240, 840, 460]
  if (stage === 2) return [240 + k * 200, 840, 380]
  return [210 + (k % 4) * 220, k < 4 ? 700 : 1010, 290]
}

export const Evolve = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const from = SCENES.evolve[0]
  const L = (i: number) => fr(i) - from
  const sebenarnya = L(W.sebenarnya)
  const dia = L(W.dia)
  const genom = L(W.genom)
  const dup = L(W.menggandakan)
  const tiga = L(W.tiga)
  const steps = [genom, dup, dup + 9, dup + 18]

  return (
    <AbsoluteFill>
      <Backdrop variant="paper" />

      <Line text="kenapa dia nggak" at={0} y={330} size={84} italic weight={500} color={C.ink} exitAt={sebenarnya - 6} />
      <Line text="BEREVOLUSI?" at={8} y={460} size={150} weight={900} color={C.ink} exitAt={sebenarnya - 6} />
      <Pop at={6} x={540} y={930} rotate={-4} exitAt={sebenarnya - 6}>
        <Belangkas height={520} frame={frame} />
      </Pop>
      {['?', '?', '?'].map((q, i) => (
        <Pop key={i} at={12 + i * 4} x={300 + i * 240} y={680 - (i % 2) * 60} rotate={(i - 1) * 14} shadow={false} exitAt={sebenarnya - 6}>
          <Hand size={150} color={C.red}>{q}</Hand>
        </Pop>
      ))}

      {/* Momen hening ala "Slowly": satu kata di tengah kertas */}
      <Line text="Sebenarnya…" at={sebenarnya} y={900} size={120} italic weight={500} color={C.ink} exitAt={dia - 4} />

      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${ramp(frame, genom - 4, 12) * -540}px) scale(${1 - ramp(frame, genom - 4, 12) * 0.35})`, transformOrigin: '540px 960px' }}>
        <Line text="dia" at={dia} y={830} size={90} italic weight={500} color={C.ink} />
        <Line text="BEREVOLUSI." at={dia + 4} y={960} size={160} weight={900} color={C.ink} />
        <div style={{ position: 'absolute', left: 290, top: 1065 }}>
          {frame >= dia + 12 && <ScribbleUnderline w={500} p={ramp(frame, dia + 12, 10)} />}
        </div>
        <div style={{ position: 'absolute', left: 930, top: 740 }}>
          {frame >= dia + 16 && <ScribbleCheck size={110} p={ramp(frame, dia + 16, 10)} color={C.red} />}
        </div>
      </div>

      {/* Genom menggandakan diri tiga kali */}
      {frame >= genom && (() => {
        const stage = steps.filter((t) => frame >= t).length - 1
        const half = 1 << Math.max(0, stage - 1)
        const sp = spring({ frame: frame - steps[stage], fps, config: { damping: 15 } })
        return Array.from({ length: 1 << stage }, (_, k) => {
          const [tx, ty, th] = layout(stage, k)
          const [px, py, ph] = stage === 0 ? [tx, ty, 0] : layout(stage - 1, k < half ? k : k - half)
          return (
            <div key={k} style={{ position: 'absolute', left: px + (tx - px) * sp, top: py + (ty - py) * sp + 80, transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0 14px 18px rgba(60,30,10,0.35))' }}>
              <div style={{ transform: `scaleX(0.45) rotate(${Math.sin((frame + k * 7) / 14) * 4}deg)` }}>
                <Art parts={DNA} size={ph + (th - ph) * sp} border={8} />
              </div>
            </div>
          )
        })
      })()}
      {[1, 2, 3].map((i) => (
        <Pop key={i} at={steps[i]} x={180 + i * 180} y={540} rotate={-6 + i * 4} from="slam" shadow={false} exitAt={tiga + 30}>
          <Hand size={64} color={C.red}>×2</Hand>
        </Pop>
      ))}
      <Pop at={tiga - 2} x={540} y={1290} rotate={-3} from="slam" shadow={false}>
        <Hand size={92} color={C.red}>3× duplikasi genom!</Hand>
      </Pop>
    </AbsoluteFill>
  )
}
