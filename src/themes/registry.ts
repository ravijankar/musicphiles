import type { Theme } from './types'
import { palettes, getPalette } from './palettes'
import { skins, getSkin } from './skins'

export { palettes, getPalette } from './palettes'
export { skins, getSkin } from './skins'

const PALETTE_KEY = 'mph-palette'
const SKIN_KEY    = 'mph-skin'

export function loadPaletteId(): string {
  return localStorage.getItem(PALETTE_KEY) ?? palettes[0].id
}
export function savePaletteId(id: string): void {
  localStorage.setItem(PALETTE_KEY, id)
}

export function loadSkinId(): string {
  return localStorage.getItem(SKIN_KEY) ?? skins[0].id
}
export function saveSkinId(id: string): void {
  localStorage.setItem(SKIN_KEY, id)
}

export function resolveTheme(paletteId: string, skinId: string): Theme {
  const palette = getPalette(paletteId)
  const skin    = getSkin(skinId)
  return {
    id:            skin.id,
    name:          skin.name,
    tokens:        palette.tokens,
    copy:          skin.copy,
    widgets:       skin.widgets,
    defaultLayout: skin.defaultLayout,
    paletteId:     palette.id,
    skinId:        skin.id,
  }
}

// Legacy — kept so any old import of getThemes()/getTheme() still compiles
export function getThemes(): Theme[] {
  return skins.flatMap(skin =>
    palettes.map(palette => resolveTheme(palette.id, skin.id))
  )
}
export function getTheme(id: string): Theme {
  return resolveTheme(loadPaletteId(), id)
}
