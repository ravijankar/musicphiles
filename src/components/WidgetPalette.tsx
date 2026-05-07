import type { WidgetDef, DragData } from '../widgets/types'
import { useDraggable } from '@dnd-kit/core'

interface PaletteItemProps {
  def: WidgetDef
}

function PaletteItem({ def }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette::${def.type}`,
    data: { source: 'palette', widgetType: def.type } satisfies DragData,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`palette-item${isDragging ? ' dragging' : ''}`}
    >
      <div className="palette-item-name">{def.name}</div>
      <div className="palette-item-size">
        {def.defaultColSpan}c × {def.defaultRowSpan}r
      </div>
    </div>
  )
}

interface WidgetPaletteProps {
  widgets: WidgetDef[]
}

export default function WidgetPalette({ widgets }: WidgetPaletteProps) {
  return (
    <div className="widget-palette">
      <div className="palette-header">WIDGETS</div>
      <div className="palette-list">
        {widgets.map(def => (
          <PaletteItem key={def.type} def={def} />
        ))}
      </div>
    </div>
  )
}
