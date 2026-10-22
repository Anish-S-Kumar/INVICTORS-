"use client"

import React, { useEffect, useRef } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Node {
  x: number
  y: number
  vx: number
  vy: number
  baseRadius: number
  pulsePhase: number
  pulseSpeed: number
  brightness: number
  isPulser: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  alphaDir: number
  alphaSpeed: number
}

interface CodeColumn {
  x: number
  y: number
  speed: number
  chars: string[]
  opacity: number
  fontSize: number
  isBinary: boolean
}

interface Bokeh {
  x: number
  y: number
  radius: number
  alpha: number
  alphaSpeed: number
  alphaDir: number
}

interface CircuitTrace {
  startX: number
  startY: number
  segments: { dx: number; dy: number }[]
  alpha: number
}

// ─── Constants ────────────────────────────────────────────────────────────────
const HEX_CHARS = "0123456789ABCDEF"
const BIN_CHARS = "01"
const GOLD = "212, 162, 76"
const GOLD_BRIGHT = "255, 200, 80"

function rnd(min: number, max: number) { return min + Math.random() * (max - min) }
function rndInt(min: number, max: number) { return Math.floor(rnd(min, max + 1)) }
function rndChar(isBinary: boolean) {
  const set = isBinary ? BIN_CHARS : HEX_CHARS
  return set[Math.floor(Math.random() * set.length)]
}

