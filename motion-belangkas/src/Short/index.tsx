import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion'
import { Captions } from './Captions'
import { Film } from './Film'
import { Branch } from './scenes/Branch'
import { Dying } from './scenes/Dying'
import { Evolve } from './scenes/Evolve'
import { Hook } from './scenes/Hook'
import { Intro } from './scenes/Intro'
import { Outro } from './scenes/Outro'
import { Punch } from './scenes/Punch'
import { Secrets } from './scenes/Secrets'
import './theme'
import { FPS, fr, SCENES, VO_START, W } from './timing'
import { WORDS } from './words'

const SCENE_LIST = [
  ['hook', Hook],
  ['intro', Intro],
  ['dying', Dying],
  ['secrets', Secrets],
  ['evolve', Evolve],
  ['branch', Branch],
  ['punch', Punch],
  ['outro', Outro],
] as const

// [file, frame, volume]
const SFX: [string, number, number][] = [
  ['boom', 0, 0.9],
  ['glitch', fr(W.reset), 0.8],
  ['whoosh2', fr(W.hewan) - 3, 0.7],
  ['whoosh', SCENES.intro[0] - 4, 0.6],
  ['pop', fr(W.kepiting), 0.6],
  ['pop', fr(W.laba), 0.5],
  ['pop', fr(W.kala), 0.5],
  ['whoosh', SCENES.dying[0] - 4, 0.6],
  ['rumble', fr(W.great), 1],
  ['boom', fr(W.great) + 4, 0.6],
  ['whoosh2', fr(W.belangkasQ), 0.7],
  ['whoosh', SCENES.secrets[0] - 4, 0.6],
  ...(['makan', 'tahan', 'asin', 'payau', 'dingin', 'minim', 'cangkang', 'darah', 'telur', 'ribuan'] as const).map(
    (k) => ['pop', fr(W[k]) - 2, 0.55] as [string, number, number],
  ),
  ['whoosh', SCENES.evolve[0] - 4, 0.6],
  ['shimmer', fr(W.menggandakan) - 4, 0.6],
  ['whoosh', SCENES.branch[0] - 4, 0.6],
  ['pop', fr(W.lalu) + 8, 0.6],
  ['pop', fr(W.pas) + 4, 0.7],
  ['scratch', SCENES.punch[0] - 2, 0.9],
  ['whoosh', SCENES.outro[0] - 4, 0.5],
  ['boom', fr(W.kita) - 2, 1],
  ['pop', fr(W.indonesia), 0.6],
  ['whoosh2', fr(W.lepasin) - 4, 0.6],
]

// Musik turun saat ada suara narator
const speaking = (t: number) => WORDS.some((w) => t > w.start + VO_START - 0.2 && t < w.end + VO_START + 0.3)

export const Short = () => {
  const { fps } = useVideoConfig()
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {SCENE_LIST.map(([key, Scene]) => (
        <Sequence key={key} from={SCENES[key][0]} durationInFrames={SCENES[key][1] - SCENES[key][0]}>
          <Scene />
        </Sequence>
      ))}
      <Captions y={1430} />
      <Film />

      <Sequence from={Math.round(VO_START * FPS)}>
        <Audio src={staticFile('audio/vo.mp3')} />
      </Sequence>
      <Audio src={staticFile('audio/music.mp3')} volume={(f) => (speaking(f / fps) ? 0.24 : 0.5)} />
      <Audio
        src={staticFile('audio/ambience.mp3')}
        volume={(f) => (f < SCENES.dying[0] || f >= SCENES.outro[0] ? 0.35 : 0.12)}
      />
      {SFX.map(([name, at, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)}>
          <Audio src={staticFile(`audio/sfx/${name}.mp3`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}
