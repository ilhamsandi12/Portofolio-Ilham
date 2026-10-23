import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { ramp, shake } from '../anim'
import { Art, SKULL, WAVES } from '../Art'
import { Belangkas } from '../Belangkas'
import { Backdrop } from '../Backdrop'
import { hasPic, Pic } from '../Pic'
import { Hand, Line, Pop, Stamp } from '../collage'
import { ScribbleCheck } from '../scribble'
import { C, SERIF } from '../theme'
import { fr, SCENES, W } from '../timing'

const NET = (() => {
  const d: string[] = []
  for (let i = -2; i <= 14; i++) {
    d.push(`M${i * 80} 0 C${i * 80 + 40} 300 ${i * 80 - 30} 600 ${i * 80 + 20} 900`)
    d.push(`M0 ${i * 80 + 40} C300 ${i * 80 + 70} 700 ${i * 80 + 10} 1080 ${i * 80 + 40}`)
  }
  return d.join(' ')
})()

export const Outro = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const from = SCENES.outro[0]
  const L = (i: number) => fr(i) - from
  const ancaman = L(W.ancaman)
  const kita = L(W.kita)
  const indo = L(W.indonesia)
  const ketemu = L(W.ketemu)
  const lepas = L(W.lepasin)
  const end = Math.round(65.9 * fps) - from

  const netDown = spring({ frame: frame - ancaman, fps, config: { damping: 13 } })
  const netUp = ramp(frame, ketemu, 16)
  const sh = shake(frame, kita, 16, 20)
  const swim = ramp(frame, lepas - 4, 30)
  const endCard = ramp(frame, end, 14)

  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Backdrop variant="ink" />
      <Line text="Ironisnya," at={0} y={300} size={110} italic weight={600} exitAt={kita - 6} />

      {/* Lolos dari semua kiamat */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Pop key={i} at={L(W.setelah) + i * 4} x={160 + i * 190} y={560} rotate={(i - 2) * 6} exitAt={ancaman}>
          <div style={{ position: 'relative' }}>
            <Pic name="skull" height={140} fallback={<Art parts={SKULL} size={130} />} />
            <div style={{ position: 'absolute', left: 20, top: 10 }}>
              <ScribbleCheck size={100} p={ramp(frame, L(W.setelah) + i * 4 + 8, 8)} color="#7fd18b" />
            </div>
          </div>
        </Pop>
      ))}

      <div
        style={{
          position: 'absolute',
          left: 540,
          top: interpolate(swim, [0, 1], [960, 1290]),
          transform: `translate(-50%, -50%) rotate(${swim * 180}deg) scale(${1 - swim * 0.55})`,
          opacity: 1 - ramp(frame, lepas + 26, 10),
          filter: 'drop-shadow(0 24px 24px rgba(0,0,0,0.5))',
        }}
      >
        <Pic name="belangkas_top" height={500} fallback={<Belangkas height={480} frame={frame} walking={frame > lepas - 4} />} />
      </div>

      {/* Jaring: ancaman terbesarnya sekarang */}
      <svg width="1080" height="1920" style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${-920 + netDown * 500 - netUp * 1100}px)` }}>
        <path d={NET} fill="none" stroke={C.creamDim} strokeWidth="6" opacity={hasPic('net') ? 0 : 0.85} filter="url(#chalk)" />
      </svg>
      {hasPic('net') && (
        <div style={{ position: 'absolute', left: 540, top: 0, transform: `translate(-50%, ${-1500 + netDown * 1250 - netUp * 1700}px)` }}>
          <Pic name="net" height={1500} fallback={null} />
        </div>
      )}

      {/* Tangan manusia meraih dari atas saat "kita" */}
      {hasPic('hand') && frame >= kita - 10 && (
        <div style={{ position: 'absolute', left: 620, top: 0, transform: `translate(-50%, ${-900 + spring({ frame: frame - kita + 10, fps, config: { damping: 14 } }) * 700 - netUp * 1200}px) rotate(-8deg)`, filter: 'drop-shadow(0 26px 30px rgba(0,0,0,0.5))' }}>
          <Pic name="hand" height={900} fallback={null} />
        </div>
      )}
      <Line text="ancaman terbesarnya:" at={ancaman + 6} y={340} size={70} italic weight={500} exitAt={indo - 4} />
      <Pop at={kita - 2} x={540} y={540} from="slam" shadow={false} exitAt={indo - 4}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 290, color: C.red, letterSpacing: 6, textShadow: '0 10px 40px rgba(226,58,46,0.45)' }}>KITA.</div>
      </Pop>

      <Pop at={indo} x={540} y={420} rotate={-6} from="slam" shadow={false} exitAt={end}>
        <div style={{ textAlign: 'center' }}>
          <Stamp size={92} color="#7fd18b">dilindungi</Stamp>
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 40, color: C.creamDim, marginTop: 14 }}>Permen LHK P.106/2018</div>
        </div>
      </Pop>

      <Pop at={ketemu} x={540} y={1550} from="bottom" shadow={false}>
        <div style={{ width: 1200 }}>
          <Pic name="wave" width={1200} fallback={<Art parts={WAVES} size={1200} view={360} border={6} />} />
        </div>
      </Pop>
      <Line text="lepasin." at={lepas - 2} y={700} size={150} italic weight={800} exitAt={end} />

      {/* Kartu penutup */}
      {endCard > 0 && (
        <AbsoluteFill style={{ opacity: endCard }}>
          <Backdrop variant="maroon" />
          <Line text="BELANGKAS" at={end} y={760} size={170} weight={900} tracking={4} />
          <Line text="445 juta tahun & masih di sini." at={end + 6} y={900} size={60} italic weight={500} />
          <Pop at={end + 14} x={540} y={1080} rotate={-3} shadow={false}>
            <Hand size={70}>follow buat fakta purba lainnya</Hand>
          </Pop>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}
