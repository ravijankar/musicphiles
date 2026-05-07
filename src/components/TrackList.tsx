import type { Album, Track } from '../lib/subsonic'
import { coverArtUrl } from '../lib/subsonic'
import { useTheme } from '../contexts/ThemeContext'

interface Props {
  selectedAlbum: { album: Album; tracks: Track[] } | null
  playingId: string | null
  onPlay: (track: Track) => void
}

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TrackList({ selectedAlbum, playingId, onPlay }: Props) {
  const { theme } = useTheme()
  if (!selectedAlbum) {
    return <div className="track-list"><p className="hint">{theme.copy.selectAlbum}</p></div>
  }

  const { album, tracks } = selectedAlbum

  return (
    <div className="track-list">
      <div className="track-list-header">
        {album.coverArt && (
          <img src={coverArtUrl(album.coverArt, 120)} alt="" className="album-art" />
        )}
        <div>
          <h2>{album.name}</h2>
          <p>{album.artist}{album.year ? ` · ${album.year}` : ''}</p>
        </div>
      </div>
      {tracks.map(t => (
        <div
          key={t.id}
          className={`track-row ${playingId === t.id ? 'active' : ''}`}
          onClick={() => onPlay(t)}
        >
          <span className="track-num">{t.track ?? '·'}</span>
          <span className="track-title">{t.title}</span>
          <span className="track-dur">{fmt(t.duration)}</span>
        </div>
      ))}
    </div>
  )
}
