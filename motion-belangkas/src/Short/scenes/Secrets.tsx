import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { ramp } from '../anim'
import { Art, BACTERIA, CLAM, DROP, EGGS, SHIELD, THERMO, WORM } from '../Art'
import { Belangkas } from '../Belangkas'
import { Backdrop } from '../Backdrop'
import { Pic } from '../Pic'
import { Hand, Line, Pop, Stamp } from '../collage'
import { ScribbleArrow, ScribbleCircle } from '../scribble'
import { C } from '../theme'
import { fr, SCENES, W } from '../timing'

const CHIPS: [keyof typeof W, string, number, number, number][] = [
  ['asin', 'asin', 690, 470, -6],
  ['payau', 'payau', 975, 470, 7],
  ['dingin', 'dingin', 975, 800, 5],
  ['minim', 'minim O₂', 830, 905, -5],
]

export const Secrets = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const from = SCENES.secrets[0]
  const L = (i: number) => fr(i) - from
  const clot = spring({ frame: frame - L(W.gumpal), fps, config: { damping: 14 } })
  const eggsMore = L(W.ribuan) - 3

  return (
    <AbsoluteFill>
      <Backdrop variant="maroon" />
      <Line text="Rahasianya?" at={0} y={290} size={130} italic weight={800} />

      <Pop at={4} x={540} y={850} from="scale">
        <Pic name="belangkas_top" height={440} fallback={<Belangkas height={420} frame={frame} />} />
      </Pop>

      {/* 1. Makan apa aja */}
      <Pop at={L(W.makan) - 2} x={240} y={590} rotate={-8}>
        <Pic name="food" height={260} fallback={<Art parts={WORM} size={220} />} />
      </Pop>
      <Pop at={L(W.makan) + 4} x={330} y={700} rotate={10}>
        <Pic name="fishbone" height={150} fallback={<Art parts={CLAM} size={170} />} />
      </Pop>
      <Pop at={L(W.makan) + 6} x={230} y={820} rotate={-5} shadow={false}>
        <Hand size={64}>makan apa aja</Hand>
      </Pop>

      {/* 2. Tahan banting */}
      <Pop at={L(W.tahan) - 2} x={830} y={640} rotate={8}>
        <Pic name="thermo" height={300} fallback={<Art parts={THERMO} size={240} />} />
      </Pop>
      {CHIPS.map(([k, label, x, y, r]) => (
        <Pop key={k} at={L(W[k]) - 2} x={x} y={y} rotate={r} from="slam" shadow={false}>
          <div style={{ background: C.cream, padding: '2px 4px', boxShadow: '0 6px 14px rgba(0,0,0,0.35)' }}>
            <Stamp size={38} color={C.ink}>{label}</Stamp>
          </div>
        </Pop>
      ))}

      {/* 3. Cangkang keras + darah biru */}
      <Pop at={L(W.cangkang) - 2} x={250} y={1110} rotate={-6}>
        <Pic name="shield" height={250} fallback={<Art parts={SHIELD} size={250} />} />
      </Pop>
      <Pop at={L(W.cangkang) + 8} x={240} y={1265} rotate={-3} shadow={false}>
        <Hand size={60}>cangkang keras</Hand>
      </Pop>
      <Pop at={L(W.darah) - 2} x={420} y={1080} rotate={8} style={{ filter: 'drop-shadow(0 0 40px rgba(47,107,255,0.75))' }}>
        <Pic name="blood" height={260} fallback={<Art parts={DROP} size={190} />} />
      </Pop>
      <Pop at={L(W.darah) + 2} x={170} y={915} rotate={-8} from="slam" shadow={false}>
        <Hand size={70} color="#8db8ff">darah biru</Hand>
      </Pop>
      {frame >= L(W.gumpal) - 8 && (
        <div style={{ position: 'absolute', left: 520, top: 1170, transform: 'translate(-50%, -50%)' }}>
          <div style={{ transform: `scale(${0.9 - clot * 0.25})`, opacity: 1 - clot * 0.35 }}>
            <Pic name="bacteria" height={160} fallback={<Art parts={BACTERIA} size={150} />} />
          </div>
          <div style={{ position: 'absolute', left: -40, top: -40, width: 230, height: 230, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,107,255,0.75), rgba(47,107,255,0.35) 60%, transparent 72%)', transform: `scale(${clot})` }} />
          <div style={{ position: 'absolute', left: -50, top: -60 }}>
            <ScribbleCircle w={250} h={250} p={ramp(frame, L(W.gumpal) + 6, 12)} color={C.cream} sw={7} seed="bak" />
          </div>
        </div>
      )}

      {/* 4. Telur ribuan */}
      <Pop at={L(W.telur) - 2} x={830} y={1120} rotate={6}>
        <Pic name="eggs" height={250} fallback={<Art parts={EGGS} size={250} />} />
      </Pop>
      {[[680, 1010, 140], [990, 1000, 120], [960, 1250, 130], [700, 1260, 110], [860, 940, 100]].map(([x, y, s], i) => (
        <Pop key={i} at={eggsMore + i * 2} x={x} y={y} rotate={(i - 2) * 9}>
          <Pic name="eggs" height={s} fallback={<Art parts={EGGS} size={s} border={8} />} />
        </Pop>
      ))}
      <Pop at={L(W.ribuan)} x={840} y={1330} rotate={-4} from="slam" shadow={false}>
        <Hand size={86} color={C.cream}>ribuan!</Hand>
      </Pop>

      {frame >= L(W.makan) + 8 && <ScribbleArrow w={1080} h={1920} x1={340} y1={840} x2={440} y2={800} bend={0.2} p={ramp(frame, L(W.makan) + 8, 10)} sw={6} />}
      {frame >= L(W.tahan) + 6 && <ScribbleArrow w={1080} h={1920} x1={760} y1={760} x2={650} y2={790} bend={-0.2} p={ramp(frame, L(W.tahan) + 6, 10)} sw={6} />}
    </AbsoluteFill>
  )
}
