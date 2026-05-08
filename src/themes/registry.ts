import type { Theme } from './types'
import { skins } from './skins'

export { skins } from './skins'

const SKIN_KEY = 'mph-skin'

function variantKey(skinId: string) { return `mph-variant-${skinId}` }

export function loadSkinId(): string {
  return localStorage.getItem(SKIN_KEY) ?? skins[0].id
}
export function saveSkinId(id: string): void {
  localStorage.setItem(SKIN_KEY, id)
}

export function loadVariantId(skinId: string): string {
  const skin = skins.find(s => s.id === skinId) ?? skins[0]
  return localStorage.getItem(variantKey(skinId)) ?? skin.variants[0].id
}
export function saveVariantId(skinId: string, variantId: string): void {
  localStorage.setItem(variantKey(skinId), variantId)
}

export function resolveTheme(skinId: string, variantId: string): Theme {
  const skin    = skins.find(s => s.id === skinId) ?? skins[0]
  const variant = skin.variants.find(v => v.id === variantId) ?? skin.variants[0]
  return {
    id:            skin.id,
    name:          skin.name,
    tokens:        variant.tokens,
    copy:          skin.copy,
    widgets:       skin.widgets,
    defaultLayout: skin.defaultLayout,
    variantId:     variant.id,
    skinId:        skin.id,
  }
}

// Legacy
export function getThemes(): Theme[] {
  return skins.flatMap(skin => skin.variants.map(v => resolveTheme(skin.id, v.id)))
}
export function getTheme(id: string): Theme {
  return resolveTheme(id, loadVariantId(id))
}
