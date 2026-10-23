import React from 'react'
import { C } from './theme'

// Ilustrasi vektor bergaya potongan cetakan: isi bergradasi, titik halftone, tepi kertas krem
type Tone = 'light' | 'mid' | 'dark' | 'red' | 'blue' | 'line' | 'redLine' | 'blueLine'
export type Part = { d: string; tone?: Tone; sw?: number }

const GRAD: Record<string, [string, string]> = {
  light: ['#f3ecdf', '#a69c8a'],
  mid: ['#c4baa8', '#5a5148'],
  dark: ['#6a6157', '#1d1715'],
  red: ['#ff7a66', '#a3191c'],
  blue: ['#8db8ff', '#1b44c8'],
}

let uid = 0
const nextId = (p: string) => `${p}${++uid}`

export const Art = ({ parts, size, view = 200, border = 10, halftone = true }: { parts: Part[]; size: number; view?: number; border?: number; halftone?: boolean }) => {
  const id = React.useMemo(() => nextId('art'), [])
  const filled = parts.filter((p) => !p.tone || !p.tone.toLowerCase().includes('line'))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${view} ${view}`} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        {Object.entries(GRAD).map(([k, [a, b]]) => (
          <linearGradient key={k} id={`${id}-${k}`} x1="0.2" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
        <pattern id={`${id}-dots`} width={view / 26} height={view / 26} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx={view / 52} cy={view / 52} r={view / 105} fill={C.ink} />
        </pattern>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0.25" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect x={-view} y={-view} width={view * 3} height={view * 3} fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <g fill={C.cream} stroke={C.cream} strokeLinejoin="round" strokeLinecap="round">
        {parts.map((p, i) => (
          <path key={i} d={p.d} strokeWidth={(p.sw ?? 0) + border * 2} fill={p.tone?.toLowerCase().includes('line') ? 'none' : C.cream} />
        ))}
      </g>
      {parts.map((p, i) => {
        if (p.tone === 'line' || p.tone === 'redLine' || p.tone === 'blueLine') {
          const col = p.tone === 'redLine' ? C.red : p.tone === 'blueLine' ? C.blue : C.ink
          return <path key={i} d={p.d} fill="none" stroke={col} strokeWidth={p.sw ?? 4} strokeLinecap="round" strokeLinejoin="round" />
        }
        return <path key={i} d={p.d} fill={`url(#${id}-${p.tone ?? 'mid'})`} stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" />
      })}
      {halftone && (
        <g mask={`url(#${id}-mask)`} opacity={0.55}>
          {filled.map((p, i) => (
            <path key={i} d={p.d} fill={`url(#${id}-dots)`} />
          ))}
        </g>
      )}
    </svg>
  )
}

const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`
const ellipse = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0 Z`
const mirror = (pts: [number, number][]) => pts.map(([x, y]) => [200 - x, y] as [number, number])
const poly = (pts: [number, number][]) => `M${pts.map((p) => p.join(' ')).join(' L')}`

export const GLOBE: Part[] = [
  { d: circle(100, 100, 86), tone: 'light' },
  { d: 'M52 58 C74 40 108 46 114 68 C120 90 94 96 84 112 C74 128 58 118 52 102 C46 86 40 70 52 58 Z', tone: 'dark' },
  { d: 'M120 112 C142 106 162 122 152 142 C142 162 120 168 110 152 C102 138 106 116 120 112 Z', tone: 'dark' },
  { d: 'M128 42 C146 38 166 54 162 72 C150 78 134 66 128 42 Z', tone: 'dark' },
  { d: 'M24 100 C60 116 140 116 176 100', tone: 'line', sw: 2 },
  { d: 'M100 14 C80 50 80 150 100 186', tone: 'line', sw: 2 },
]

export const SKULL: Part[] = [
  { d: 'M100 18 C152 18 182 54 180 100 C179 126 166 141 151 149 L151 172 C151 181 141 186 131 186 L69 186 C59 186 49 181 49 172 L49 149 C34 141 21 126 20 100 C18 54 48 18 100 18 Z', tone: 'light' },
  { d: 'M60 96 C60 80 74 71 88 77 C97 81 97 99 90 109 C82 120 60 114 60 96 Z', tone: 'dark' },
  { d: 'M140 96 C140 80 126 71 112 77 C103 81 103 99 110 109 C118 120 140 114 140 96 Z', tone: 'dark' },
  { d: 'M100 116 L91 137 L109 137 Z', tone: 'dark' },
  { d: 'M62 152 L138 152 M76 152 L76 183 M91 154 L91 185 M107 154 L107 185 M122 152 L122 183', tone: 'line', sw: 3 },
]

export const VOLCANO: Part[] = [
  { d: 'M6 192 L72 78 L92 90 L108 74 L126 86 L194 192 Z', tone: 'dark' },
  { d: 'M72 78 C84 46 94 40 100 18 C106 40 116 50 126 86 L108 74 L92 90 Z', tone: 'red' },
  { d: 'M92 120 L100 150 L86 192 M120 110 L130 160', tone: 'redLine', sw: 6 },
]

export const CRAB: Part[] = [
  { d: 'M60 128 L34 156 M70 134 L52 166 M140 128 L166 156 M130 134 L148 166', tone: 'line', sw: 6 },
  { d: ellipse(100, 112, 54, 32), tone: 'red' },
  { d: 'M52 102 C30 92 18 70 30 52 L46 70 L42 46 C58 46 64 78 58 98 Z', tone: 'red' },
  { d: 'M148 102 C170 92 182 70 170 52 L154 70 L158 46 C142 46 136 78 142 98 Z', tone: 'red' },
  { d: 'M86 84 L84 66 M114 84 L116 66', tone: 'line', sw: 5 },
]

