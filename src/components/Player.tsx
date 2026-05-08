import { useApp, coverArtUrl } from '../contexts/AppContext'
import { useTheme } from '../contexts/ThemeContext'

function fmt(seconds: number) {
  if (!isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Player() {
  const { nowPlaying, isPlaying, currentTime, duration, volume, togglePlay, seek, setVolume } = useApp()
  const { theme } = useTheme()

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const isLive = nowPlaying?.type === 'radio'

  return (
    <div className="player">
      <div className="now-playing">
        {nowPlaying?.type === 'track' ? (
          <>
            {nowPlaying.track.coverArt && (
              <img src={coverArtUrl(nowPlaying.track.coverArt, 40)} alt="" />
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

      <div className="player-controls">
        <button
          className="play-btn"
          onClick={togglePlay}
          disabled={!nowPlaying}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {!isLive && (
          <div className="scrubber-wrap">
            <span className="time-display">{fmt(currentTime)}</span>
            <input
              type="range"
              className="scrubber"
              min={0}
              max={duration || 0}
              step={0.5}
              value={currentTime}
              onChange={e => seek(Number(e.target.value))}
              disabled={!nowPlaying || duration === 0}
              style={{ '--progress': `${progress}%` } as React.CSSProperties}
            />
            <span className="time-display">{fmt(duration)}</span>
          </div>
        )}
      </div>

      <div className="volume-wrap">
        <span className="vol-label">VOL</span>
        <input
          type="range"
          className="volume-slider"
          min={0}
          max={1}
          step={0.02}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
        />
        <span className="vol-pct">{Math.round(volume * 100)}</span>
      </div>
    </div>
  )
}
