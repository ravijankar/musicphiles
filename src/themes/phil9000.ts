import type { Theme } from './types'

// Canvas: 96 cols × 104 rows (1194×834px, 8px row height)
// Layout: album browser left | track list center | player bottom | VU meter right strip | volume knob

export const phil9000: Theme = {
  id: 'phil9000',
  name: 'PHIL 9000',
  tokens: {
    bg: '#0e0e0e',
    surface: '#1c1c1c',
    surface2: '#262626',
    border: '#3a3a3a',
    text: '#e8e8e8',
    muted: '#909090',
    accent: '#c8963e',
    fontFamily: "'Share Tech Mono', 'Courier New', monospace",
    fontSize: '18px',
  },
  copy: {
    library: 'LIBRARY',
    radio: 'RADIO',
    selectAlbum: '← Select an album',
    manage: 'manage',
    live: '● LIVE',
    nothingPlaying: 'Nothing playing',
    manageStations: 'MANAGE STATIONS',
    addStation: 'ADD STATION',
    back: '← back',
    noStations: 'No stations. Add one.',
  },
  defaultLayout: [
    { id: 'default-album',   widgetType: 'album-browser', col: 0,  row: 0,  colSpan: 27, rowSpan: 76 },
    { id: 'default-tracks',  widgetType: 'track-list',    col: 28, row: 0,  colSpan: 36, rowSpan: 76 },
    { id: 'default-player',  widgetType: 'player',        col: 0,  row: 77, colSpan: 87, rowSpan: 26 },
    { id: 'default-vu',      widgetType: 'vu-meter',      col: 88, row: 0,  colSpan: 8,  rowSpan: 103 },
    { id: 'default-knob',    widgetType: 'knob',          col: 65, row: 2,  colSpan: 9,  rowSpan: 14 },
  ],
}
