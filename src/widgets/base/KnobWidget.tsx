import { useState, useRef, useCallback } from 'react'
import type { WidgetDef, WidgetProps } from '../types'
import { useApp } from '../../contexts/AppContext'
import { KNOB_SETTINGS, getKnobAssignment, setKnobAssignment } from '../../lib/knobs'

const MIN_ANGLE = -135
const MAX_ANGLE = 135

function KnobWidget({ instanceId }: WidgetProps) {
  const app = useApp()
  const [assignment, setAssignment] = useState(() => getKnobAssignment(instanceId))
  const [picking, setPicking] = useState(false)
  const dragRef = useRef<{ startY: number; startVal: number } | null>(null)

  const value = assignment?.getValue(app) ?? 0
  const angle = MIN_ANGLE + value * (MAX_ANGLE - MIN_ANGLE)

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
      dragRef.current.startVal + (dy / 120) * range))
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
        <div className="knob-picker-label">ASSIGN KNOB</div>
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
    <div className="knob-widget">
      <div
        className={`knob-body${assignment ? ' assigned' : ''}`}
        style={{ '--knob-angle': `${angle}deg` } as React.CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="knob-indicator" />
      </div>
      <button className="knob-label" onClick={() => setPicking(true)}>
        {assignment ? assignment.label : '—'}
      </button>
      {assignment && (
        <div className="knob-value">{assignment.format(value)}</div>
      )}
    </div>
  )
}

export const knobWidget: WidgetDef = {
  type: 'knob',
  name: 'Knob',
  description: 'Rotary control — assignable to any setting',
  minColSpan: 6,
  minRowSpan: 10,
  defaultColSpan: 9,
  defaultRowSpan: 14,
  component: KnobWidget,
}
