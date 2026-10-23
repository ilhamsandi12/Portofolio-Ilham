import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { ramp } from '../anim'
import { Belangkas } from '../Belangkas'
import { Backdrop } from '../Backdrop'
import { Hand, Line, Pop, Stamp } from '../collage'
import { ChalkPath, ScribbleCircle, ScribbleCross } from '../scribble'
import { C, SERIF } from '../theme'
import { fr, SCENES, W } from '../timing'

// Cabang air tawar: titik ujung, bentuk "aneh", dan rotasi
const BRANCHES: { d: string; x: number; y: number; stretch: [number, number]; spiky?: boolean; rot: number }[] = [
  { d: 'M540 1180 C460 1150 340 1120 230 1030', x: 220, y: 1000, stretch: [1.5, 0.6], rot: -20 },
  { d: 'M540 960 C640 930 760 880 860 790', x: 860, y: 770, stretch: [0.7, 1.7], spiky: true, rot: 18 },
  { d: 'M540 760 C450 730 330 680 230 580', x: 220, y: 560, stretch: [1.3, 1.3], spiky: true, rot: -12 },
]

export const Branch = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const from = SCENES.branch[0]
  const L = (i: number) => fr(i) - from
  const morph = L(W.berubah)
  const punah = L(W.lalu)
  const bertahan = L(W.bertahan)
  const karena = L(W.karena)
  const tree = 1 - ramp(frame, karena - 2, 10)
  const drop = spring({ frame: frame - L(W.pas) + 6, fps, config: { damping: 11, mass: 0.9 } })

  return (
    <AbsoluteFill>
      <Backdrop variant="maroon" />

      <div style={{ position: 'absolute', inset: 0, opacity: tree }}>
        <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
          <ChalkPath d="M540 1300 L540 420" p={ramp(frame, 0, 24)} sw={12} color={frame > bertahan ? '#fff6dc' : C.cream} />
          {BRANCHES.map((b, i) => (
            <ChalkPath key={i} d={b.d} p={ramp(frame, 8 + i * 6, 16)} sw={8} color={C.creamDim} />
          ))}
        </svg>
        <div style={{ position: 'absolute', left: 560, top: 1320, fontFamily: SERIF, fontStyle: 'italic', fontSize: 40, color: C.creamDim }}>445 jt th lalu</div>
        <div style={{ position: 'absolute', left: 660, top: 520, fontFamily: SERIF, fontStyle: 'italic', fontSize: 40, color: C.creamDim }}>sekarang</div>
        <Pop at={L(W.tawar) - 4} x={300} y={1260} rotate={-6} shadow={false}>
          <Hand size={70} color="#8db8ff">→ air tawar</Hand>
        </Pop>

        {BRANCHES.map((b, i) => {
          const at = 14 + i * 6
          if (frame < at) return null
          const wob = frame > morph ? Math.sin((frame - morph) / 3 + i) * ramp(frame, morph, 10) * (1 - ramp(frame, punah, 6)) : 0
          const dead = ramp(frame, punah + i * 3, 8)
          const k = 1 + (b.stretch[0] - 1) * ramp(frame, morph, 18)
          const k2 = 1 + (b.stretch[1] - 1) * ramp(frame, morph, 18)
          return (
            <div key={i} style={{ position: 'absolute', left: b.x, top: b.y, transform: `translate(-50%, -50%) rotate(${b.rot + wob * 8}deg) scale(${spring({ frame: frame - at, fps, config: { damping: 14 } }) * (1 - dead * 0.1)})`, filter: 'drop-shadow(0 16px 18px rgba(0,0,0,0.45))' }}>
              <div style={{ opacity: 1 - dead * 0.55 }}>
                <Belangkas height={300} frame={frame} stretch={[k, k2]} spiky={b.spiky && frame > morph} gray={dead} />
              </div>
              <div style={{ position: 'absolute', left: -20, top: 0 }}>
                {frame >= punah + i * 3 && <ScribbleCross size={230} p={ramp(frame, punah + i * 3, 9)} sw={14} />}
              </div>
            </div>
          )
        })}
        <Pop at={L(W.lalu) + 8} x={850} y={1130} rotate={8} from="slam" shadow={false}>
          <Stamp size={70}>punah</Stamp>
        </Pop>

        <Pop at={2} x={540} y={420} from="scale">
          <div style={{ transform: `scale(${1 + ramp(frame, bertahan, 12) * 0.25})` }}>
            <Belangkas height={300} frame={frame} />
          </div>
        </Pop>
        <div style={{ position: 'absolute', left: 390, top: 230 }}>
          {frame >= bertahan + 4 && <ScribbleCircle w={300} h={380} p={ramp(frame, bertahan + 4, 14)} color={C.cream} sw={9} seed="br" />}
        </div>
        <Pop at={L(W.desain) - 2} x={830} y={360} rotate={-6} shadow={false}>
          <Hand size={84}>desain lama ✓</Hand>
        </Pop>
      </div>

      {/* Pas dengan dasar laut dangkal */}
      {frame >= karena - 2 && (
        <AbsoluteFill style={{ opacity: ramp(frame, karena - 2, 8) }}>
          <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
            <path d="M0 960 C200 920 380 990 540 960 C720 930 880 980 1080 950 L1080 1320 L0 1320 Z" fill="#c9a86c" />
            <path d="M0 960 C200 920 380 990 540 960 C720 930 880 980 1080 950" fill="none" stroke={C.ink} strokeWidth="5" />
            {Array.from({ length: 40 }, (_, i) => (
              <circle key={i} cx={(i * 97) % 1080} cy={1000 + ((i * 53) % 300)} r={3 + (i % 3)} fill="rgba(60,40,20,0.35)" />
            ))}
            <ellipse cx="540" cy="1010" rx="190" ry="60" fill="none" stroke={C.ink} strokeWidth="6" strokeDasharray="18 14" />
          </svg>
          <div style={{ position: 'absolute', left: 540, top: interpolate(drop, [0, 1], [380, 960]), transform: `translate(-50%, -50%) rotateX(${drop * 58}deg)`, filter: 'drop-shadow(0 24px 22px rgba(0,0,0,0.5))' }}>
            <Belangkas height={460} frame={frame} />
          </div>
          <Pop at={L(W.pas) + 4} x={820} y={760} rotate={8} from="slam" shadow={false}>
            <Stamp size={86} color={C.cream}>pas!</Stamp>
          </Pop>
          <Line text="dasar laut dangkal" at={L(W.dasar)} y={1230} size={74} italic weight={600} color={C.ink} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}
