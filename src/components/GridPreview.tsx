import { useState, useRef, useEffect } from 'react'

// iPad Pro 11" logical resolution
const IPAD_LANDSCAPE = { w: 1194, h: 834 }
const IPAD_PORTRAIT  = { w: 834,  h: 1194 }

const COLS   = 96
const ROW_H  = 8

interface MockWidget {
  label: string
  col: number
  row: number
  colSpan: number
  rowSpan: number
  color: string
}

function getWidgets(rows: number): MockWidget[] {
  const rowScale = rows / 104  // 104 rows fills landscape iPad at 8px
  const r = (n: number) => Math.round(n * rowScale)
  return [
    { label: 'Album Browser', col: 0,  row: 0,     colSpan: 20, rowSpan: r(104), color: '#1c1c1c' },
    { label: 'Track List',    col: 20, row: 0,     colSpan: 28, rowSpan: r(72),  color: '#1c1c1c' },
    { label: 'Radio',         col: 20, row: r(72), colSpan: 28, rowSpan: r(32),  color: '#1c1c1c' },
    { label: 'PHIL 9000',     col: 48, row: 0,     colSpan: 28, rowSpan: r(104), color: '#1a0000' },
    { label: 'Knob',          col: 76, row: 0,     colSpan: 9,  rowSpan: r(14),  color: '#262626' },
    { label: 'Knob',          col: 85, row: 0,     colSpan: 9,  rowSpan: r(14),  color: '#262626' },
    { label: 'Knob',          col: 76, row: r(14), colSpan: 9,  rowSpan: r(14),  color: '#262626' },
    { label: 'Knob',          col: 85, row: r(14), colSpan: 9,  rowSpan: r(14),  color: '#262626' },
    { label: 'Dial',          col: 76, row: r(28), colSpan: 18, rowSpan: r(22),  color: '#262626' },
    { label: 'Btn',           col: 76, row: r(50), colSpan: 8,  rowSpan: r(8),   color: '#1c1c1c' },
    { label: 'Btn',           col: 84, row: r(50), colSpan: 10, rowSpan: r(8),   color: '#1c1c1c' },
    { label: 'VU',            col: 76, row: r(58), colSpan: 18, rowSpan: r(24),  color: '#262626' },
    { label: 'Btn',           col: 76, row: r(82), colSpan: 18, rowSpan: r(10),  color: '#1c1c1c' },
    { label: 'Btn',           col: 76, row: r(92), colSpan: 18, rowSpan: r(12),  color: '#1c1c1c' },
  ]
}

function GridCanvas({ rows, showGrid }: { rows: number; showGrid: boolean }) {
  const colW = 100 / COLS

  const widgets = getWidgets(rows)

  return (
    <div style={{ position: 'relative', width: '100%', height: rows * ROW_H, background: '#0e0e0e', border: '1px solid #3a3a3a', overflow: 'hidden' }}>
      {showGrid && Array.from({ length: COLS + 1 }).map((_, i) => (
        <div key={`vc-${i}`} style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${i * colW}%`, width: 1,
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
      ))}
      {showGrid && Array.from({ length: rows + 1 }).map((_, i) => (
        <div key={`hr-${i}`} style={{
          position: 'absolute', left: 0, right: 0,
          top: i * ROW_H, height: 1,
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
      ))}
      {widgets.map((w, idx) => (
        <div key={idx} style={{
          position: 'absolute',
          left: `${(w.col / COLS) * 100}%`,
          top: w.row * ROW_H,
          width: `${(w.colSpan / COLS) * 100}%`,
          height: w.rowSpan * ROW_H,
          background: w.color,
          border: '1px solid #3a3a3a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          letterSpacing: '0.06em',
          color: '#606060',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}>
          {w.label}
        </div>
      ))}
    </div>
  )
}

export default function GridPreview() {
  const [portrait, setPortrait] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [rows, setRows] = useState(104)
  const containerRef = useRef<HTMLDivElement>(null)

  const ipad = portrait ? IPAD_PORTRAIT : IPAD_LANDSCAPE
  const aspectRatio = ipad.w / ipad.h  // width / height

  useEffect(() => {
    setRows(Math.round(ipad.h / ROW_H))
  }, [ipad.h])

  const colPx = (ipad.w / COLS).toFixed(1)

  return (
    <div style={{ padding: '20px', flex: 1, overflow: 'auto', background: '#0e0e0e', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <button
          onClick={() => setPortrait(false)}
          style={{ background: !portrait ? '#262626' : 'none', border: `1px solid ${!portrait ? '#c8963e' : '#3a3a3a'}`, borderRadius: 3, color: !portrait ? '#c8963e' : '#909090', fontFamily: 'inherit', fontSize: 13, padding: '6px 16px', cursor: 'pointer' }}
        >
          landscape
        </button>
        <button
          onClick={() => setPortrait(true)}
          style={{ background: portrait ? '#262626' : 'none', border: `1px solid ${portrait ? '#c8963e' : '#3a3a3a'}`, borderRadius: 3, color: portrait ? '#c8963e' : '#909090', fontFamily: 'inherit', fontSize: 13, padding: '6px 16px', cursor: 'pointer' }}
        >
          portrait
        </button>
        <div style={{ flex: 1 }} />
        <label style={{ color: '#909090', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} />
          grid
        </label>
      </div>

      <div style={{ color: '#606060', fontSize: 12, letterSpacing: '0.08em', marginBottom: 12 }}>
        iPad Pro 11" · {portrait ? 'portrait 834×1194' : 'landscape 1194×834'} · 96 col · 8px rows · ~{colPx}px per col
      </div>

      <div ref={containerRef} style={{ width: ipad.w, height: ipad.h, flexShrink: 0 }}>
        <GridCanvas rows={rows} showGrid={showGrid} />
      </div>
    </div>
  )
}
