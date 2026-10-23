import { Composition } from 'remotion'
import { Short } from './Short'
import { DURATION, FPS } from './Short/timing'

export const Root = () => (
  <Composition id="Belangkas" component={Short} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
)
