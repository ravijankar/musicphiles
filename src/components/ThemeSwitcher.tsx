import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeSwitcher() {
  const { palette, palettes, skin, skins, setPalette, setSkin } = useTheme()
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
        ◈ {skin.name}
      </button>
      {open && (
        <div className="theme-panel">
          <span className="theme-panel-label">SKIN</span>
          {skins.map(s => (
            <button
              key={s.id}
              className={`theme-option ${skin.id === s.id ? 'active' : ''}`}
              onClick={() => setSkin(s.id)}
            >
              <span className="theme-swatch" style={{ background: 'var(--accent)' }} />
              {s.name}
            </button>
          ))}

          <span className="theme-panel-label" style={{ marginTop: 8 }}>PALETTE</span>
          {palettes.map(p => (
            <button
              key={p.id}
              className={`theme-option ${palette.id === p.id ? 'active' : ''}`}
              onClick={() => setPalette(p.id)}
            >
              <span className="theme-swatch" style={{ background: p.tokens.accent }} />
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
