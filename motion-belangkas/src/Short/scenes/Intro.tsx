import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { ramp } from '../anim'
import { Art, CRAB, SCORPION, SPIDER } from '../Art'
import { Belangkas } from '../Belangkas'
import { Backdrop } from '../Backdrop'
import { Hand, Line, Pop, Tape } from '../collage'
import { ScribbleCross } from '../scribble'
import { C, SERIF } from '../theme'
import { fr, SCENES, W } from '../timing'

export const Intro = () => {
  const frame = useCurrentFrame()
  const from = SCENES.intro[0]
  const L = (i: number) => fr(i) - from
  const walkIn = interpolate(frame, [0, 22], [700, 0], { extrapolateRight: 'clamp' })
  const linkP = ramp(frame, L(W.laba), 16)

  return (
    <AbsoluteFill>
      <Backdrop variant="paper" />
      <Line text="Kenalin," at={0} y={250} size={92} italic weight={500} color={C.ink} />
      <Line text="BELANGKAS" at={L(W.belangkas) - 3} y={385} size={150} weight={900} color={C.ink} tracking={2} />

      <div style={{ position: 'absolute', left: 540 + walkIn, top: 960, transform: 'translate(-50%, -50%) rotate(-4deg)', filter: 'drop-shadow(0 26px 30px rgba(60,30,10,0.4))' }}>
        <Belangkas height={760} frame={frame} walking={frame < 24} />
        <div style={{ position: 'absolute', left: 30, top: 30 }}><Tape w={170} rotate={-28} /></div>
        <div style={{ position: 'absolute', right: 20, top: 40 }}><Tape w={150} rotate={24} /></div>
      </div>
      <Pop at={L(W.belangkas) + 10} x={300} y={540} rotate={-6} shadow={false}>
        <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 44, color: C.ink, opacity: 0.8 }}>Tachypleus gigas</div>
      </Pop>

      {/* Bukan kepiting */}
      <Pop at={L(W.kepiting) - 3} x={190} y={1110} rotate={-8}>
        <div style={{ position: 'relative' }}>
          <Art parts={CRAB} size={260} />
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <ScribbleCross size={260} p={ramp(frame, L(W.kepiting) + 6, 12)} sw={14} />
          </div>
        </div>
      </Pop>
      <Pop at={L(W.kepiting) + 8} x={230} y={1300} rotate={-6} shadow={false}>
        <Hand size={78} color={C.red}>bukan kepiting!</Hand>
      </Pop>

      {/* Kerabat: laba-laba & kalajengking */}
      <svg width="1080" height="1920" style={{ position: 'absolute', inset: 0 }}>
        <path d="M700 880 C760 800 800 760 860 700" fill="none" stroke={C.ink} strokeWidth="5" strokeDasharray="14 12" opacity={linkP} />
        <path d="M700 1000 C770 1040 820 1060 870 1080" fill="none" stroke={C.ink} strokeWidth="5" strokeDasharray="14 12" opacity={ramp(frame, L(W.kala), 16)} />
      </svg>
      <Pop at={L(W.laba) - 3} x={880} y={640} rotate={8}>
        <Art parts={SPIDER} size={250} />
      </Pop>
      <Pop at={L(W.kala) - 3} x={880} y={1110} rotate={-6}>
        <Art parts={SCORPION} size={270} />
      </Pop>
      <Pop at={L(W.kerabat)} x={900} y={880} rotate={-8} shadow={false}>
        <Hand size={70} color={C.ink}>kerabat aslinya</Hand>
      </Pop>
    </AbsoluteFill>
  )
}
