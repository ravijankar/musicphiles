import type { WidgetDef } from '../types'
import StationList from '../../components/StationList'
import { useApp } from '../../contexts/AppContext'
import { useState } from 'react'
import ManageStations from '../../components/ManageStations'

function RadioWidget() {
  const { stations, nowPlaying, setNowPlaying, updateStations } = useApp()
  const [managing, setManaging] = useState(false)

  if (managing) {
    return (
      <div className="widget-fill">
        <ManageStations
          stations={stations}
          onChange={updateStations}
          onClose={() => setManaging(false)}
        />
      </div>
    )
  }

  return (
    <div className="widget-fill">
      <StationList
        stations={stations}
        playingId={nowPlaying?.type === 'radio' ? nowPlaying.station.id : null}
        onTune={station => setNowPlaying({ type: 'radio', station })}
        onManage={() => setManaging(true)}
      />
    </div>
  )
}

export const radioWidget: WidgetDef = {
  type: 'radio',
  name: 'Radio',
  description: 'Live radio station list and tuner',
  minColSpan: 10,
  minRowSpan: 16,
  defaultColSpan: 18,
  defaultRowSpan: 40,
  component: RadioWidget,
}