// ─── Component ────────────────────────────────────────────────────────────────
export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Reduced-motion check: skip animation entirely
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    } catch { /* ignore */ }

    let animId: number
    let W = 0, H = 0

    let nodes: Node[] = []
    let particles: Particle[] = []
    let codeColumns: CodeColumn[] = []
    let bokeh: Bokeh[] = []
    let traces: CircuitTrace[] = []

    // ── Build circuit traces anchored to pulser nodes ──────────────────────
    function buildTraces(pulserNodes: Node[]) {
      traces = pulserNodes.flatMap(n => {
        const count = rndInt(1, 3)
        return Array.from({ length: count }, () => {
          const segCount = rndInt(2, 5)
          const segs = Array.from({ length: segCount }, (_, i) => {
            const isHoriz = i % 2 === 0
            return {
              dx: isHoriz ? rnd(20, 60) * (Math.random() > 0.5 ? 1 : -1) : 0,
              dy: isHoriz ? 0 : rnd(15, 40) * (Math.random() > 0.5 ? 1 : -1),
            }
          })
          return {
            startX: n.x,
            startY: n.y,
            segments: segs,
            alpha: rnd(0.06, 0.18),
          }
        })
      })
    }

    function init() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight

      // ── Nodes (right-biased) ─────────────────────────────────────────────
      const totalNodes = Math.min(32, Math.max(18, Math.floor(W / 55)))
      nodes = Array.from({ length: totalNodes }, (_, i) => {
        const isFarLeft = i < 3
        const xMin = isFarLeft ? W * 0.02 : W * 0.28
        const xMax = isFarLeft ? W * 0.22 : W * 0.97
        return {
          x: rnd(xMin, xMax),
          y: rnd(0, H),
          vx: rnd(-0.12, 0.12),
          vy: rnd(-0.12, 0.12),
          baseRadius: rnd(2, 5),
          pulsePhase: rnd(0, Math.PI * 2),
          pulseSpeed: rnd(0.008, 0.025),
          brightness: rnd(0.55, 1),
          isPulser: Math.random() < 0.28,
        }
      })

      // ── Circuit traces ───────────────────────────────────────────────────
      buildTraces(nodes.filter(n => n.isPulser))

      // ── Particles ────────────────────────────────────────────────────────
      const totalParticles = Math.min(80, Math.floor((W * H) / 14000))
      particles = Array.from({ length: totalParticles }, () => ({
        x: rnd(W * 0.1, W),
        y: rnd(0, H),
        vx: rnd(-0.18, 0.18),
        vy: rnd(-0.18, 0.18),
        radius: rnd(0.4, 1.8),
        alpha: rnd(0.05, 0.45),
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        alphaSpeed: rnd(0.001, 0.005),
      }))

      // ── Code rain columns ────────────────────────────────────────────────
      const totalCols = Math.min(22, Math.floor(W / 60))
      codeColumns = Array.from({ length: totalCols }, () => {
        const isBin = Math.random() < 0.35
        const fontSize = rnd(9, 13)
        const charCount = rndInt(6, 18)
        return {
          x: rnd(W * 0.15, W * 0.98),
          y: rnd(-H, 0),
          speed: rnd(0.25, 0.7),
          chars: Array.from({ length: charCount }, () => rndChar(isBin)),
          opacity: rnd(0.03, 0.09),
          fontSize,
          isBinary: isBin,
        }
      })

      // ── Bokeh ────────────────────────────────────────────────────────────
      bokeh = Array.from({ length: 9 }, () => ({
        x: rnd(W * 0.25, W),
        y: rnd(0, H),
        radius: rnd(50, 160),
        alpha: rnd(0.008, 0.035),
        alphaSpeed: rnd(0.0003, 0.0009),
        alphaDir: 1,
      }))
    }

    // ── Draw helpers ──────────────────────────────────────────────────────────
    function drawBackground() {
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, W, H)

      // Soft amber radial bloom on right side
      const bloom = ctx.createRadialGradient(W * 0.72, H * 0.38, 0, W * 0.72, H * 0.38, W * 0.55)
      bloom.addColorStop(0, `rgba(${GOLD}, 0.028)`)
      bloom.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = bloom
      ctx.fillRect(0, 0, W, H)

      // Feather left edge to pure black
      const leftFade = ctx.createLinearGradient(0, 0, W * 0.35, 0)
      leftFade.addColorStop(0, "rgba(0,0,0,1)")
      leftFade.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = leftFade
      ctx.fillRect(0, 0, W, H)
    }

    function drawBokeh() {
      bokeh.forEach(b => {
        b.alpha += b.alphaSpeed * b.alphaDir
        if (b.alpha > 0.045 || b.alpha < 0.004) b.alphaDir *= -1
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius)
        g.addColorStop(0, `rgba(${GOLD}, ${b.alpha})`)
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    function drawCodeRain() {
      codeColumns.forEach(col => {
        col.y += col.speed
        const totalH = col.chars.length * col.fontSize * 1.5
        if (col.y > H + totalH) {
          col.y = -totalH
          col.chars = col.chars.map(() => rndChar(col.isBinary))
        }
        // Occasionally mutate a char for flickering effect
        if (Math.random() < 0.015) {
          col.chars[rndInt(0, col.chars.length - 1)] = rndChar(col.isBinary)
        }

        ctx.font = `${col.fontSize}px "Courier New", monospace`
        col.chars.forEach((ch, i) => {
          const yPos = col.y + i * col.fontSize * 1.5
          // Leading char is brighter
          const alphaMult = i === 0 ? 2.2 : i === 1 ? 1.4 : 1
          ctx.fillStyle = `rgba(${GOLD}, ${Math.min(0.95, col.opacity * alphaMult)})`
          ctx.fillText(ch, col.x, yPos)
        })
      })
    }

    function drawCircuitTraces() {
      traces.forEach(tr => {
        ctx.save()
        ctx.strokeStyle = `rgba(${GOLD}, ${tr.alpha})`
        ctx.lineWidth = 0.6
        ctx.setLineDash([4, 6])
        ctx.lineDashOffset = (Date.now() * 0.02) % 10

        let cx = tr.startX, cy = tr.startY
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        tr.segments.forEach(seg => {
          cx += seg.dx
          cy += seg.dy
          ctx.lineTo(cx, cy)
        })
        ctx.stroke()

        // Endpoint dot
        ctx.setLineDash([])
        ctx.fillStyle = `rgba(${GOLD}, ${tr.alpha * 1.5})`
        ctx.beginPath()
        ctx.arc(cx, cy, 1.5, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      })
    }

    function drawConnections() {
      const MAX_DIST = W < 768 ? 140 : 200
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist >= MAX_DIST) continue

          const base = (1 - dist / MAX_DIST) * 0.35
          // Nodes further right glow more
          const rightBoost = (nodes[i].x + nodes[j].x) / (2 * W)
          const alpha = base * (0.3 + rightBoost * 0.7)

          ctx.strokeStyle = `rgba(${GOLD}, ${alpha})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }
    }

    function drawNodes(time: number) {
      nodes.forEach(n => {
        n.pulsePhase += n.pulseSpeed
        const pulseFactor = n.isPulser
          ? 0.5 + 0.5 * Math.sin(n.pulsePhase)
          : 0.75 + 0.1 * Math.sin(n.pulsePhase * 0.5)

        const radius = n.baseRadius * (1 + (n.isPulser ? 0.4 : 0.1) * pulseFactor)
        const glowR = radius * (n.isPulser ? 5 + 3 * pulseFactor : 3.5)

        // Outer glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
        const gi = n.brightness * pulseFactor
        glow.addColorStop(0, `rgba(${GOLD}, ${0.3 * gi})`)
        glow.addColorStop(0.35, `rgba(${GOLD}, ${0.1 * gi})`)
        glow.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.fillStyle = `rgba(${GOLD_BRIGHT}, ${(0.65 + 0.35 * pulseFactor) * n.brightness})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2)
        ctx.fill()

        // Ring on pulsers
        if (n.isPulser) {
          const ringAlpha = 0.15 * pulseFactor * n.brightness
          ctx.strokeStyle = `rgba(${GOLD}, ${ringAlpha})`
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.arc(n.x, n.y, radius * 2.2, 0, Math.PI * 2)
          ctx.stroke()
        }
      })
    }

    function drawParticles() {
      particles.forEach(p => {
        p.alpha += p.alphaSpeed * p.alphaDir
        if (p.alpha > 0.5 || p.alpha < 0.03) p.alphaDir *= -1
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        ctx.fillStyle = `rgba(${GOLD}, ${p.alpha * 0.6})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    function drawMagnifyingGlass() {
      const cx = W * 0.77
      const cy = H * 0.3
      const r = Math.min(32, W * 0.025)
      const baseAlpha = 0.055

      ctx.save()
      ctx.strokeStyle = `rgba(${GOLD}, ${baseAlpha})`
      ctx.lineWidth = 1.2

      // Lens circle
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()

      // Handle
      const ang = Math.PI / 4
      const hx1 = cx + r * Math.cos(ang)
      const hy1 = cy + r * Math.sin(ang)
      ctx.beginPath()
      ctx.moveTo(hx1, hy1)
      ctx.lineTo(hx1 + r * 0.85, hy1 + r * 0.85)
      ctx.stroke()

      // Inner cross-hair
      ctx.strokeStyle = `rgba(${GOLD}, ${baseAlpha * 0.5})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(cx - r * 0.55, cy)
      ctx.lineTo(cx + r * 0.55, cy)
      ctx.moveTo(cx, cy - r * 0.55)
      ctx.lineTo(cx, cy + r * 0.55)
      ctx.stroke()

      // Small corner brackets inside lens
      const b = r * 0.38
      ;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx, sy]) => {
        ctx.beginPath()
        ctx.moveTo(cx + sx * b, cy + sy * (b - r * 0.15))
        ctx.lineTo(cx + sx * b, cy + sy * b)
        ctx.lineTo(cx + sx * (b - r * 0.15), cy + sy * b)
        ctx.stroke()
      })

      ctx.restore()
    }

    function drawFingerprint(time: number) {
      const cx = W * 0.87
      const cy = H * 0.7
      const alpha = 0.045
      const ringCount = 9

      ctx.save()
      ctx.strokeStyle = `rgba(${GOLD}, ${alpha})`
      ctx.lineWidth = 0.7

      // Concentric partial ellipses (fingerprint ridges)
      for (let i = 1; i <= ringCount; i++) {
        const rx = i * 5.5
        const ry = i * 8.5
        const gap = 0.22 + i * 0.012 // grow the gap slightly per ring
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, Math.PI * gap, Math.PI * (1 - gap))
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, Math.PI * (1 + gap), Math.PI * (2 - gap))
        ctx.stroke()
      }

      // Animated horizontal scan line
      const scanAlpha = alpha * 0.8 * (0.5 + 0.5 * Math.sin(time * 0.0015))
      ctx.strokeStyle = `rgba(${GOLD}, ${scanAlpha})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx - ringCount * 5.5 - 4, cy)
      ctx.lineTo(cx + ringCount * 5.5 + 4, cy)
      ctx.stroke()

      // Corner scan brackets
      const bw = ringCount * 5.5 + 6
      const bh = ringCount * 8.5 + 6
      const bLen = 8
      ctx.strokeStyle = `rgba(${GOLD}, ${alpha * 1.4})`
      ctx.lineWidth = 0.8
      ;[[cx - bw, cy - bh, 1, 1],[cx + bw, cy - bh, -1, 1],
        [cx + bw, cy + bh, -1, -1],[cx - bw, cy + bh, 1, -1]].forEach(([x, y, sx, sy]) => {
        ctx.beginPath()
        ctx.moveTo(x as number, (y as number) + (sy as number) * bLen)
        ctx.lineTo(x as number, y as number)
        ctx.lineTo((x as number) + (sx as number) * bLen, y as number)
        ctx.stroke()
      })

      ctx.restore()
    }

    function updateNodes() {
      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
        // Gently push stray nodes back to the right
        if (n.x < W * 0.04) n.vx = Math.abs(n.vx) * 0.8
      })
    }

    // ── Animation loop ────────────────────────────────────────────────────────
    function loop(time: number) {
      ctx.clearRect(0, 0, W, H)
      drawBackground()
      drawBokeh()
      drawCodeRain()
      drawCircuitTraces()
      drawConnections()
      drawNodes(time)
      drawParticles()
      drawMagnifyingGlass()
      drawFingerprint(time)
      updateNodes()
      animId = requestAnimationFrame(loop)
    }

    const onResize = () => { init() }
    window.addEventListener("resize", onResize)
    init()
    animId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none select-none"
      style={{ zIndex: 0 }}
    />
  )
}
