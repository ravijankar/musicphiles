import { useState, useEffect, useRef } from 'react'
import { getAlbumList, getAlbum, streamUrl, coverArtUrl } from './lib/subsonic'
import type { Album, Track } from './lib/subsonic'
import './App.css'

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function App() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<{ album: Album; tracks: Track[] } | null>(null)
  const [playing, setPlaying] = useState<Track | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    getAlbumList(100).then(setAlbums).catch(e => setLoadError(String(e)))
  }, [])

  async function openAlbum(album: Album) {
    const data = await getAlbum(album.id)
    setSelectedAlbum(data)
  }

  function playTrack(track: Track) {
    setPlaying(track)
    const audio = audioRef.current!
    audio.src = streamUrl(track.id)
    audio.play()
  }

  return (
    <div className="app">
      <div className="browser">
        <div className="album-list">
          {loadError && <div className="load-error">⚠ {loadError}</div>}
          {!loadError && albums.length === 0 && <div className="load-error">Loading…</div>}
          {albums.map(a => (
            <div
              key={a.id}
              className={`album-row ${selectedAlbum?.album.id === a.id ? 'active' : ''}`}
              onClick={() => openAlbum(a)}
            >
              {a.coverArt
                ? <img className="thumb" src={coverArtUrl(a.coverArt, 48)} alt="" />
                : <div className="thumb thumb-placeholder" />
              }
              <div className="album-meta">
                <span className="album-name">{a.name}</span>
                <span className="album-artist">{a.artist}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="track-list">
          {selectedAlbum ? (
            <>
              <div className="track-list-header">
                {selectedAlbum.album.coverArt && (
                  <img src={coverArtUrl(selectedAlbum.album.coverArt, 120)} alt="" className="album-art" />
                )}
                <div>
                  <h2>{selectedAlbum.album.name}</h2>
                  <p>{selectedAlbum.album.artist}{selectedAlbum.album.year ? ` · ${selectedAlbum.album.year}` : ''}</p>
                </div>
              </div>
              {selectedAlbum.tracks.map(t => (
                <div
                  key={t.id}
                  className={`track-row ${playing?.id === t.id ? 'active' : ''}`}
                  onClick={() => playTrack(t)}
                >
                  <span className="track-num">{t.track ?? '·'}</span>
                  <span className="track-title">{t.title}</span>
                  <span className="track-dur">{fmt(t.duration)}</span>
                </div>
              ))}
            </>
          ) : (
            <p className="hint">← Select an album</p>
          )}
        </div>
      </div>

      <div className="player">
        {playing ? (
          <div className="now-playing">
            {playing.coverArt && <img src={coverArtUrl(playing.coverArt, 40)} alt="" />}
            <div className="np-text">
              <span className="np-title">{playing.title}</span>
              <span className="np-artist">{playing.artist}</span>
            </div>
          </div>
        ) : (
          <div className="now-playing"><span className="hint">Nothing playing</span></div>
        )}
        <audio ref={audioRef} controls />
      </div>
    </div>
  )
}
