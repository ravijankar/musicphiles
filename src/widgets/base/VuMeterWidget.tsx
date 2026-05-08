import { useEffect, useRef } from 'react'
import type { WidgetDef, WidgetProps } from '../types'
import { useApp } from '../../contexts/AppContext'

const SEGMENTS = 20
const PEAK_HOLD_MS = 1500

function segColor(seg: number, active: boolean, isPeak: boolean): string {
  if (!active && !isPeak) return '#1e1e1e'
  if (seg >= SEGMENTS * 0.85) return active ? '#ff4444' : '#ff444488'
  if (seg >= SEGMENTS * 0.7)  return active ? '#ffaa00' : '#ffaa0088'
  return active ? '#c8963e' : '#c8963e55'
}

function VuMeterWidget({ colSpan, rowSpan }: WidgetProps) {
  const { getAnalyser } = useApp()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const peakRef = useRef<number>(0)
  const peakTimeRef = useRef<number>(0)
  const bufRef = useRef<Uint8Array | null>(null)

  const vertical = rowSpan > colSpan * 1.5

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function draw() {
      rafRef.current = requestAnimationFrame(draw)

      const analyser = getAnalyser()
      const w = canvas!.width
      const h = canvas!.height

      ctx!.clearRect(0, 0, w, h)

      let level = 0
      if (analyser) {
        if (!bufRef.current || bufRef.current.length !== analyser.fftSize) {
          bufRef.current = new Uint8Array(analyser.fftSize)
        }
        analyser.getByteTimeDomainData(bufRef.current)
        let sumSq = 0
        for (let i = 0; i < bufRef.current.length; i++) {
          const s = (bufRef.current[i] - 128) / 128
          sumSq += s * s
        }
        level = Math.sqrt(sumSq / bufRef.current.length)
      }

      const now = performance.now()
      if (level > peakRef.current) {
        peakRef.current = level
        peakTimeRef.current = now
      } else if (now - peakTimeRef.current > PEAK_HOLD_MS) {
        peakRef.current = Math.max(0, peakRef.current - 0.005)
      }

      const lit = Math.round(level * SEGMENTS * 3)
      const peakSeg = Math.round(peakRef.current * SEGMENTS * 3)
      const gap = 2
      const segSize = vertical
        ? (h - gap * (SEGMENTS - 1)) / SEGMENTS
        : (w - gap * (SEGMENTS - 1)) / SEGMENTS

      for (let i = 0; i < SEGMENTS; i++) {
        const seg = vertical ? SEGMENTS - 1 - i : i
        const offset = i * (segSize + gap)
        ctx!.fillStyle = segColor(seg, seg < lit, seg === peakSeg && peakSeg > 0)
        if (vertical) ctx!.fillRect(0, offset, w, segSize)
        else ctx!.fillRect(offset, 0, segSize, h)
      }
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [getAnalyser, vertical])

  return (
    <div className="vu-meter">
      <canvas
        ref={canvasRef}
        width={vertical ? 40 : 200}
        height={vertical ? 200 : 40}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}

export const vuMeterWidget: WidgetDef = {
  type: 'vu-meter',
  name: 'VU Meter',
  description: 'Audio level visualization',
  minColSpan: 4,
  minRowSpan: 8,
  defaultColSpan: 8,
  defaultRowSpan: 40,
  component: VuMeterWidget,
}
