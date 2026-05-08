import type { AppContextValue } from '../contexts/AppContext'

export interface KnobSetting {
  key: string
  label: string
  min: number
  max: number
  step: number
  getValue: (app: AppContextValue) => number
  setValue: (app: AppContextValue, v: number) => void
  format: (v: number) => string
}

export const KNOB_SETTINGS: KnobSetting[] = [
  {
    key: 'volume',
    label: 'Volume',
    min: 0,
    max: 1,
    step: 0.01,
    getValue: app => app.volume,
    setValue: (app, v) => app.setVolume(v),
    format: v => `${Math.round(v * 100)}%`,
  },
]

const STORAGE_KEY = 'mph-knob-assignments'

type Assignments = Record<string, string>

let _cache: Assignments | null = null

function load(): Assignments {
  if (_cache) return _cache
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    _cache = raw ? JSON.parse(raw) : {}
  } catch {
    _cache = {}
  }
  return _cache!
}

function save(assignments: Assignments): void {
  _cache = assignments
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments))
}

export function getKnobAssignment(instanceId: string): KnobSetting | null {
  const key = load()[instanceId]
  return KNOB_SETTINGS.find(s => s.key === key) ?? null
}

export function setKnobAssignment(instanceId: string, settingKey: string): void {
  const assignments = { ...load(), [instanceId]: settingKey }
  save(assignments)
}

export function clearKnobAssignment(instanceId: string): void {
  const assignments = { ...load() }
  delete assignments[instanceId]
  save(assignments)
}
