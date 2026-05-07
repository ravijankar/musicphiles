import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeSwitcher() {
  const { theme, themes, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div className="theme-switcher" ref={ref}>
      <button className="tab theme-btn" onClick={() => setOpen(o => !o)}>
        ◈ {theme.name}
      </button>
      {open && (
        <div className="theme-panel">
          <span className="theme-panel-label">THEME</span>
          {themes.map(t => (
            <button
              key={t.id}
              className={`theme-option ${theme.id === t.id ? 'active' : ''}`}
              onClick={() => { setTheme(t.id); setOpen(false) }}
            >
              <span
                className="theme-swatch"
                style={{ background: t.tokens.accent }}
              />
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
