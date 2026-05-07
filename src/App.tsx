import { useState } from 'react'
import { loadConfig } from './lib/config'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { AppProvider, useApp } from './contexts/AppContext'
import AlbumList from './components/AlbumList'
import TrackList from './components/TrackList'
import StationList from './components/StationList'
import ManageStations from './components/ManageStations'
import ThemeSwitcher from './components/ThemeSwitcher'
import Player from './components/Player'
import Canvas from './components/Canvas'
import Settings from './components/Settings'
import './App.css'

type View = 'library' | 'radio' | 'grid' | 'settings'

function AppShell() {
  const { theme } = useTheme()
  const {
    albums, selectedAlbum, loadError, openAlbum,
    stations, updateStations,
    nowPlaying, setNowPlaying,
  } = useApp()

  const [view, setView] = useState<View>(() => loadConfig() !== null ? 'library' : 'settings')
  const [managing, setManaging] = useState(false)

  return (
    <div className="app">
      <div className="tab-bar">
        <button className={`tab ${view === 'library' ? 'active' : ''}`} onClick={() => setView('library')}>
          {theme.copy.library}
        </button>
        <button className={`tab ${view === 'radio' ? 'active' : ''}`} onClick={() => setView('radio')}>
          {theme.copy.radio}
        </button>
        <button className={`tab ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
          ◫ BUILDER
        </button>
        <div className="tab-bar-spacer" />
        <button className={`tab ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')} title="Settings">
          ⚙
        </button>
        <ThemeSwitcher />
      </div>

      <div className="browser">
        {view === 'settings' ? (
          <Settings onSave={() => setView('library')} />
        ) : view === 'grid' ? (
          <Canvas />
        ) : view === 'library' ? (
          <>
            <AlbumList
              albums={albums}
              selectedId={selectedAlbum?.album.id ?? null}
              loadError={loadError}
              onSelect={openAlbum}
            />
            <TrackList
              selectedAlbum={selectedAlbum}
              playingId={nowPlaying?.type === 'track' ? nowPlaying.track.id : null}
              onPlay={track => setNowPlaying({ type: 'track', track })}
            />
          </>
        ) : (
          <>
            <StationList
              stations={stations}
              playingId={nowPlaying?.type === 'radio' ? nowPlaying.station.id : null}
              onTune={station => setNowPlaying({ type: 'radio', station })}
              onManage={() => setManaging(true)}
            />
            {managing ? (
              <ManageStations
                stations={stations}
                onChange={updateStations}
                onClose={() => setManaging(false)}
              />
            ) : (
              <div className="radio-empty">
                <p className="hint">← Select a station to tune in</p>
              </div>
            )}
          </>
        )}
      </div>

      <Player />
    </div>
  )
}

function AppWithProviders() {
  return (
    <AppProvider configured={loadConfig() !== null}>
      <AppShell />
    </AppProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppWithProviders />
    </ThemeProvider>
  )
}
