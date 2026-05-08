import type { Skin } from './types'
import type { LayoutItem } from '../widgets/types'

const phil9000Layout: LayoutItem[] = [
  { id: 'default-album',  widgetType: 'album-browser', col: 0,  row: 0,  colSpan: 20, rowSpan: 68 },
  { id: 'default-tracks', widgetType: 'track-list',    col: 21, row: 0,  colSpan: 26, rowSpan: 68 },
  { id: 'default-player', widgetType: 'player',        col: 0,  row: 69, colSpan: 62, rowSpan: 16 },
  { id: 'default-vu',     widgetType: 'vu-meter',      col: 90, row: 0,  colSpan: 6,  rowSpan: 85 },
  { id: 'default-knob',   widgetType: 'knob',          col: 48, row: 2,  colSpan: 7,  rowSpan: 10 },
]

const boomboxLayout: LayoutItem[] = [
  { id: 'bb-album',  widgetType: 'album-browser', col: 0,  row: 0,  colSpan: 20, rowSpan: 55 },
  { id: 'bb-tracks', widgetType: 'track-list',    col: 21, row: 0,  colSpan: 26, rowSpan: 55 },
  { id: 'bb-player', widgetType: 'player',        col: 0,  row: 56, colSpan: 47, rowSpan: 16 },
  { id: 'bb-vu-l',   widgetType: 'vu-meter',      col: 48, row: 0,  colSpan: 6,  rowSpan: 72 },
  { id: 'bb-vu-r',   widgetType: 'vu-meter',      col: 55, row: 0,  colSpan: 6,  rowSpan: 72 },
  { id: 'bb-knob',   widgetType: 'knob',          col: 48, row: 62, colSpan: 7,  rowSpan: 10 },
  { id: 'bb-dial',   widgetType: 'dial',          col: 56, row: 62, colSpan: 11, rowSpan: 10 },
]

export const skins: Skin[] = [
  {
    id: 'phil9000',
    name: 'PHIL 9000',
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
    variants: [
      {
        id: 'dark',
        name: 'Dark',
        tokens: {
          bg: '#0e0e0e', surface: '#1c1c1c', surface2: '#262626', border: '#3a3a3a',
          text: '#e8e8e8', muted: '#909090', accent: '#c8963e',
          fontFamily: "'Orbitron', sans-serif", fontSize: '15px',
        },
      },
      {
        id: 'white',
        name: 'White',
        tokens: {
          bg: '#f4f2ee', surface: '#ebebE7', surface2: '#e0deda', border: '#c8c4be',
          text: '#1a1a1a', muted: '#888880', accent: '#3a3a36',
          fontFamily: "'Orbitron', sans-serif", fontSize: '15px',
        },
      },
      {
        id: 'red',
        name: 'Red',
        tokens: {
          bg: '#0a0606', surface: '#180e0e', surface2: '#220e0e', border: '#3d1010',
          text: '#e8d8d8', muted: '#906060', accent: '#cc2200',
          fontFamily: "'Orbitron', sans-serif", fontSize: '15px',
        },
      },
    ],
    defaultLayout: phil9000Layout,
  },
  {
    id: 'terminal',
    name: 'Terminal',
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
    variants: [
      {
        id: 'green',
        name: 'Green',
        tokens: {
          bg: '#000000', surface: '#0a0a0a', surface2: '#111111', border: '#1a3a1a',
          text: '#00dd00', muted: '#2a6a2a', accent: '#00ff41',
          fontFamily: "'VT323', 'Courier New', monospace", fontSize: '20px',
        },
      },
      {
        id: 'amber',
        name: 'Amber',
        tokens: {
          bg: '#000000', surface: '#0a0800', surface2: '#110e00', border: '#3a2a00',
          text: '#ffaa00', muted: '#664400', accent: '#ffcc00',
          fontFamily: "'VT323', 'Courier New', monospace", fontSize: '20px',
        },
      },
      {
        id: 'paper',
        name: 'Paper',
        tokens: {
          bg: '#f0ede8', surface: '#e4e0da', surface2: '#d8d4ce', border: '#b8b4ae',
          text: '#1a1a14', muted: '#888878', accent: '#222214',
          fontFamily: "'VT323', 'Courier New', monospace", fontSize: '20px',
        },
      },
    ],
  },
  {
    id: 'boombox',
    name: 'Boombox',
    copy: {
      library: 'TRACKS',
      radio: 'FM RADIO',
      selectAlbum: '← Pick an album',
      manage: 'manage',
      live: '● FM',
      nothingPlaying: 'No tape inserted',
      manageStations: 'RADIO STATIONS',
      addStation: 'ADD STATION',
      back: '← back',
      noStations: 'No stations tuned.',
    },
    variants: [
      {
        id: 'warm',
        name: 'Warm',
        tokens: {
          bg: '#0c0900', surface: '#1a1400', surface2: '#252000', border: '#3d3010',
          text: '#f0e0a0', muted: '#806840', accent: '#d4a017',
          fontFamily: "'Audiowide', sans-serif", fontSize: '14px',
        },
      },
      {
        id: 'teal',
        name: 'Teal',
        tokens: {
          bg: '#030e0e', surface: '#071818', surface2: '#0a2020', border: '#103030',
          text: '#d0f0ee', muted: '#406860', accent: '#00c4b4',
          fontFamily: "'Audiowide', sans-serif", fontSize: '14px',
        },
      },
      {
        id: 'silver',
        name: 'Silver',
        tokens: {
          bg: '#d4d8dc', surface: '#c0c4c8', surface2: '#b0b4b8', border: '#8a9098',
          text: '#1a1e22', muted: '#5a6068', accent: '#5a9cc8',
          fontFamily: "'Audiowide', sans-serif", fontSize: '14px',
        },
      },
    ],
    defaultLayout: boomboxLayout,
  },
]

export function getSkin(id: string): Skin {
  return skins.find(s => s.id === id) ?? skins[0]
}
