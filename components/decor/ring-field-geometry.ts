/**
 * PCB Circuit Geometry Generator (v8 Enhanced)
 * Generates rich, glowing gold circuit traces with right-angle and 45-degree bends,
 * end-node dots, and data pulse parameters.
 */

export interface CircuitTrace {
  id: number
  d: string
  opacity: number
  width: number
  duration: number
  delay: number
  reverse: boolean
  dashArray: string
  endNode: {
    x: number
    y: number
    r: number
    duration: number
    delay: number
  }
}

export interface CircuitFieldGeometry {
  traces: CircuitTrace[]
  tickRingPath: string
  segmentedRingPath: string
  cx: number
  cy: number
  R: number
}

// Mulberry32 deterministic PRNG
export function createPrng(seed = 0x9e3779b9) {
  let s = seed >>> 0
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateCircuitFieldGeometry({
  cx,
  cy,
  R,
  width,
  height,
  isMobile = false,
}: {
  cx: number
  cy: number
  R: number
  width: number
  height: number
  isMobile?: boolean
}): CircuitFieldGeometry {
  const prng = createPrng(0x85ebca6b + Math.round(R * 10))

  // Ray count: ~68 on laptop, 38 on mobile
  const N = isMobile ? 38 : Math.max(54, Math.min(84, Math.round((2 * Math.PI * R) / 22)))
  const step = (2 * Math.PI) / N
  const traces: CircuitTrace[] = []

  const r0 = R * 1.045 // Starts directly at outer edge of golden ring
  const maxDiagonal = Math.hypot(width, height) / 2 + 60

  for (let i = 0; i < N; i++) {
    // Jitter angle slightly
    const jitter = (prng() * 0.5 - 0.25) * step
    const angle = i * step + jitter
    const cosA = Math.cos(angle)
    const sinA = Math.sin(angle)

    const x0 = cx + r0 * cosA
    const y0 = cy + r0 * sinA

    // Length of first radial run
    const run1Len = R * (0.18 + prng() * 0.35)
    let currentX = x0 + run1Len * cosA
    let currentY = y0 + run1Len * sinA

    let pathD = `M ${x0.toFixed(1)} ${y0.toFixed(1)} L ${currentX.toFixed(1)} ${currentY.toFixed(1)}`

    // Decide bend type: 90-degree right angle (PCB style) or 45-degree
    const useRightAngle = prng() > 0.45
    const bendSign = prng() > 0.5 ? 1 : -1
    const bendAngle = useRightAngle
      ? angle + (bendSign * Math.PI) / 2
      : angle + (bendSign * Math.PI) / 4

    const bendLen = R * (0.12 + prng() * 0.25)
    const bx = currentX + bendLen * Math.cos(bendAngle)
    const by = currentY + bendLen * Math.sin(bendAngle)

    pathD += ` L ${bx.toFixed(1)} ${by.toFixed(1)}`
    currentX = bx
    currentY = by

    // Third segment: fan outward toward stage edges
    const outwardAngle = Math.atan2(currentY - cy, currentX - cx)
    const run3Len = R * (0.35 + prng() * 0.8)
    const x3 = currentX + run3Len * Math.cos(outwardAngle)
    const y3 = currentY + run3Len * Math.sin(outwardAngle)

    pathD += ` L ${x3.toFixed(1)} ${y3.toFixed(1)}`
    currentX = x3
    currentY = y3

    // Optional 4th branch run for long traces
    const distToCenter = Math.hypot(currentX - cx, currentY - cy)
    if (distToCenter < maxDiagonal && prng() > 0.5) {
      const bend2Sign = prng() > 0.5 ? 1 : -1
      const bend2Angle = outwardAngle + (bend2Sign * Math.PI) / 4
      const run4Len = R * (0.25 + prng() * 0.5)
      const x4 = currentX + run4Len * Math.cos(bend2Angle)
      const y4 = currentY + run4Len * Math.sin(bend2Angle)
      pathD += ` L ${x4.toFixed(1)} ${y4.toFixed(1)}`
      currentX = x4
      currentY = y4
    }

    // End node
    const nodeR = 2.4 + prng() * 1.8 // 2.4 to 4.2px
    const traceOpacity = 0.55 + prng() * 0.30 // 0.55 to 0.85 (Clearly visible!)
    const traceWidth = 1.1 + prng() * 0.4 // 1.1 to 1.5px
    const duration = 2.6 + prng() * 3.4 // 2.5s to 6.0s
    const delay = prng() * 4.5 // 0 to 4.5s
    const reverse = prng() > 0.75 // 25% inward, 75% outward
    const nodeDuration = 2.0 + prng() * 2.0
    const nodeDelay = prng() * 3.0

    // Dash array for pulses: short bright dash "40 400"
    const dashLength = Math.round(35 + prng() * 25) // 35 to 60px
    const dashGap = Math.round(400 + prng() * 200)

    traces.push({
      id: i,
      d: pathD,
      opacity: parseFloat(traceOpacity.toFixed(2)),
      width: parseFloat(traceWidth.toFixed(2)),
      duration: parseFloat(duration.toFixed(2)),
      delay: parseFloat(delay.toFixed(2)),
      reverse,
      dashArray: `${dashLength} ${dashGap}`,
      endNode: {
        x: parseFloat(currentX.toFixed(1)),
        y: parseFloat(currentY.toFixed(1)),
        r: parseFloat(nodeR.toFixed(1)),
        duration: parseFloat(nodeDuration.toFixed(2)),
        delay: parseFloat(nodeDelay.toFixed(2)),
      },
    })
  }

  // ---------------------------------------------------------------------------
  // SECOND SEGMENTED TECH RING WITH TICK MARKS (just outside at 1.12R)
  // ---------------------------------------------------------------------------
  const tickR = R * 1.12
  const tickSegments: string[] = []
  for (let deg = 0; deg < 360; deg += 3) {
    const isMajor = deg % 15 === 0
    const len = isMajor ? R * 0.035 : R * 0.016
    const rad = (deg * Math.PI) / 180
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    const x1 = cx + tickR * cos
    const y1 = cy + tickR * sin
    const x2 = cx + (tickR + len) * cos
    const y2 = cy + (tickR + len) * sin
    tickSegments.push(`M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`)
  }
  const tickRingPath = tickSegments.join(" ")

  // Segmented dashed arc path
  const segR = R * 1.09
  const arcSpans = [28, 36, 18, 42, 24, 30, 26, 38, 22, 34]
  let currentAngle = 0
  const segArcs: string[] = []
  for (let i = 0; i < arcSpans.length; i++) {
    const span = arcSpans[i]
    const startRad = (currentAngle * Math.PI) / 180
    const endRad = ((currentAngle + span) * Math.PI) / 180
    const sx = cx + segR * Math.cos(startRad)
    const sy = cy + segR * Math.sin(startRad)
    const ex = cx + segR * Math.cos(endRad)
    const ey = cy + segR * Math.sin(endRad)
    segArcs.push(`M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${segR.toFixed(1)} ${segR.toFixed(1)} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`)
    currentAngle += span + 8 // 8 deg gap
  }
  const segmentedRingPath = segArcs.join(" ")

  return {
    traces,
    tickRingPath,
    segmentedRingPath,
    cx,
    cy,
    R,
  }
}
