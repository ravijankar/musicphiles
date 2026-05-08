import { createContext, useContext, useState, useEffect } from 'react'
import type { Theme, Variant, Skin } from '../themes/types'
import { skins, resolveTheme, loadSkinId, saveSkinId, loadVariantId, saveVariantId } from '../themes/registry'
import { registerThemeWidgets } from '../widgets/registry'

interface ThemeContextValue {
  theme: Theme
  variant: Variant
  variants: Variant[]
  skin: Skin
  skins: Skin[]
  setVariant: (id: string) => void
  setSkin: (id: string) => void
}

const ThemeContext = createContext<ThemeContextValue>(null!)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [skinId,    setSkinId]    = useState(loadSkinId)
  const [variantId, setVariantId] = useState(() => loadVariantId(loadSkinId()))

  const skin    = skins.find(s => s.id === skinId)    ?? skins[0]
  const variant = skin.variants.find(v => v.id === variantId) ?? skin.variants[0]
  const theme   = resolveTheme(skinId, variant.id)

  useEffect(() => {
    registerThemeWidgets(skin.widgets ?? [])
  }, [skin])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme',   skinId)
    root.setAttribute('data-variant', variant.id)
    const { tokens } = theme
    root.style.setProperty('--bg',          tokens.bg)
    root.style.setProperty('--surface',     tokens.surface)
    root.style.setProperty('--surface2',    tokens.surface2)
    root.style.setProperty('--border',      tokens.border)
    root.style.setProperty('--text',        tokens.text)
    root.style.setProperty('--muted',       tokens.muted)
    root.style.setProperty('--accent',      tokens.accent)
    root.style.setProperty('--font-family', tokens.fontFamily)
    root.style.setProperty('--font-size',   tokens.fontSize)
  }, [theme, skinId, variant.id])

  function setSkin(id: string) {
    setSkinId(id)
    saveSkinId(id)
    const savedVariant = loadVariantId(id)
    setVariantId(savedVariant)
  }

  function setVariant(id: string) {
    setVariantId(id)
    saveVariantId(skinId, id)
  }

  return (
    <ThemeContext.Provider value={{ theme, variant, variants: skin.variants, skin, skins, setVariant, setSkin }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
