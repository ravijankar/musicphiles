import { createContext, useContext, useState, useEffect } from 'react'
import type { Theme } from '../themes/types'
import { getTheme, getThemes, loadThemeId, saveThemeId } from '../themes/registry'
import { registerThemeWidgets } from '../widgets/registry'

interface ThemeContextValue {
  theme: Theme
  themes: Theme[]
  setTheme: (id: string) => void
}

const ThemeContext = createContext<ThemeContextValue>(null!)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getTheme(loadThemeId()))

  useEffect(() => {
    registerThemeWidgets(theme.widgets ?? [])
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
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
  }, [theme])

  function setTheme(id: string) {
    const next = getTheme(id)
    setThemeState(next)
    saveThemeId(id)
  }

  return (
    <ThemeContext.Provider value={{ theme, themes: getThemes(), setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
