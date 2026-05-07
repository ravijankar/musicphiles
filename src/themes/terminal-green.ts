import type { Theme } from './types'

export const terminalGreen: Theme = {
  id: 'terminal-green',
  name: 'Terminal',
  tokens: {
    bg: '#000000',
    surface: '#0a0a0a',
    surface2: '#111111',
    border: '#1a3a1a',
    text: '#00dd00',
    muted: '#2a6a2a',
    accent: '#00ff41',
    fontFamily: "'VT323', 'Courier New', monospace",
    fontSize: '15px',
  },
  copy: {
    library: 'FILES',
    radio: 'BROADCAST',
    selectAlbum: '← Select a directory',
    manage: 'configure',
    live: '● ON AIR',
    nothingPlaying: 'NO SIGNAL',
    manageStations: 'CONFIGURE BROADCASTS',
    addStation: 'ADD BROADCAST',
    back: '← exit',
    noStations: 'No broadcasts configured.',
  },
}
