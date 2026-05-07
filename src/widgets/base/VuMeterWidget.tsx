import type { WidgetDef, WidgetProps } from '../types'

function VuMeterWidget(_props: WidgetProps) {
  return (
    <div className="widget-inner">
      <div className="widget-label">VU</div>
    </div>
  )
}

export const vuMeterWidget: WidgetDef = {
  type: 'vu-meter',
  name: 'VU Meter',
  description: 'Audio level visualization',
  minColSpan: 8,
  minRowSpan: 16,
  defaultColSpan: 18,
  defaultRowSpan: 24,
  component: VuMeterWidget,
}
