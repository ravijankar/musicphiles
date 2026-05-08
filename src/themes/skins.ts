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
    defaultLayout: boomboxLayout,
  },
]

export function getSkin(id: string): Skin {
  return skins.find(s => s.id === id) ?? skins[0]
}
