import type { WidgetDef } from '../types'
import TrackList from '../../components/TrackList'
import { useApp } from '../../contexts/AppContext'

function TrackListWidget() {
  const { selectedAlbum, nowPlaying, setNowPlaying } = useApp()
  return (
    <div className="widget-fill">
      <TrackList
        selectedAlbum={selectedAlbum}
        playingId={nowPlaying?.type === 'track' ? nowPlaying.track.id : null}
        onPlay={track => setNowPlaying({ type: 'track', track })}
      />
    </div>
  )
}

export const trackListWidget: WidgetDef = {
  type: 'track-list',
  name: 'Track List',
  description: 'Tracks for the selected album',
  minColSpan: 14,
  minRowSpan: 20,
  defaultColSpan: 28,
  defaultRowSpan: 72,
  component: TrackListWidget,
}