const spiderLegs = [
  [[86, 74], [46, 44], [24, 70]],
  [[82, 86], [34, 80], [14, 112]],
  [[84, 100], [40, 116], [24, 152]],
  [[88, 112], [56, 146], [50, 186]],
] as [number, number][][]

export const SPIDER: Part[] = [
  ...spiderLegs.map((l) => ({ d: poly(l), tone: 'line' as Tone, sw: 6 })),
  ...spiderLegs.map((l) => ({ d: poly(mirror(l)), tone: 'line' as Tone, sw: 6 })),
  { d: ellipse(100, 126, 36, 44), tone: 'dark' },
  { d: circle(100, 74, 22), tone: 'dark' },
]

export const SCORPION: Part[] = [
  { d: 'M78 140 L52 162 M84 146 L66 176 M122 140 L148 162 M116 146 L134 176', tone: 'line', sw: 5 },
  { d: 'M100 150 C112 120 150 118 160 86 C168 60 150 36 128 44', tone: 'line', sw: 16 },
  { d: 'M120 46 L138 30 L140 56 Z', tone: 'dark' },
  { d: 'M70 120 C70 92 130 92 130 120 C130 150 70 150 70 120 Z', tone: 'mid' },
  { d: 'M76 104 L50 80 M124 104 L150 80', tone: 'line', sw: 8 },
  { d: 'M50 80 C30 82 26 58 40 52 L48 64 L52 48 C64 52 62 72 50 80 Z', tone: 'mid' },
  { d: 'M150 80 C170 82 174 58 160 52 L152 64 L148 48 C136 52 138 72 150 80 Z', tone: 'mid' },
]

export const WORM: Part[] = [
  { d: 'M24 140 C56 96 88 168 120 128 C140 104 160 118 178 96', tone: 'line', sw: 26 },
  { d: 'M24 140 C56 96 88 168 120 128 C140 104 160 118 178 96', tone: 'redLine', sw: 18 },
]

export const CLAM: Part[] = [
  { d: 'M100 172 L28 110 C38 54 162 54 172 110 Z', tone: 'light' },
  { d: 'M100 172 L48 80 M100 172 L76 64 M100 172 L100 60 M100 172 L124 64 M100 172 L152 80', tone: 'line', sw: 3 },
]

export const THERMO: Part[] = [
  { d: 'M86 28 C86 14 114 14 114 28 L114 128 C134 140 132 178 100 180 C68 178 66 140 86 128 Z', tone: 'light' },
  { d: 'M94 66 L106 66 L106 140 C118 146 116 168 100 168 C84 168 82 146 94 140 Z', tone: 'red' },
  { d: 'M118 44 L130 44 M118 68 L130 68 M118 92 L130 92 M118 116 L130 116', tone: 'line', sw: 3 },
]

export const SHIELD: Part[] = [
  { d: 'M100 16 L172 42 C172 110 146 160 100 186 C54 160 28 110 28 42 Z', tone: 'mid' },
  { d: 'M100 38 L150 56 C150 108 132 146 100 164 C68 146 50 108 50 56 Z', tone: 'light' },
]

export const DROP: Part[] = [{ d: 'M100 16 C132 68 162 100 162 132 C162 168 134 188 100 188 C66 188 38 168 38 132 C38 100 68 68 100 16 Z', tone: 'blue' }]

export const BACTERIA: Part[] = [
  { d: 'M40 90 C20 80 18 60 30 50 M160 110 C180 120 182 140 170 150 M70 70 C66 50 76 40 84 34', tone: 'line', sw: 3 },
  { d: 'M48 88 C48 66 152 66 152 88 L152 112 C152 134 48 134 48 112 Z', tone: 'mid' },
  { d: circle(80, 100, 6) + circle(112, 94, 5) + circle(128, 108, 6), tone: 'dark' },
]

export const EGGS: Part[] = [
  [70, 80, 24], [112, 70, 22], [144, 102, 24], [96, 116, 26], [56, 128, 22], [128, 144, 22], [90, 160, 20],
].map(([x, y, r]) => ({ d: circle(x, y, r), tone: 'light' as Tone }))

export const FISH: Part[] = [
  { d: 'M18 100 C58 58 122 58 152 100 C122 142 58 142 18 100 Z M150 100 L186 72 L180 100 L186 128 Z', tone: 'light' },
]

export const WAVES: Part[] = [
  { d: 'M0 70 C30 40 60 40 90 70 C120 100 150 100 180 70 C210 40 240 40 270 70 C300 100 330 100 360 70 L360 200 L0 200 Z', tone: 'blue' },
  { d: 'M0 110 C30 80 60 80 90 110 C120 140 150 140 180 110 C210 80 240 80 270 110 C300 140 330 140 360 110', tone: 'line', sw: 3 },
]

export const dnaParts = (): Part[] => {
  const a: string[] = []
  const b: string[] = []
  const rungs: string[] = []
  for (let i = 0; i <= 40; i++) {
    const y = 6 + i * 4.7
    const x = Math.sin(i / 40 * Math.PI * 3) * 34
    a.push(`${100 + x} ${y}`)
    b.push(`${100 - x} ${y}`)
    if (i % 3 === 0 && i > 0 && i < 40) rungs.push(`M${100 + x} ${y} L${100 - x} ${y}`)
  }
  return [
    { d: rungs.join(' '), tone: 'line', sw: 4 },
    { d: `M${a.join(' L')}`, tone: 'redLine', sw: 9 },
    { d: `M${b.join(' L')}`, tone: 'blueLine', sw: 9 },
  ]
}
