import { memo, useRef, useState, useCallback, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useDroppable, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useTheme } from '../contexts/ThemeContext'
import { getWidgetRegistry, getWidgetDef } from '../widgets/registry'
import { loadLayout, saveLayout, clearLayout, makeItemId } from '../lib/layout'
import type { LayoutItem, DragData } from '../widgets/types'
import WidgetPalette from './WidgetPalette'

const COLS = 96
const ROW_H = 8
const CANVAS_W = 1194
const CANVAS_H = 834
const COL_W = CANVAS_W / COLS

// ─── placed widget on canvas ──────────────────────────────────────────────────

interface PlacedWidgetProps {
  item: LayoutItem
  onRemove: (id: string) => void
}

function PlacedWidget({ item, onRemove }: PlacedWidgetProps) {
  const def = getWidgetDef(item.widgetType)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { source: 'canvas', item } satisfies DragData,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`canvas-widget${isDragging ? ' dragging' : ''}`}
      style={{
        position: 'absolute',
        left: item.col * COL_W,
        top: item.row * ROW_H,
        width: item.colSpan * COL_W,
        height: item.rowSpan * ROW_H,
        transform: CSS.Translate.toString(transform),
      }}
    >
      <button
        className="canvas-widget-remove"
        onPointerDown={e => e.stopPropagation()}
        onClick={() => onRemove(item.id)}
      >
        ×
      </button>
      {def
        ? <def.component colSpan={item.colSpan} rowSpan={item.rowSpan} />
        : <div className="canvas-widget-label">{item.widgetType}</div>
      }
    </div>
  )
}

// ─── grid lines (static — never re-render) ────────────────────────────────────

const GridLines = memo(function GridLines() {
  return (
    <svg
      className="canvas-grid"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      width={CANVAS_W}
      height={CANVAS_H}
    >
      {Array.from({ length: COLS + 1 }, (_, i) => (
        <line key={`c${i}`} x1={i * COL_W} y1={0} x2={i * COL_W} y2={CANVAS_H} />
      ))}
      {Array.from({ length: Math.ceil(CANVAS_H / ROW_H) + 1 }, (_, i) => (
        <line key={`r${i}`} x1={0} y1={i * ROW_H} x2={CANVAS_W} y2={i * ROW_H} />
      ))}
    </svg>
  )
})

// ─── droppable canvas surface ─────────────────────────────────────────────────

interface CanvasSurfaceProps {
  items: LayoutItem[]
  onRemove: (id: string) => void
}

function CanvasSurface({ items, onRemove }: CanvasSurfaceProps) {
  const { setNodeRef } = useDroppable({ id: 'canvas-surface' })

  return (
    <div
      ref={setNodeRef}
      className="canvas-surface"
      style={{ width: CANVAS_W, height: CANVAS_H, position: 'relative' }}
    >
      <GridLines />
      {items.map(item => (
        <PlacedWidget key={item.id} item={item} onRemove={onRemove} />
      ))}
    </div>
  )
}

// ─── drag overlay ghost ───────────────────────────────────────────────────────

function DragGhost({ widgetType }: { widgetType: string }) {
  const def = getWidgetDef(widgetType)
  if (!def) return null
  return (
    <div
      className="canvas-widget ghost"
      style={{ width: def.defaultColSpan * COL_W, height: def.defaultRowSpan * ROW_H }}
    >
      <div className="canvas-widget-label">{def.name}</div>
    </div>
  )
}

// ─── main canvas component ────────────────────────────────────────────────────

export default function Canvas() {
  const { theme } = useTheme()
  const [layout, setLayout] = useState<LayoutItem[]>(() => loadLayout(theme.id))
  const [activeType, setActiveType] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLayout(loadLayout(theme.id))
  }, [theme.id])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const persist = useCallback((next: LayoutItem[]) => {
    setLayout(next)
    saveLayout(theme.id, next)
  }, [theme.id])

  function snapToGrid(px: number, rowPx: number): { col: number; row: number } {
    return {
      col: Math.max(0, Math.round(px / COL_W)),
      row: Math.max(0, Math.round(rowPx / ROW_H)),
    }
  }

  function handleDragStart(e: DragStartEvent) {
    const data = e.active.data.current as DragData
    setActiveType(data.source === 'palette' ? (data.widgetType ?? null) : (data.item?.widgetType ?? null))
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveType(null)
    const { active, over, delta } = e
    if (!over || over.id !== 'canvas-surface') return

    const data = active.data.current as DragData
    const surfaceRect = canvasRef.current?.querySelector('.canvas-surface')?.getBoundingClientRect()
    if (!surfaceRect) return

    if (data.source === 'palette') {
      const def = getWidgetDef(data.widgetType!)
      if (!def) return
      const pointerX = (e.activatorEvent as PointerEvent).clientX - surfaceRect.left + delta.x
      const pointerY = (e.activatorEvent as PointerEvent).clientY - surfaceRect.top + delta.y
      const { col, row } = snapToGrid(
        Math.max(0, pointerX - (def.defaultColSpan * COL_W) / 2),
        Math.max(0, pointerY - (def.defaultRowSpan * ROW_H) / 2),
      )
      persist([...layout, {
        id: makeItemId(),
        widgetType: def.type,
        col: Math.min(col, COLS - def.defaultColSpan),
        row,
        colSpan: def.defaultColSpan,
        rowSpan: def.defaultRowSpan,
      }])
    } else if (data.source === 'canvas') {
      const item = data.item!
      const def = getWidgetDef(item.widgetType)
      const newCol = Math.max(0, Math.min(COLS - (def?.minColSpan ?? 1), item.col + Math.round(delta.x / COL_W)))
      const newRow = Math.max(0, item.row + Math.round(delta.y / ROW_H))
      persist(layout.map(l => l.id === item.id ? { ...l, col: newCol, row: newRow } : l))
    }
  }

  function removeItem(id: string) {
    persist(layout.filter(l => l.id !== id))
  }

  const widgets = getWidgetRegistry()

  return (
    <div className="canvas-shell">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <WidgetPalette widgets={widgets} />

        <div className="canvas-main" ref={canvasRef}>
          <div className="canvas-toolbar">
            <span className="canvas-toolbar-info">
              {COLS} cols · {ROW_H}px rows · {COL_W.toFixed(2)}px/col
            </span>
            <button className="canvas-toolbar-btn" onClick={() => { clearLayout(theme.id); persist([]) }}>
              Clear
            </button>
          </div>
          <div className="canvas-scroll">
            <CanvasSurface items={layout} onRemove={removeItem} />
          </div>
        </div>

        <DragOverlay>
          {activeType && <DragGhost widgetType={activeType} />}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
