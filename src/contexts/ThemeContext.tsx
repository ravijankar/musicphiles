import { createContext, useContext, useState, useEffect } from 'react'
import type { Theme, Palette, Skin } from '../themes/types'
import { palettes, skins, resolveTheme, loadPaletteId, savePaletteId, loadSkinId, saveSkinId } from '../themes/registry'
import { registerThemeWidgets } from '../widgets/registry'

interface ThemeContextValue {
  theme: Theme
  palette: Palette
  palettes: Palette[]
  skin: Skin
  skins: Skin[]
  setPalette: (id: string) => void
  setSkin: (id: string) => void
}

const ThemeContext = createContext<ThemeContextValue>(null!)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [paletteId, setPaletteId] = useState(loadPaletteId)
  const [skinId, setSkinId] = useState(loadSkinId)

  const theme   = resolveTheme(paletteId, skinId)
  const palette = palettes.find(p => p.id === paletteId) ?? palettes[0]
  const skin    = skins.find(s => s.id === skinId) ?? skins[0]

  useEffect(() => {
    registerThemeWidgets(skin.widgets ?? [])
  }, [skin])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme',   skinId)
    root.setAttribute('data-palette', paletteId)
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
  }, [theme, skinId, paletteId])

  function setPalette(id: string) { setPaletteId(id); savePaletteId(id) }
  function setSkin(id: string)    { setSkinId(id);    saveSkinId(id) }

  return (
    <ThemeContext.Provider value={{ theme, palette, palettes, skin, skins, setPalette, setSkin }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
