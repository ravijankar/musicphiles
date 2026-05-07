import { loadConfig } from './config'

function getConfig() {
  const cfg = loadConfig()
  if (!cfg) throw new Error('Navidrome not configured')
  return cfg
}

function authParams(user: string, pass: string) {
  const hex = Array.from(pass)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
  return `u=${encodeURIComponent(user)}&p=enc:${hex}&v=1.16.1&c=musicphiles&f=json`
}

async function api(endpoint: string, extra?: Record<string, string | number>) {
  const { navidromeUrl, navidromeUser, navidromePass } = getConfig()
  const extraStr = extra
    ? '&' + Object.entries(extra).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    : ''
  const url = `${navidromeUrl}/rest/${endpoint}?${authParams(navidromeUser, navidromePass)}${extraStr}`
  const res = await fetch(url)
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
  const { navidromeUrl, navidromeUser, navidromePass } = getConfig()
  return `${navidromeUrl}/rest/stream?id=${id}&${authParams(navidromeUser, navidromePass)}`
}

export function coverArtUrl(id: string, size = 200) {
  const { navidromeUrl, navidromeUser, navidromePass } = getConfig()
  return `${navidromeUrl}/rest/getCoverArt?id=${id}&size=${size}&${authParams(navidromeUser, navidromePass)}`
}

export async function testConnection(): Promise<void> {
  await api('ping')
}
