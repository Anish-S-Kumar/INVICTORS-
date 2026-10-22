/**
 * Pure Geometry Functions for RingField (v8)
 * Seeded PRNG, trace generation, tick rings, segmented arcs, and data pulses.
 */

export interface TraceData {
  d: string
  endNode: { x: number; y: number; r: number; twinkle: boolean }
  tier: 0 | 1 | 2 // 0: 0.10 opacity, 1: 0.18 opacity, 2: 0.30 opacity
  isPulseCandidate: boolean
}

export interface GeneratedFieldGeometry {
  tierPaths: [string, string, string] // Path string for tier 0, 1, 2
  allNodes: Array<{ x: number; y: number; r: number; twinkle: boolean }>
  pulseTraces: Array<{ d: string; nodeIndex: number; duration: number; delay: number }>
  tickPath: string
  segmentedRingPath: string
  segmentedRingNodes: Array<{ x: number; y: number }>
  R: number
  cx: number
  cy: number
}

// Mulberry32 seeded PRNG
export function createPrng(seed = 0x12345678) {
  let s = seed >>> 0
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Generate circuit traces, tick marks, and segmented ring paths centered at (cx, cy) with radius R.
 */
export function generateRingFieldGeometry({
  cx,
  cy,
  R,
  width,
  height,
  isMobile = false,
  startRadiusRatio = 1.22,
  rayCountOverride,
  pulseCount = 18,
}: {
  cx: number
  cy: number
  R: number
  width: number
  height: number
  isMobile?: boolean
  startRadiusRatio?: number
  rayCountOverride?: number
  pulseCount?: number
}): GeneratedFieldGeometry {
  const prng = createPrng(0xca11ab1e + Math.round(R * 10))

  const N =
    rayCountOverride ||
    (isMobile ? 44 : Math.max(48, Math.min(140, Math.round((2 * Math.PI * startRadiusRatio * R) / 16))))

  const step = (2 * Math.PI) / N
  const traces: TraceData[] = []
  const maxExtent = Math.max(width, height, R * 3.5)

  for (let i = 0; i < N; i++) {
    // Jitter angle by up to +-0.35 of step
    const jitter = (prng() * 0.7 - 0.35) * step
    const angle = i * step + jitter

    const cosA = Math.cos(angle)
    const sinA = Math.sin(angle)

    const r0 = R * startRadiusRatio

    // ~35% of traces end earlier (1.8R - 2.2R), others reach further (2.4R - 3.8R)
    const isShort = prng() < 0.35
    const maxR = isShort
      ? R * (1.8 + prng() * 0.4)
      : Math.min(maxExtent, R * (2.4 + prng() * 1.4))

    // Run 1: straight radial segment
    const r1 = r0 + R * (0.15 + prng() * 0.3)
    const x0 = cx + r0 * cosA
    const y0 = cy + r0 * sinA
    const x1 = cx + r1 * cosA
    const y1 = cy + r1 * sinA

    let currentX = x1
    let currentY = y1
    let currentR = r1

    let pathD = `M ${x0.toFixed(1)} ${y0.toFixed(1)} L ${x1.toFixed(1)} ${y1.toFixed(1)}`

    // 45-degree bend direction
    const bendSign = prng() > 0.5 ? 1 : -1
    const bendAngle = angle + (bendSign * Math.PI) / 4
    const bendLen = R * (0.08 + prng() * 0.12)

    const bx = currentX + bendLen * Math.cos(bendAngle)
    const by = currentY + bendLen * Math.sin(bendAngle)

    pathD += ` L ${bx.toFixed(1)} ${by.toFixed(1)}`
    currentX = bx
    currentY = by
    currentR = Math.hypot(currentX - cx, currentY - cy)

    // Second run: continue along bend angle or return toward radial
    if (currentR < maxR) {
      const run2Len = R * (0.15 + prng() * 0.35)
      // 50% bend back to radial
      const shouldTurnRadial = prng() > 0.45
      const nextAngle = shouldTurnRadial ? Math.atan2(currentY - cy, currentX - cx) : bendAngle
      const x3 = currentX + run2Len * Math.cos(nextAngle)
      const y3 = currentY + run2Len * Math.sin(nextAngle)

      pathD += ` L ${x3.toFixed(1)} ${y3.toFixed(1)}`
      currentX = x3
      currentY = y3
      currentR = Math.hypot(currentX - cx, currentY - cy)

      // Optional third run if still well within maxR
      if (currentR < maxR - R * 0.3 && prng() > 0.6) {
        const run3Len = R * (0.15 + prng() * 0.4)
        const radAngle = Math.atan2(currentY - cy, currentX - cx)
        const x4 = currentX + run3Len * Math.cos(radAngle)
        const y4 = currentY + run3Len * Math.sin(radAngle)
        pathD += ` L ${x4.toFixed(1)} ${y4.toFixed(1)}`
        currentX = x4
        currentY = y4
      }
    }

    // Node at the end
    const nodeR = 2.0 + prng() * 1.5
    const twinkle = prng() < 0.1 // 10% twinkle

    // Opacity tier: 0 = 0.10 (55%), 1 = 0.18 (30%), 2 = 0.30 (15%)
    const tierRand = prng()
    const tier: 0 | 1 | 2 = tierRand < 0.55 ? 0 : tierRand < 0.85 ? 1 : 2

    traces.push({
      d: pathD,
      endNode: {
        x: parseFloat(currentX.toFixed(1)),
        y: parseFloat(currentY.toFixed(1)),
        r: parseFloat(nodeR.toFixed(1)),
        twinkle,
      },
      tier,
      isPulseCandidate: currentR > R * 1.6,
    })
  }

  // Combine paths by tier for cheap rendering (only 3 path elements total!)
  const tier0 = traces.filter((t) => t.tier === 0).map((t) => t.d).join(" ")
  const tier1 = traces.filter((t) => t.tier === 1).map((t) => t.d).join(" ")
  const tier2 = traces.filter((t) => t.tier === 2).map((t) => t.d).join(" ")

  const allNodes = traces.map((t) => t.endNode)

  // Choose pulse traces
  const eligible = traces
    .map((t, idx) => ({ t, idx }))
    .filter((item) => item.t.isPulseCandidate)

  // Shuffle and pick pulseCount
  const shuffled = [...eligible].sort(() => prng() - 0.5)
  const chosen = shuffled.slice(0, Math.min(pulseCount, shuffled.length))

  const pulseTraces = chosen.map(({ t, idx }, pIndex) => ({
    d: t.d,
    nodeIndex: idx,
    duration: parseFloat((3.2 + prng() * 2.8).toFixed(2)), // 3.2 - 6.0s
    delay: parseFloat(((pIndex * (14 / pulseCount)) + prng() * 1.2).toFixed(2)),
  }))

  // ---------------------------------------------------------------------------
  // TICK RING AT 1.16R
  // ---------------------------------------------------------------------------
  const tickR = R * 1.16
  const tickSegments: string[] = []
  for (let deg = 0; deg < 360; deg += 2) {
    const is30 = deg % 30 === 0
    const is10 = deg % 10 === 0
    const tickLen = is30 ? R * 0.035 : is10 ? R * 0.024 : R * 0.012

    const rad = (deg * Math.PI) / 180
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    const x1 = cx + tickR * cos
    const y1 = cy + tickR * sin
    const x2 = cx + (tickR + tickLen) * cos
    const y2 = cy + (tickR + tickLen) * sin

    tickSegments.push(`M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`)
  }
  const tickPath = tickSegments.join(" ")

  // ---------------------------------------------------------------------------
  // SEGMENTED RING AT 1.10R (9 to 12 dashed arcs of unequal length with small gaps)
  // ---------------------------------------------------------------------------
  const segR = R * 1.10
  const segArcCount = 11
  let currentAngle = 0
  const segPaths: string[] = []
  const segmentedRingNodes: Array<{ x: number; y: number }> = []

  // Total angular span = 360 deg
  const arcSpans = [24, 32, 18, 38, 22, 30, 26, 34, 20, 36, 28] // sums to 308 deg, remaining ~52 deg for gaps
  const gapSpan = 52 / segArcCount // ~4.7 deg gap

  for (let i = 0; i < segArcCount; i++) {
    const span = arcSpans[i % arcSpans.length]
    const startDeg = currentAngle
    const endDeg = startDeg + span

    const startRad = (startDeg * Math.PI) / 180
    const endRad = (endDeg * Math.PI) / 180

    const sx = cx + segR * Math.cos(startRad)
    const sy = cy + segR * Math.sin(startRad)
    const ex = cx + segR * Math.cos(endRad)
    const ey = cy + segR * Math.sin(endRad)

    const largeArc = span > 180 ? 1 : 0
    segPaths.push(`M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${segR.toFixed(1)} ${segR.toFixed(1)} 0 ${largeArc} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`)

    // Gap midpoint node
    const gapMidRad = ((endDeg + gapSpan / 2) * Math.PI) / 180
    segmentedRingNodes.push({
      x: parseFloat((cx + segR * Math.cos(gapMidRad)).toFixed(1)),
      y: parseFloat((cy + segR * Math.sin(gapMidRad)).toFixed(1)),
    })

    currentAngle = endDeg + gapSpan
  }
  const segmentedRingPath = segPaths.join(" ")

  return {
    tierPaths: [tier0, tier1, tier2],
    allNodes,
    pulseTraces,
    tickPath,
    segmentedRingPath,
    segmentedRingNodes,
    R,
    cx,
    cy,
  }
}
