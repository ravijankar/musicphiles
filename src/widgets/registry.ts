import type { WidgetDef } from './types'
import { albumBrowserWidget } from './base/AlbumBrowserWidget'
import { trackListWidget } from './base/TrackListWidget'
import { playerWidget } from './base/PlayerWidget'
import { radioWidget } from './base/RadioWidget'
import { knobWidget } from './base/KnobWidget'
import { dialWidget } from './base/DialWidget'
import { buttonWidget } from './base/ButtonWidget'
import { vuMeterWidget } from './base/VuMeterWidget'

const BASE_WIDGETS: WidgetDef[] = [
  albumBrowserWidget,
  trackListWidget,
  playerWidget,
  radioWidget,
  knobWidget,
  dialWidget,
  buttonWidget,
  vuMeterWidget,
]

let _themeWidgets: WidgetDef[] = []
let _cache: WidgetDef[] | null = null

export function registerThemeWidgets(widgets: WidgetDef[]) {
  _themeWidgets = widgets
  _cache = null
}

export function getWidgetRegistry(): WidgetDef[] {
  if (_cache) return _cache
  const seen = new Set<string>()
  const merged: WidgetDef[] = []
  for (const w of [..._themeWidgets, ...BASE_WIDGETS]) {
    if (!seen.has(w.type)) {
      seen.add(w.type)
      merged.push(w)
    }
  }
  return (_cache = merged)
}

export function getWidgetDef(type: string): WidgetDef | undefined {
  return getWidgetRegistry().find(w => w.type === type)
}
