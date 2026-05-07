export interface RadioStation {
  id: string
  name: string
  url: string
}

const PRESETS: RadioStation[] = [
  { id: 'kexp',       name: 'KEXP · Seattle',             url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3' },
  { id: 'wfmu',       name: 'WFMU · Jersey City',         url: 'https://stream.wfmu.org/freeform-128k' },
  { id: 'kcrw',       name: 'KCRW · Santa Monica',        url: 'https://streams.kcrw.com/kcrw_128k.mp3' },
  { id: 'rp-main',    name: 'Radio Paradise · Main Mix',  url: 'https://stream.radioparadise.com/mp3-128' },
  { id: 'soma-groove', name: 'SomaFM · Groove Salad',     url: 'https://ice6.somafm.com/groovesalad-128-mp3' },
]

const STORAGE_KEY = 'mph-stations'

export function loadStations(): RadioStation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.length > 0) return parsed
    }
  } catch {}
  return PRESETS
}

export function saveStations(stations: RadioStation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stations))
}

export { makeId } from './id'
