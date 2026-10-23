import { Composition } from 'remotion'
import { Brankas } from './Brankas'
import { DURATION, FPS } from './Brankas/timeline'

export const Root = () => (
  <Composition
    id="Brankas"
    component={Brankas}
    durationInFrames={DURATION}
    fps={FPS}
    width={1920}
    height={1080}
  />
)
