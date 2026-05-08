import type { AppContextValue } from '../contexts/AppContext'

export interface ButtonAction {
  key: string
  label: string
  getLabel: (app: AppContextValue) => string
  trigger: (app: AppContextValue) => void
}

export const BUTTON_ACTIONS: ButtonAction[] = [
  {
    key: 'play-pause',
    label: 'Play / Pause',
    getLabel: app => app.isPlaying ? '⏸ PAUSE' : '▶ PLAY',
    trigger: app => app.togglePlay(),
  },
  {
    key: 'mute',
    label: 'Mute',
    getLabel: app => app.volume === 0 ? '🔇 MUTED' : '🔊 MUTE',
    trigger: app => app.setVolume(app.volume === 0 ? 1 : 0),
  },
]

const STORAGE_KEY = 'mph-button-assignments'
type Assignments = Record<string, string>
let _cache: Assignments | null = null

function load(): Assignments {
  if (_cache) return _cache
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    _cache = raw ? JSON.parse(raw) : {}
  } catch { _cache = {} }
  return _cache!
}

function save(a: Assignments) { _cache = a; localStorage.setItem(STORAGE_KEY, JSON.stringify(a)) }

export function getButtonAssignment(instanceId: string): ButtonAction | null {
  return BUTTON_ACTIONS.find(a => a.key === load()[instanceId]) ?? null
}

export function setButtonAssignment(instanceId: string, key: string) {
  save({ ...load(), [instanceId]: key })
}
