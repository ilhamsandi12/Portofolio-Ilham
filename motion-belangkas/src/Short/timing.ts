import { WORDS } from './words'

export const FPS = 30
export const VO_START = 0.2
export const DURATION = 68 * FPS

export const sec = (i: number) => WORDS[i].start + VO_START
export const fr = (i: number) => Math.round(sec(i) * FPS)

// Indeks kata di WORDS yang jadi jangkar animasi
export const W = {
  bumi: 7, reset: 10, hewan: 12, lolos: 15,
  intro: 16, belangkas: 17, kepiting: 20, kerabat: 22, laba: 23, kala: 25,
  dying: 26, juta: 31, great: 34, sembilan: 39, persen: 41, belangkasQ: 44, tetap: 45,
  secrets: 47, makan: 48, tahan: 52, asin: 54, payau: 55, dingin: 56, minim: 58,
  cangkang: 60, darah: 63, gumpal: 66, telur: 70, ribuan: 72,
  evolve: 73, sebenarnya: 78, dia: 79, genom: 81, menggandakan: 85, tiga: 88,
  branch: 90, tawar: 95, berubah: 96, lalu: 99, bertahan: 101, desain: 104, karena: 106, pas: 108, dasar: 111,
  punch: 114, ngapain: 117,
  outro: 119, setelah: 120, ancaman: 126, kita: 129, indonesia: 130, dilindungi: 134, ketemu: 135, lepasin: 137,
}

export const SCENES = {
  hook: [0, fr(W.intro)],
  intro: [fr(W.intro), fr(W.dying)],
  dying: [fr(W.dying), fr(W.secrets)],
  secrets: [fr(W.secrets), fr(W.evolve)],
  evolve: [fr(W.evolve), fr(W.branch)],
  branch: [fr(W.branch), fr(W.punch)],
  punch: [fr(W.punch), fr(W.outro)],
  outro: [fr(W.outro), DURATION],
} as const
