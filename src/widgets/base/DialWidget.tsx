import type { WidgetDef, WidgetProps } from '../types'

function DialWidget(_props: WidgetProps) {
  return (
    <div className="widget-inner">
      <div className="widget-label">DIAL</div>
    </div>
  )
}

export const dialWidget: WidgetDef = {
  type: 'dial',
  name: 'Dial',
  description: 'Large rotary dial for primary controls',
  minColSpan: 10,
  minRowSpan: 14,
  defaultColSpan: 18,
  defaultRowSpan: 22,
  component: DialWidget,
}
