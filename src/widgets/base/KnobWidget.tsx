import type { WidgetDef, WidgetProps } from '../types'

function KnobWidget(_props: WidgetProps) {
  return (
    <div className="widget-inner">
      <div className="widget-label">KNOB</div>
    </div>
  )
}

export const knobWidget: WidgetDef = {
  type: 'knob',
  name: 'Knob',
  description: 'Rotary control — volume, EQ, or custom parameter',
  minColSpan: 6,
  minRowSpan: 10,
  defaultColSpan: 9,
  defaultRowSpan: 14,
  component: KnobWidget,
}
