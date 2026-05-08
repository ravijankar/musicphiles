import { useState } from 'react'
import type { WidgetDef, WidgetProps } from '../types'
import { useApp } from '../../contexts/AppContext'
import { BUTTON_ACTIONS, getButtonAssignment, setButtonAssignment } from '../../lib/buttons'

function ButtonWidget({ instanceId }: WidgetProps) {
  const app = useApp()
  const [assignment, setAssignment] = useState(() => getButtonAssignment(instanceId))
  const [picking, setPicking] = useState(false)

  function assign(key: string) {
    setButtonAssignment(instanceId, key)
    setAssignment(getButtonAssignment(instanceId))
    setPicking(false)
  }

  if (picking) {
    return (
      <div className="knob-picker">
        <div className="knob-picker-label">ASSIGN BUTTON</div>
        {BUTTON_ACTIONS.map(a => (
          <button key={a.key} className="knob-picker-option" onClick={() => assign(a.key)}>
            {a.label}
          </button>
        ))}
        <button className="knob-picker-cancel" onClick={() => setPicking(false)}>Cancel</button>
      </div>
    )
  }

  return (
    <div className="button-widget">
      {assignment ? (
        <button
          className="button-widget-btn"
          onClick={() => assignment.trigger(app)}
          onContextMenu={e => { e.preventDefault(); setPicking(true) }}
        >
          {assignment.getLabel(app)}
        </button>
      ) : (
        <button className="button-widget-btn unassigned" onClick={() => setPicking(true)}>
          + ASSIGN
        </button>
      )}
    </div>
  )
}

export const buttonWidget: WidgetDef = {
  type: 'button',
  name: 'Button',
  description: 'Assignable action button',
  minColSpan: 4,
  minRowSpan: 5,
  defaultColSpan: 6,
  defaultRowSpan: 6,
  component: ButtonWidget,
}
