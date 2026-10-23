import { loadFont } from '@remotion/fonts'
import { staticFile } from 'remotion'

export const C = {
  maroon: '#5c0f16',
  maroonDeep: '#250408',
  cream: '#efe6d2',
  creamDim: '#c9bc9f',
  ink: '#1a1315',
  red: '#e23a2e',
  blue: '#2f6bff',
}

export const SERIF = 'Playfair Display'
export const HAND = 'Caveat'

// Font lokal (OFL) supaya render tidak bergantung internet
loadFont({ family: SERIF, url: staticFile('fonts/Playfair.woff2'), weight: '400 900' })
loadFont({ family: SERIF, url: staticFile('fonts/Playfair-Italic.woff2'), weight: '400 900', style: 'italic' })
loadFont({ family: HAND, url: staticFile('fonts/Caveat.woff2'), weight: '500 700' })
