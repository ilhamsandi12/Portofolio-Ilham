import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { C, SERIF } from './theme'
import { SCENES, VO_START } from './timing'
import { WORDS } from './words'

// Subtitle editorial: kata muncul saat diucapkan, kata yang sedang diucapkan diberi blok merah
type Page = { start: number; end: number; words: number[] }

const PAGES: Page[] = (() => {
  const pages: Page[] = []
  let cur: number[] = []
  WORDS.forEach((w, i) => {
    cur.push(i)
    const next = WORDS[i + 1]
    const breakHere = /[.?,]$|\.\.\.$/.test(w.text) || cur.length >= 4 || !next || next.start - w.end > 0.35
    if (breakHere) {
      pages.push({ start: WORDS[cur[0]].start, end: w.end, words: cur })
      cur = []
    }
  })
  return pages.map((p, i) => ({ ...p, end: Math.min(pages[i + 1]?.start ?? p.end + 0.6, p.end + 0.6) }))
})()

const PAPER = [SCENES.intro, SCENES.evolve, SCENES.punch]

export const Captions = ({ y = 1400 }: { y?: number }) => {
  const frame = useCurrentFrame()
  const dark = PAPER.some(([a, b]) => frame >= a && frame < b)
  const { fps } = useVideoConfig()
  const t = frame / fps - VO_START
  const page = PAGES.find((p) => t >= p.start - 0.05 && t < p.end)
  if (!page) return null
  return (
    <div style={{ position: 'absolute', left: 70, right: 70, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', gap: '6px 18px' }}>
      {page.words.map((i) => {
        const w = WORDS[i]
        const shown = interpolate(t, [w.start - 0.04, w.start + 0.08], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        const active = t >= w.start - 0.04 && t < w.end + 0.06
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              isolation: 'isolate',
              fontFamily: SERIF,
              fontWeight: active ? 900 : 700,
              fontStyle: active ? 'italic' : 'normal',
              fontSize: 62,
              lineHeight: 1.15,
              color: active ? C.cream : dark ? C.ink : C.cream,
              opacity: shown,
              transform: `translateY(${(1 - shown) * 18}px)`,
              padding: '0 10px',
              textShadow: dark || active ? 'none' : '0 3px 14px rgba(0,0,0,0.6)',
            }}
          >
            {active && <span style={{ position: 'absolute', inset: '8% -2px 4% -2px', background: C.red, transform: 'rotate(-2deg) skewX(-6deg)', zIndex: -1 }} />}
            {w.text.replace(/\.\.\.$/, '…')}
          </span>
        )
      })}
    </div>
  )
}
