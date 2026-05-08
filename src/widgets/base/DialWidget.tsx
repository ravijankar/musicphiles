import { useState, useRef, useCallback } from 'react'
import type { WidgetDef, WidgetProps } from '../types'
import { useApp } from '../../contexts/AppContext'
import { KNOB_SETTINGS, getKnobAssignment, setKnobAssignment } from '../../lib/knobs'

const MIN_ANGLE = -135
const MAX_ANGLE = 135
const R = 44
const CX = 56
const CY = 56

function polarToXY(angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
}

function describeArc(from: number, to: number) {
  const s = polarToXY(from)
  const e = polarToXY(to)
  const large = to - from > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`
}

function DialWidget({ instanceId }: WidgetProps) {
  const app = useApp()
  const [assignment, setAssignment] = useState(() => getKnobAssignment(instanceId))
  const [picking, setPicking] = useState(false)
  const dragRef = useRef<{ startY: number; startVal: number } | null>(null)

  const value = assignment?.getValue(app) ?? 0
  const angle = MIN_ANGLE + value * (MAX_ANGLE - MIN_ANGLE)
  const indicator = polarToXY(angle)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!assignment) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startY: e.clientY, startVal: assignment.getValue(app) }
  }, [assignment, app])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || !assignment) return
    const dy = dragRef.current.startY - e.clientY
    const range = assignment.max - assignment.min
    const next = Math.min(assignment.max, Math.max(assignment.min,
      dragRef.current.startVal + (dy / 160) * range))
    assignment.setValue(app, Math.round(next / assignment.step) * assignment.step)
  }, [assignment, app])

  const onPointerUp = useCallback(() => { dragRef.current = null }, [])

  function assign(key: string) {
    setKnobAssignment(instanceId, key)
    setAssignment(getKnobAssignment(instanceId))
    setPicking(false)
  }

  if (picking) {
    return (
      <div className="knob-picker">
        <div className="knob-picker-label">ASSIGN DIAL</div>
        {KNOB_SETTINGS.map(s => (
          <button key={s.key} className="knob-picker-option" onClick={() => assign(s.key)}>
            {s.label}
          </button>
        ))}
        <button className="knob-picker-cancel" onClick={() => setPicking(false)}>Cancel</button>
      </div>
    )
  }

  return (
    <div className="dial-widget">
      <svg
        viewBox="0 0 112 112"
        className={`dial-svg${assignment ? ' assigned' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ touchAction: 'none', cursor: assignment ? 'ns-resize' : 'default' }}
      >
        {/* track */}
        <path d={describeArc(MIN_ANGLE, MAX_ANGLE)} fill="none" stroke="var(--border)" strokeWidth="6" strokeLinecap="round" />
        {/* fill */}
        {assignment && value > 0 && (
          <path d={describeArc(MIN_ANGLE, angle)} fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
        )}
        {/* indicator dot */}
        <circle cx={indicator.x} cy={indicator.y} r="5" fill={assignment ? 'var(--accent)' : 'var(--border)'} />
      </svg>
      <button className="knob-label" onClick={() => setPicking(true)}>
        {assignment ? assignment.label : '—'}
      </button>
      {assignment && <div className="knob-value">{assignment.format(value)}</div>}
    </div>
  )
}

export const dialWidget: WidgetDef = {
  type: 'dial',
  name: 'Dial',
  description: 'Large rotary dial for primary controls',
  minColSpan: 8,
  minRowSpan: 10,
  defaultColSpan: 11,
  defaultRowSpan: 14,
  component: DialWidget,
}
