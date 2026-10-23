import React from 'react'
import { C } from './theme'

// Belangkas tampak atas (kepala di atas), digambar seperti potongan foto cetak halftone
const PROSOMA = 'M20 330 C16 175 98 50 200 46 C302 50 384 175 380 330 Q292 306 200 316 Q108 306 20 330 Z'
const OPISTHO = 'M58 326 L342 326 L330 380 L316 430 L290 486 L262 528 L138 528 L110 486 L84 430 L70 380 Z'
const TELSON = 'M187 524 L213 524 L203 716 L197 716 Z'

const spines = (side: 1 | -1) =>
  Array.from({ length: 6 }, (_, i) => {
    const t = (i + 0.5) / 6
    const x = 200 + side * (138 - 62 * t + 4)
    const y = 352 + t * 160
    const bx = x + side * 26
    return `M${x} ${y - 9} L${bx} ${y + 4} L${x} ${y + 9} Z`
  }).join(' ')

let uid = 0

type Props = {
  height: number
  frame: number
  walking?: boolean
  glasses?: number
  // Varian bentuk untuk kerabat air tawar yang "berubah drastis"
  stretch?: [number, number]
  spiky?: boolean
  gray?: number
}

export const Belangkas = ({ height, frame, walking, glasses = 0, stretch = [1, 1], spiky, gray = 0 }: Props) => {
  const id = React.useMemo(() => `blk${++uid}`, [])
  const sway = walking ? Math.sin(frame / 3.5) * 7 : Math.sin(frame / 18) * 3
  const leg = walking ? Math.sin(frame / 2.2) * 14 : Math.sin(frame / 12) * 3
  const [sx, sy] = stretch
  const body = (
    <>
      <path d={OPISTHO} transform={`translate(200 326) scale(${sx} ${sy}) translate(-200 -326)`} />
      <path d={PROSOMA} />
    </>
  )
  return (
    <svg viewBox="-40 -40 480 790" height={height} width={(height * 480) / 790} style={{ overflow: 'visible', display: 'block', filter: gray ? `grayscale(${gray}) brightness(${1 - gray * 0.35})` : undefined }}>
      <defs>
        <radialGradient id={`${id}-shell`} cx="50%" cy="28%" r="78%">
          <stop offset="0" stopColor="#ece4d3" />
          <stop offset="0.5" stopColor="#9e927f" />
          <stop offset="1" stopColor="#3c342d" />
        </radialGradient>
        <radialGradient id={`${id}-shade`} cx="50%" cy="34%" r="66%">
          <stop offset="0.25" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </radialGradient>
        <pattern id={`${id}-dots`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx="5" cy="5" r="2.6" fill={C.ink} />
        </pattern>
        <mask id={`${id}-m`}>
          <rect x="-40" y="-40" width="480" height="790" fill={`url(#${id}-shade)`} />
        </mask>
      </defs>

      {/* Kaki yang mengintip dari bawah karapas */}
      {[0, 1, 2, 3].map((i) =>
        ([1, -1] as const).map((s) => (
          <g key={`${i}${s}`} transform={`translate(${200 + s * (150 - i * 14)} ${250 + i * 22}) rotate(${s * (12 + i * 8 + (i % 2 ? leg : -leg))})`}>
            <path d={`M0 0 L${s * 70} 18 L${s * 92} 40`} fill="none" stroke={C.ink} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )),
      )}

      {/* Tepi kertas potongan */}
      <g fill={C.cream} stroke={C.cream} strokeWidth="26" strokeLinejoin="round">
        {body}
        <path d={spines(1) + spines(-1)} transform={`translate(200 326) scale(${sx} ${sy}) translate(-200 -326)`} />
        <g transform={`rotate(${sway} 200 526)`}>
          <path d={TELSON} />
        </g>
      </g>

      <g transform={`rotate(${sway} 200 526)`}>
        <path d={TELSON} fill={`url(#${id}-shell)`} stroke={C.ink} strokeWidth="3" />
      </g>
      <g transform={`translate(200 326) scale(${sx} ${sy}) translate(-200 -326)`}>
        <path d={spines(1) + spines(-1)} fill="#4b4139" stroke={C.ink} strokeWidth="2" />
        {spiky && <path d="M200 330 L186 260 L214 260 Z M150 420 L110 600 L170 450 Z M250 420 L290 600 L230 450 Z" fill="#4b4139" stroke={C.ink} strokeWidth="3" />}
        <path d={OPISTHO} fill={`url(#${id}-shell)`} stroke={C.ink} strokeWidth="4" />
        <path d="M200 336 L200 520 M150 340 L140 516 M250 340 L260 516" fill="none" stroke={C.ink} strokeWidth="3" opacity="0.6" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} fill={C.ink} opacity="0.55">
            <circle cx="174" cy={356 + i * 28} r="5" />
            <circle cx="226" cy={356 + i * 28} r="5" />
          </g>
        ))}
      </g>
      <path d={PROSOMA} fill={`url(#${id}-shell)`} stroke={C.ink} strokeWidth="4" />
      <path d="M46 318 C44 188 114 78 200 74 C286 78 356 188 354 318" fill="none" stroke={C.ink} strokeWidth="3" opacity="0.45" />
      <path d="M200 84 L200 304 M128 124 C112 184 108 252 116 312 M272 124 C288 184 292 252 284 312" fill="none" stroke={C.ink} strokeWidth="4" opacity="0.6" />

      <g mask={`url(#${id}-m)`} opacity="0.6">
        <path d={PROSOMA} fill={`url(#${id}-dots)`} />
        <path d={OPISTHO} fill={`url(#${id}-dots)`} transform={`translate(200 326) scale(${sx} ${sy}) translate(-200 -326)`} />
      </g>

      {/* Mata majemuk + oseli */}
      <ellipse cx="122" cy="188" rx="13" ry="24" transform="rotate(-14 122 188)" fill={C.ink} />
      <ellipse cx="278" cy="188" rx="13" ry="24" transform="rotate(14 278 188)" fill={C.ink} />
      <circle cx="193" cy="104" r="4.5" fill={C.ink} />
      <circle cx="207" cy="104" r="4.5" fill={C.ink} />

      {glasses > 0 && (
        <g transform={`translate(0 ${(1 - glasses) * -520})`} opacity={Math.min(1, glasses * 4)}>
          <path d="M78 170 L322 170 L322 182 L300 182 C298 226 250 234 236 206 L224 186 L176 186 L164 206 C150 234 102 226 100 182 L78 182 Z" fill="#0d0b0c" stroke={C.cream} strokeWidth="8" strokeLinejoin="round" />
          <path d="M112 186 L140 186 L118 214 Z M252 186 L280 186 L258 214 Z" fill="rgba(255,255,255,0.35)" />
        </g>
      )}
    </svg>
  )
}
