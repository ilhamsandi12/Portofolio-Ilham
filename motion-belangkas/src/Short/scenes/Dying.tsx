import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion'
import { ramp, shake } from '../anim'
import { Art, FISH, SKULL, VOLCANO } from '../Art'
import { Belangkas } from '../Belangkas'
import { Backdrop } from '../Backdrop'
import { Line, Pop } from '../collage'
import { ScribbleUnderline } from '../scribble'
import { C, SERIF } from '../theme'
import { fr, SCENES, W } from '../timing'

const GRID = Array.from({ length: 100 }, (_, i) => i)
// 90 dari 100 ikan dicoret, urutannya acak tapi tetap deterministik
const ORDER = [...GRID].sort((a, b) => random(`o${a}`) - random(`o${b}`))
const SURVIVORS = new Set(ORDER.slice(90))

export const Dying = () => {
  const frame = useCurrentFrame()
  const from = SCENES.dying[0]
  const L = (i: number) => fr(i) - from
  const great = L(W.great)
  const grid = L(W.sembilan)
  const jalan = L(W.belangkasQ)
  const sh = shake(frame, great, 40, 18)
  const calm = ramp(frame, jalan - 2, 6)

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Backdrop variant="blood" />
      <AbsoluteFill style={{ opacity: calm }}>
        <Backdrop variant="maroon" glow={1 - ramp(frame, jalan + 4, 20)} />
      </AbsoluteFill>

      {/* Abu vulkanik */}
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0, opacity: 1 - calm }}>
        {Array.from({ length: 60 }, (_, i) => {
          const sp = 2 + random(`v${i}`) * 4
          return (
            <circle
              key={i}
              cx={(random(`ax${i}`) * 1080 + Math.sin(frame / 20 + i) * 30) % 1080}
              cy={(random(`ay${i}`) * 1920 + frame * sp) % 1920}
              r={2 + random(`ar${i}`) * 5}
              fill={i % 4 === 0 ? '#ff8a4c' : 'rgba(30,20,20,0.6)'}
            />
          )
        })}
      </svg>

      <Line text="252" at={0} y={520} size={380} weight={900} exitAt={great - 6} tracking={-8} />
      <Line text="juta tahun lalu" at={L(W.juta) - 2} y={760} size={100} italic weight={500} exitAt={great - 6} />

      {/* The Great Dying */}
      <Line text="The" at={great - 2} y={330} size={90} italic weight={500} exitAt={grid - 6} />
      <Line text="GREAT DYING" at={great} y={460} size={150} weight={900} exitAt={grid - 6} tracking={2} />
      <Pop at={great + 4} x={540} y={900} from="slam" exitAt={grid - 6}>
        <Art parts={SKULL} size={520} />
      </Pop>
      <Pop at={great + 8} x={170} y={1200} rotate={-6} from="bottom" exitAt={grid - 6}>
        <Art parts={VOLCANO} size={340} />
      </Pop>
      <Pop at={great + 12} x={910} y={1220} rotate={5} from="bottom" exitAt={grid - 6}>
        <Art parts={VOLCANO} size={300} />
      </Pop>

      {/* 90% spesies laut */}
      {frame >= grid && frame < jalan + 6 && (
        <div style={{ position: 'absolute', left: 540, top: 920, transform: 'translate(-50%, -50%)', width: 700, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6, opacity: 1 - ramp(frame, jalan - 2, 8) }}>
          {GRID.map((i) => {
            const show = ramp(frame, grid + (i % 10) + Math.floor(i / 10) * 0.6, 6)
            const rank = ORDER.indexOf(i)
            const dead = !SURVIVORS.has(i) && frame > grid + 14 + rank * 0.42
            return (
              <div key={i} style={{ position: 'relative', opacity: show, transform: `scale(${show})` }}>
                <div style={{ opacity: dead ? 0.25 : 1 }}>
                  <Art parts={FISH} size={62} border={6} halftone={false} />
                </div>
                {dead && <div style={{ position: 'absolute', inset: 0, color: C.red, fontFamily: SERIF, fontWeight: 900, fontSize: 72, lineHeight: '58px', textAlign: 'center' }}>×</div>}
              </div>
            )
          })}
        </div>
      )}
      <Pop at={L(W.persen) - 4} x={540} y={370} from="slam" exitAt={jalan - 2} shadow={false}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 230, color: C.cream, lineHeight: 0.9, textShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>90%</div>
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, color: C.cream }}>spesies laut lenyap</div>
        </div>
      </Pop>

      {/* Belangkas? Tetap jalan. */}
      {frame >= jalan && (
        <div
          style={{
            position: 'absolute',
            left: interpolate(frame, [jalan, jalan + 26], [-300, 540], { extrapolateRight: 'clamp' }),
            top: 860,
            transform: 'translate(-50%, -50%) rotate(90deg)',
            filter: 'drop-shadow(0 26px 26px rgba(0,0,0,0.5))',
          }}
        >
          <Belangkas height={640} frame={frame} walking glasses={ramp(frame, L(W.tetap) - 2, 8)} />
        </div>
      )}
      <Line text="tetap jalan." at={L(W.tetap)} y={1220} size={130} italic weight={700} />
      <div style={{ position: 'absolute', left: 290, top: 1300 }}>
        {frame >= L(W.tetap) + 6 && <ScribbleUnderline w={520} p={ramp(frame, L(W.tetap) + 6, 10)} />}
      </div>
    </AbsoluteFill>
  )
}
