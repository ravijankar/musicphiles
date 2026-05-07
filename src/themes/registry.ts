import type { Theme } from './types'
import { phil9000 } from './phil9000'
import { terminalGreen } from './terminal-green'

// To add a theme: create a file in src/themes/, import it here, add to this array.
const registry: Theme[] = [
  phil9000,
  terminalGreen,
]

const STORAGE_KEY = 'mph-theme'

export function getThemes(): Theme[] {
  return registry
}

export function getTheme(id: string): Theme {
  return registry.find(t => t.id === id) ?? registry[0]
}

export function loadThemeId(): string {
  return localStorage.getItem(STORAGE_KEY) ?? registry[0].id
}

export function saveThemeId(id: string): void {
  localStorage.setItem(STORAGE_KEY, id)
}
