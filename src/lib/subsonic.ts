const BASE = import.meta.env.VITE_NAVIDROME_URL
const USER = import.meta.env.VITE_NAVIDROME_USER
const PASS = import.meta.env.VITE_NAVIDROME_PASS

function authParams() {
  const hex = Array.from(PASS as string)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
  return `u=${USER}&p=enc:${hex}&v=1.16.1&c=phil9&f=json`
}

async function api(endpoint: string, extra?: Record<string, string | number>) {
  const extraStr = extra
    ? '&' + Object.entries(extra).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    : ''
  const res = await fetch(`${BASE}/rest/${endpoint}?${authParams()}${extraStr}`)
  const data = await res.json()
  const root = data['subsonic-response']
  if (root.status !== 'ok') throw new Error(root.error?.message ?? 'Subsonic API error')
  return root
}

export interface Album {
  id: string
  name: string
  artist: string
  coverArt?: string
  year?: number
  songCount: number
  duration: number
}

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  track?: number
  coverArt?: string
}

export async function getAlbumList(size = 50, offset = 0): Promise<Album[]> {
  const data = await api('getAlbumList2', { type: 'alphabeticalByArtist', size, offset })
  return data.albumList2?.album ?? []
}

export async function getAlbum(id: string): Promise<{ album: Album; tracks: Track[] }> {
  const data = await api('getAlbum', { id })
  const { song, ...album } = data.album
  return { album, tracks: song ?? [] }
}

export function streamUrl(id: string) {
  return `${BASE}/rest/stream?id=${id}&${authParams()}`
}

export function coverArtUrl(id: string, size = 200) {
  return `${BASE}/rest/getCoverArt?id=${id}&size=${size}&${authParams()}`
}
