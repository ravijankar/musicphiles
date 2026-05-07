import type { WidgetDef } from '../types'
import AlbumList from '../../components/AlbumList'
import { useApp } from '../../contexts/AppContext'

function AlbumBrowserWidget() {
  const { albums, selectedAlbum, loadError, openAlbum } = useApp()
  return (
    <div className="widget-fill">
      <AlbumList
        albums={albums}
        selectedId={selectedAlbum?.album.id ?? null}
        loadError={loadError}
        onSelect={openAlbum}
      />
    </div>
  )
}

export const albumBrowserWidget: WidgetDef = {
  type: 'album-browser',
  name: 'Album Browser',
  description: 'Browse and select albums from your library',
  minColSpan: 12,
  minRowSpan: 20,
  defaultColSpan: 20,
  defaultRowSpan: 104,
  component: AlbumBrowserWidget,
}
