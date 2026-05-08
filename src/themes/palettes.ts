import type { Palette } from './types'

export const palettes: Palette[] = [
  {
    id: 'dark-amber',
    name: 'Dark Amber',
    tokens: {
      bg: '#0e0e0e',
      surface: '#1c1c1c',
      surface2: '#262626',
      border: '#3a3a3a',
      text: '#e8e8e8',
      muted: '#909090',
      accent: '#c8963e',
      fontFamily: "'Orbitron', sans-serif",
      fontSize: '15px',
    },
  },
  {
    id: 'terminal-green',
    name: 'Terminal Green',
    tokens: {
      bg: '#000000',
      surface: '#0a0a0a',
      surface2: '#111111',
      border: '#1a3a1a',
      text: '#00dd00',
      muted: '#2a6a2a',
      accent: '#00ff41',
      fontFamily: "'VT323', 'Courier New', monospace",
      fontSize: '20px',
    },
  },
  {
    id: 'gold-black',
    name: 'Gold',
    tokens: {
      bg: '#0c0900',
      surface: '#1a1400',
      surface2: '#252000',
      border: '#3d3010',
      text: '#f0e0a0',
      muted: '#806840',
      accent: '#d4a017',
      fontFamily: "'Audiowide', sans-serif",
      fontSize: '14px',
    },
  },
]

export function getPalette(id: string): Palette {
  return palettes.find(p => p.id === id) ?? palettes[0]
}
