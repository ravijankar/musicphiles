import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeSwitcher() {
  const { variant, variants, skin, skins, setVariant, setSkin } = useTheme()
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
              <span className="theme-swatch" style={{ background: s.variants[0].tokens.accent }} />
              {s.name}
            </button>
          ))}

          <span className="theme-panel-label" style={{ marginTop: 8 }}>COLOR</span>
          {variants.map(v => (
            <button
              key={v.id}
              className={`theme-option ${variant.id === v.id ? 'active' : ''}`}
              onClick={() => setVariant(v.id)}
            >
              <span className="theme-swatch" style={{ background: v.tokens.accent }} />
              {v.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
