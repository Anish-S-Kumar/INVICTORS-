/**
 * PCB Circuit Geometry Generator (v8 - Reference Image Matched)
 * Matches the reference image's warm golden PCB traces, orthogonal/45-degree bends,
 * clean solder nodes, and SLOW, elegant light pulses.
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

// Deterministic PRNG
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
  const prng = createPrng(0x5bd1e995 + Math.round(R * 10))

  // Balanced density of PCB tracks
  const N = isMobile ? 36 : Math.max(52, Math.min(80, Math.round((2 * Math.PI * R) / 23)))
  const step = (2 * Math.PI) / N
  const traces: CircuitTrace[] = []

  const r0 = R * 1.045
  const maxDiagonal = Math.hypot(width, height) / 2 + 50

  for (let i = 0; i < N; i++) {
    // Symmetrical, organized angular distribution
    const jitter = (prng() * 0.4 - 0.2) * step
    const angle = i * step + jitter
    const cosA = Math.cos(angle)
    const sinA = Math.sin(angle)

    const x0 = cx + r0 * cosA
    const y0 = cy + r0 * sinA

    // Run 1: initial radial stem
    const run1Len = R * (0.15 + prng() * 0.28)
    let currentX = x0 + run1Len * cosA
    let currentY = y0 + run1Len * sinA

    let pathD = `M ${x0.toFixed(1)} ${y0.toFixed(1)} L ${currentX.toFixed(1)} ${currentY.toFixed(1)}`

    // Clean PCB routing: 45° or 90° bends
    const use45 = prng() > 0.4
    const bendSign = prng() > 0.5 ? 1 : -1
    const bendAngle = use45
      ? angle + (bendSign * Math.PI) / 4
      : angle + (bendSign * Math.PI) / 2

    const bendLen = R * (0.12 + prng() * 0.22)
    const bx = currentX + bendLen * Math.cos(bendAngle)
    const by = currentY + bendLen * Math.sin(bendAngle)

    pathD += ` L ${bx.toFixed(1)} ${by.toFixed(1)}`
    currentX = bx
    currentY = by

    // Run 2: outward run parallel to main axes or diagonal
    const outwardAngle = Math.atan2(currentY - cy, currentX - cx)
    const run3Len = R * (0.35 + prng() * 0.75)
    const x3 = currentX + run3Len * Math.cos(outwardAngle)
    const y3 = currentY + run3Len * Math.sin(outwardAngle)

    pathD += ` L ${x3.toFixed(1)} ${y3.toFixed(1)}`
    currentX = x3
    currentY = y3

    // Optional 3rd segment reaching out
    const distToCenter = Math.hypot(currentX - cx, currentY - cy)
    if (distToCenter < maxDiagonal && prng() > 0.45) {
      const bend2Sign = prng() > 0.5 ? 1 : -1
      const bend2Angle = outwardAngle + (bend2Sign * Math.PI) / 4
      const run4Len = R * (0.22 + prng() * 0.45)
      const x4 = currentX + run4Len * Math.cos(bend2Angle)
      const y4 = currentY + run4Len * Math.sin(bend2Angle)
      pathD += ` L ${x4.toFixed(1)} ${y4.toFixed(1)}`
      currentX = x4
      currentY = y4
    }

    // End node dot
    const nodeR = 2.4 + prng() * 1.5 // 2.4 to 3.9px
    const traceOpacity = 0.55 + prng() * 0.30 // Warm, distinct visibility (0.55 - 0.85)
    const traceWidth = 1.15 + prng() * 0.35 // 1.15 to 1.5px

    // SLOW, ELEGANT PULSES (9.0s to 18.0s) as requested!
    const duration = 9.5 + prng() * 8.5 // 9.5s to 18.0s (calm and slow)
    const delay = prng() * 9.0 // spread across 0 to 9s
    const reverse = prng() > 0.8 // 20% inward, 80% outward
    const nodeDuration = 3.5 + prng() * 2.5
    const nodeDelay = prng() * 4.0

    // Short bright dash
    const dashLength = Math.round(28 + prng() * 18) // 28 to 46px
    const dashGap = 650

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
  // SECOND SEGMENTED TECH RING WITH TICK MARKS (at 1.12R, exactly like reference)
  // ---------------------------------------------------------------------------
  const tickR = R * 1.12
  const tickSegments: string[] = []
  for (let deg = 0; deg < 360; deg += 3) {
    const isMajor = deg % 15 === 0
    const len = isMajor ? R * 0.038 : R * 0.016
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
  const segR = R * 1.095
  const arcSpans = [28, 38, 16, 44, 22, 32, 24, 40, 20, 36]
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
    currentAngle += span + 7
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
