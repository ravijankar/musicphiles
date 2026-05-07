import type { LayoutItem } from '../widgets/types'
import { makeId } from './id'

function key(themeId: string) {
  return `mph-layout-${themeId}`
}

export function loadLayout(themeId: string): LayoutItem[] {
  try {
    const raw = localStorage.getItem(key(themeId))
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

export function saveLayout(themeId: string, layout: LayoutItem[]): void {
  localStorage.setItem(key(themeId), JSON.stringify(layout))
}

export function clearLayout(themeId: string): void {
  localStorage.removeItem(key(themeId))
}

export { makeId as makeItemId }
