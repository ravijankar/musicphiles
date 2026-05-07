import type { RadioStation } from '../lib/stations'
import { useTheme } from '../contexts/ThemeContext'

interface Props {
  stations: RadioStation[]
  playingId: string | null
  onTune: (station: RadioStation) => void
  onManage: () => void
}

export default function StationList({ stations, playingId, onTune, onManage }: Props) {
  const { theme } = useTheme()
  return (
    <div className="station-list">
      <div className="station-list-header">
        <span className="station-list-title">{theme.copy.radio}</span>
        <button className="text-btn" onClick={onManage}>{theme.copy.manage}</button>
      </div>
      {stations.map(s => (
        <div
          key={s.id}
          className={`station-row ${playingId === s.id ? 'active' : ''}`}
          onClick={() => onTune(s)}
        >
          <div className="station-dot" />
          <span className="station-name">{s.name}</span>
        </div>
      ))}
      {stations.length === 0 && (
        <p className="hint" style={{ padding: '16px 12px' }}>{theme.copy.noStations}</p>
      )}
    </div>
  )
}
