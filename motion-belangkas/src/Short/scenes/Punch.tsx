import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Belangkas } from '../Belangkas'
import { Backdrop } from '../Backdrop'
import { Line, Pop, Stamp } from '../collage'
import { C } from '../theme'
import { fr, SCENES, W } from '../timing'

export const Punch = () => {
  const frame = useCurrentFrame()
  const from = SCENES.punch[0]
  const L = (i: number) => fr(i) - from
  return (
    <AbsoluteFill>
      <Backdrop variant="paper" />
      <Line text="Kalau nggak rusak," at={0} y={330} size={92} italic weight={500} color={C.ink} />
      <Line text="ngapain" at={L(W.ngapain) - 4} y={480} size={140} weight={900} color={C.ink} />
      <Line text="diganti?" at={L(W.ngapain) + 2} y={630} size={170} italic weight={900} color={C.red} />
      <Pop at={2} x={540} y={1010} rotate={-8} from="slam">
        <Belangkas height={460} frame={0} />
      </Pop>
      <Pop at={10} x={700} y={1150} rotate={-14} from="slam" shadow={false}>
        <div style={{ background: 'rgba(239,230,210,0.85)', padding: 6 }}>
          <Stamp size={46}>Original · v1.0</Stamp>
        </div>
      </Pop>
      {frame < 3 && <AbsoluteFill style={{ background: C.cream, opacity: 1 - frame / 3 }} />}
    </AbsoluteFill>
  )
}
