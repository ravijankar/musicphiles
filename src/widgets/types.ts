import type { ComponentType } from 'react'

export interface WidgetDef {
  type: string
  name: string
  description: string
  minColSpan: number
  minRowSpan: number
  defaultColSpan: number
  defaultRowSpan: number
  component: ComponentType<WidgetProps>
}

export interface WidgetProps {
  colSpan: number
  rowSpan: number
}

export interface LayoutItem {
  id: string
  widgetType: string
  col: number
  row: number
  colSpan: number
  rowSpan: number
}

export interface DragData {
  source: 'palette' | 'canvas'
  widgetType?: string
  item?: LayoutItem
}
