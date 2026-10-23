import React from 'react'
import { Img, staticFile } from 'remotion'
import ASSETS from './assets.json'

// Foto cutout hasil Higgsfield (public/img). Kalau belum ada, tampilkan ilustrasi vektor sebagai cadangan.
const LIST = ASSETS as Record<string, [number, number]>

export const hasPic = (name: string) => name in LIST

export const Pic = ({ name, height, width, fallback, flip }: { name: string; height?: number; width?: number; fallback: React.ReactNode; flip?: boolean }) => {
  const size = LIST[name]
  if (!size) return <>{fallback}</>
  const [w, h] = size
  const H = height ?? ((width ?? w) * h) / w
  return <Img src={staticFile(`img/${name}.png`)} style={{ height: H, width: (H * w) / h, display: 'block', transform: flip ? 'scaleX(-1)' : undefined }} />
}
