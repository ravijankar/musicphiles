import type { WidgetDef } from '../types'
import { useApp, coverArtUrl } from '../../contexts/AppContext'
import { useTheme } from '../../contexts/ThemeContext'

function fmt(s: number) {
  if (!isFinite(s)) return '0:00'
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
}

function PlayerWidget() {
  const { nowPlaying, isPlaying, currentTime, duration, volume, togglePlay, seek, setVolume } = useApp()
  const { theme } = useTheme()
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const isLive = nowPlaying?.type === 'radio'

  return (
    <div className="widget-player">
      <div className="widget-player-meta">
        {nowPlaying?.type === 'track' ? (
          <>
            {nowPlaying.track.coverArt && (
              <img src={coverArtUrl(nowPlaying.track.coverArt, 48)} alt="" className="widget-player-art" />
            )}
            <div className="np-text">
              <span className="np-title">{nowPlaying.track.title}</span>
              <span className="np-artist">{nowPlaying.track.artist}</span>
            </div>
          </>
        ) : nowPlaying?.type === 'radio' ? (
          <div className="np-text">
            <span className="np-title">{nowPlaying.station.name}</span>
            <span className="np-artist np-live">{theme.copy.live}</span>
          </div>
        ) : (
          <span className="hint">{theme.copy.nothingPlaying}</span>
        )}
      </div>

      <div className="widget-player-controls">
        <button className="play-btn" onClick={togglePlay} disabled={!nowPlaying}>
          {isPlaying ? '⏸' : '▶'}
        </button>

        {!isLive && (
          <div className="scrubber-wrap">
            <span className="time-display">{fmt(currentTime)}</span>
            <input
              type="range" className="scrubber"
              min={0} max={duration || 0} step={0.5} value={currentTime}
              onChange={e => seek(Number(e.target.value))}
              disabled={!nowPlaying || duration === 0}
              style={{ '--progress': `${progress}%` } as React.CSSProperties}
            />
            <span className="time-display">{fmt(duration)}</span>
          </div>
        )}

        <div className="volume-wrap">
          <span className="vol-icon">{volume === 0 ? '🔇' : '🔊'}</span>
          <input
            type="range" className="volume-slider"
            min={0} max={1} step={0.02} value={volume}
            onChange={e => setVolume(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}

export const playerWidget: WidgetDef = {
  type: 'player',
  name: 'Player',
  description: 'Playback controls, scrubber, and volume',
  minColSpan: 20,
  minRowSpan: 8,
  defaultColSpan: 28,
  defaultRowSpan: 32,
  component: PlayerWidget,
}
