import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { getAlbumList, getAlbum, streamUrl, coverArtUrl as _coverArtUrl } from '../lib/subsonic'
import type { Album, Track } from '../lib/subsonic'
import { loadStations, saveStations } from '../lib/stations'
import type { RadioStation } from '../lib/stations'
import { loadConfig } from '../lib/config'

export type NowPlaying =
  | { type: 'track'; track: Track }
  | { type: 'radio'; station: RadioStation }

export interface AppContextValue {
  // library
  albums: Album[]
  selectedAlbum: { album: Album; tracks: Track[] } | null
  loadError: string | null
  openAlbum: (album: Album) => void

  // radio
  stations: RadioStation[]
  updateStations: (next: RadioStation[]) => void

  // playback
  nowPlaying: NowPlaying | null
  setNowPlaying: (np: NowPlaying | null) => void
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  togglePlay: () => void
  seek: (time: number) => void
  setVolume: (v: number) => void
  reloadLibrary: () => void

  // audio analysis
  getAnalyser: () => AnalyserNode | null
}

const AppContext = createContext<AppContextValue>(null!)

export function AppProvider({ children, configured }: { children: React.ReactNode; configured: boolean }) {
  const audioRef = useRef<HTMLAudioElement>((() => { const a = new Audio(); a.volume = 0.5; return a })())
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<{ album: Album; tracks: Track[] } | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [stations, setStations] = useState<RadioStation[]>(loadStations)
  const [nowPlaying, setNowPlayingState] = useState<NowPlaying | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.5)

  // Lazy-init Web Audio on first play (requires user gesture)
  function ensureAudioGraph() {
    if (analyserRef.current) return
    try {
      const ctx = new AudioContext()
      const source = ctx.createMediaElementSource(audioRef.current)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)
      analyser.connect(ctx.destination)
      audioCtxRef.current = ctx
      analyserRef.current = analyser
    } catch {}
  }

  const getAnalyser = useCallback((): AnalyserNode | null => analyserRef.current, [])

  const reloadLibrary = useCallback(() => {
    setAlbums([])
    setLoadError(null)
    getAlbumList(100).then(setAlbums).catch(e => setLoadError(String(e)))
  }, [])

  useEffect(() => {
    if (!configured) return
    reloadLibrary()
  }, [configured, reloadLibrary])

  useEffect(() => {
    const audio = audioRef.current
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(isFinite(audio.duration) ? audio.duration : 0)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!nowPlaying) return
    audio.src = nowPlaying.type === 'track'
      ? streamUrl(nowPlaying.track.id)
      : nowPlaying.station.url
    ensureAudioGraph()
    const ctx = audioCtxRef.current
    if (ctx) {
      ctx.resume().then(() => audio.play().catch(() => {}))
    } else {
      audio.play().catch(() => {})
    }
  }, [nowPlaying])

  const openAlbum = useCallback(async (album: Album) => {
    const data = await getAlbum(album.id)
    setSelectedAlbum(data)
  }, [])

  const updateStations = useCallback((next: RadioStation[]) => {
    setStations(next)
    saveStations(next)
  }, [])

  const setNowPlaying = useCallback((np: NowPlaying | null) => {
    setNowPlayingState(np)
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
    } else {
      ensureAudioGraph()
      audioCtxRef.current?.resume()
      audio.play().catch(() => {})
    }
  }, [isPlaying])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  const setVolume = useCallback((v: number) => {
    audioRef.current.volume = v
    setVolumeState(v)
  }, [])

  return (
    <AppContext.Provider value={{
      albums, selectedAlbum, loadError, openAlbum,
      stations, updateStations,
      nowPlaying, setNowPlaying,
      isPlaying, currentTime, duration, volume,
      togglePlay, seek, setVolume, reloadLibrary,
      getAnalyser,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}

export { _coverArtUrl as coverArtUrl }
