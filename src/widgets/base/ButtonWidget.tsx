import type { WidgetDef, WidgetProps } from '../types'

function ButtonWidget(_props: WidgetProps) {
  return (
    <div className="widget-inner">
      <div className="widget-label">BTN</div>
    </div>
  )
}

export const buttonWidget: WidgetDef = {
  type: 'button',
  name: 'Button',
  description: 'Assignable action button',
  minColSpan: 4,
  minRowSpan: 6,
  defaultColSpan: 8,
  defaultRowSpan: 8,
  component: ButtonWidget,
}
