import type { Album } from '../lib/subsonic'
import { coverArtUrl } from '../lib/subsonic'

interface Props {
  albums: Album[]
  selectedId: string | null
  loadError: string | null
  onSelect: (album: Album) => void
}

export default function AlbumList({ albums, selectedId, loadError, onSelect }: Props) {
  return (
    <div className="album-list">
      {loadError && <div className="load-error">⚠ {loadError}</div>}
      {!loadError && albums.length === 0 && <div className="hint" style={{ padding: '16px 12px' }}>Loading…</div>}
      {albums.map(a => (
        <div
          key={a.id}
          className={`album-row ${selectedId === a.id ? 'active' : ''}`}
          onClick={() => onSelect(a)}
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
  )
}
