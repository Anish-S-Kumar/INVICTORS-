"use client"

import React, { useEffect, useRef } from "react"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function rnd(a: number, b: number) { return a + Math.random() * (b - a) }
function rndInt(a: number, b: number) { return Math.floor(rnd(a, b + 1)) }
const HEX = "0123456789ABCDEF"
const BIN = "01"
function rndChar(bin: boolean) { const s = bin ? BIN : HEX; return s[Math.floor(Math.random() * s.length)] }

// Amber gold colour constants
const G  = "212,162,76"   // amber gold
const GB = "255,210,100"  // bright gold for node cores

// ─── Types ────────────────────────────────────────────────────────────────────
interface Node { x:number; y:number; vx:number; vy:number; r:number; ph:number; ps:number; bri:number; pulser:boolean }
interface Particle { x:number; y:number; vx:number; vy:number; r:number; a:number; ad:number; as_:number }
interface Column { x:number; y:number; spd:number; chars:string[]; opa:number; fs:number; bin:boolean }
interface Bokeh { x:number; y:number; r:number; a:number; as_:number; ad:number }
interface Trace { ox:number; oy:number; segs:{dx:number;dy:number}[]; a:number }

// ─── Component ────────────────────────────────────────────────────────────────
export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext("2d")
    if (!ctx) return
    // Non-null alias so inner closures satisfy TypeScript
    const c: CanvasRenderingContext2D = ctx

    try { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return } catch {}

    let raf: number
    let W = 0, H = 0

    let nodes:    Node[]     = []
    let particles:Particle[] = []
    let columns:  Column[]   = []
    let bokeh:    Bokeh[]    = []
    let traces:   Trace[]    = []

    // ── Right-side zone helpers ──────────────────────────────────────────────
    // The "active zone" is the rightmost 55% of the screen.
    // A smaller cluster of anchor nodes sits in the far right 30%.
    function rightX(minFrac = 0.45, maxFrac = 0.99) { return rnd(W * minFrac, W * maxFrac) }
    function rightY() { return rnd(H * 0.02, H * 0.98) }

    // ── Build traces from pulser nodes ───────────────────────────────────────
    function buildTraces(pulsers: Node[]) {
      traces = pulsers.flatMap(n =>
        Array.from({ length: rndInt(1, 3) }, () => ({
          ox: n.x, oy: n.y,
          a:  rnd(0.08, 0.22),
          segs: Array.from({ length: rndInt(3, 6) }, (_, i) => ({
            dx: (i % 2 === 0) ? rnd(20, 70) * (Math.random() > .5 ? 1 : -1) : 0,
            dy: (i % 2 === 0) ? 0           : rnd(15, 50) * (Math.random() > .5 ? 1 : -1),
          }))
        }))
      )
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    function init() {
      W = cv!.width  = window.innerWidth
      H = cv!.height = window.innerHeight

      const isMobile = W < 768

      // ── Nodes ──────────────────────────────────────────────────────────────
      // Far-right cluster: dense bright constellation
      const clusterCount = isMobile ? 12 : 22
      const scattered    = isMobile ? 6  : 14
      const leftAnchors  = 3

      nodes = [
        // Far-right dense cluster (right 30%)
        ...Array.from({ length: clusterCount }, () => ({
          x: rnd(W * 0.70, W * 0.98),
          y: rightY(),
          vx: rnd(-0.10, 0.10), vy: rnd(-0.10, 0.10),
          r: rnd(2.5, 5.5), ph: rnd(0, Math.PI * 2),
          ps: rnd(0.012, 0.030), bri: rnd(0.7, 1.0),
          pulser: Math.random() < 0.4,
        })),
        // Mid-right scattered (45%–70%)
        ...Array.from({ length: scattered }, () => ({
          x: rnd(W * 0.45, W * 0.70),
          y: rightY(),
          vx: rnd(-0.10, 0.10), vy: rnd(-0.10, 0.10),
          r: rnd(1.8, 3.8), ph: rnd(0, Math.PI * 2),
          ps: rnd(0.008, 0.020), bri: rnd(0.5, 0.85),
          pulser: Math.random() < 0.25,
        })),
        // Far-left tiny anchors for connectivity (0–18%)
        ...Array.from({ length: leftAnchors }, () => ({
          x: rnd(W * 0.01, W * 0.18),
          y: rightY(),
          vx: rnd(-0.07, 0.07), vy: rnd(-0.07, 0.07),
          r: rnd(1.2, 2.5), ph: rnd(0, Math.PI * 2),
          ps: rnd(0.006, 0.015), bri: rnd(0.3, 0.55),
          pulser: false,
        })),
      ]

      buildTraces(nodes.filter(n => n.pulser))

      // ── Particles (right-heavy) ─────────────────────────────────────────────
      particles = Array.from({ length: isMobile ? 40 : 80 }, () => ({
        x: rnd(W * 0.30, W),
        y: rnd(0, H),
        vx: rnd(-0.2, 0.2), vy: rnd(-0.2, 0.2),
        r: rnd(0.4, 2.2), a: rnd(0.05, 0.55),
        ad: Math.random() > .5 ? 1 : -1, as_: rnd(0.001, 0.006),
      }))

      // ── Code rain (right 55%+ of screen) ──────────────────────────────────
      const colCount = isMobile ? 10 : 20
      columns = Array.from({ length: colCount }, () => {
        const bin = Math.random() < 0.3
        const fs  = rnd(9, 14)
        const n   = rndInt(5, 20)
        return {
          x:   rnd(W * 0.40, W * 0.99),
          y:   rnd(-H, 0),
          spd: rnd(0.3, 0.85),
          chars: Array.from({ length: n }, () => rndChar(bin)),
          opa: rnd(0.05, 0.13),
          fs, bin,
        }
      })

      // ── Bokeh blobs (right 40%+) ─────────────────────────────────────────
      bokeh = Array.from({ length: isMobile ? 6 : 11 }, () => ({
        x: rnd(W * 0.40, W * 0.98),
        y: rnd(0, H),
        r: rnd(60, 200),
        a: rnd(0.012, 0.048),
        as_: rnd(0.0004, 0.0012), ad: 1,
      }))
    }

    // ── Draw: background ──────────────────────────────────────────────────────
    function drawBG() {
      c.fillStyle = "#000000"
      c.fillRect(0, 0, W, H)

      // Warm amber bloom, centred at right
      const bloom = c.createRadialGradient(W * 0.80, H * 0.40, 0, W * 0.80, H * 0.40, W * 0.60)
      bloom.addColorStop(0, `rgba(${G},0.038)`)
      bloom.addColorStop(0.5,`rgba(${G},0.012)`)
      bloom.addColorStop(1, "rgba(0,0,0,0)")
      c.fillStyle = bloom
      c.fillRect(0, 0, W, H)

      // Feather left 40% to pure black so right dominates
      const fade = c.createLinearGradient(0, 0, W * 0.45, 0)
      fade.addColorStop(0, "rgba(0,0,0,1)")
      fade.addColorStop(1, "rgba(0,0,0,0)")
      c.fillStyle = fade
      c.fillRect(0, 0, W, H)
    }

    // ── Draw: bokeh ──────────────────────────────────────────────────────────
    function drawBokeh() {
      bokeh.forEach(b => {
        b.a += b.as_ * b.ad
        if (b.a > 0.055 || b.a < 0.006) b.ad *= -1
        const g = c.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, `rgba(${G},${b.a})`)
        g.addColorStop(1, "rgba(0,0,0,0)")
        c.fillStyle = g
        c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI * 2); c.fill()
      })
    }

    // ── Draw: code rain ──────────────────────────────────────────────────────
    function drawCodeRain() {
      columns.forEach(col => {
        col.y += col.spd
        const totalH = col.chars.length * col.fs * 1.5
        if (col.y > H + totalH) {
          col.y = -totalH
          col.chars = col.chars.map(() => rndChar(col.bin))
        }
        if (Math.random() < 0.018) col.chars[rndInt(0, col.chars.length - 1)] = rndChar(col.bin)

        c.font = `${col.fs}px "Courier New",monospace`
        col.chars.forEach((ch, i) => {
          const alpha = col.opa * (i === 0 ? 2.5 : i === 1 ? 1.6 : 1)
          c.fillStyle = `rgba(${G},${Math.min(0.95, alpha)})`
          c.fillText(ch, col.x, col.y + i * col.fs * 1.5)
        })
      })
    }

    // ── Draw: circuit traces ──────────────────────────────────────────────────
    function drawTraces(time: number) {
      traces.forEach(tr => {
        c.save()
        c.strokeStyle = `rgba(${G},${tr.a})`
        c.lineWidth = 0.7
        c.setLineDash([5, 8])
        c.lineDashOffset = -(time * 0.018) % 13

        let cx = tr.ox, cy = tr.oy
        c.beginPath(); c.moveTo(cx, cy)
        tr.segs.forEach(s => { cx += s.dx; cy += s.dy; c.lineTo(cx, cy) })
        c.stroke()

        // Terminal dot
        c.setLineDash([])
        c.fillStyle = `rgba(${GB},${tr.a * 1.8})`
        c.beginPath(); c.arc(cx, cy, 2, 0, Math.PI * 2); c.fill()
        c.restore()
      })
    }

    // ── Draw: connections between nodes ──────────────────────────────────────
    function drawConnections() {
      const MAX = W < 768 ? 130 : 210
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d >= MAX) continue
          // Opacity proportional to proximity AND average rightness
          const base      = (1 - d / MAX) * 0.5
          const rightness = (nodes[i].x + nodes[j].x) / (2 * W)
          const alpha     = base * (0.25 + rightness * 0.75)
          c.strokeStyle = `rgba(${G},${alpha})`
          c.lineWidth   = 0.7
          c.beginPath(); c.moveTo(nodes[i].x, nodes[i].y); c.lineTo(nodes[j].x, nodes[j].y); c.stroke()
        }
      }
    }

    // ── Draw: nodes ──────────────────────────────────────────────────────────
    function drawNodes() {
      nodes.forEach(n => {
        n.ph += n.ps
        const pf = n.pulser ? 0.5 + 0.5 * Math.sin(n.ph) : 0.75 + 0.1 * Math.sin(n.ph * 0.5)
        const r  = n.r * (1 + (n.pulser ? 0.45 : 0.1) * pf)
        const gr = r * (n.pulser ? 6 + 3 * pf : 3.5)

        // Glow halo
        const glow = c.createRadialGradient(n.x, n.y, 0, n.x, n.y, gr)
        glow.addColorStop(0, `rgba(${G},${0.38 * pf * n.bri})`)
        glow.addColorStop(0.4,`rgba(${G},${0.12 * pf * n.bri})`)
        glow.addColorStop(1, "rgba(0,0,0,0)")
        c.fillStyle = glow
        c.beginPath(); c.arc(n.x, n.y, gr, 0, Math.PI * 2); c.fill()

        // Core
        c.fillStyle = `rgba(${GB},${(0.6 + 0.4 * pf) * n.bri})`
        c.beginPath(); c.arc(n.x, n.y, r, 0, Math.PI * 2); c.fill()

        // Outer ring for pulsers
        if (n.pulser) {
          c.strokeStyle = `rgba(${G},${0.18 * pf * n.bri})`
          c.lineWidth = 0.8
          c.beginPath(); c.arc(n.x, n.y, r * 2.5, 0, Math.PI * 2); c.stroke()
          c.beginPath(); c.arc(n.x, n.y, r * 4, 0, Math.PI * 2)
          c.strokeStyle = `rgba(${G},${0.06 * pf * n.bri})`
          c.stroke()
        }
      })
    }

    // ── Draw: particles ──────────────────────────────────────────────────────
    function drawParticles() {
      particles.forEach(p => {
        p.a += p.as_ * p.ad; if (p.a > 0.55 || p.a < 0.03) p.ad *= -1
        p.x += p.vx; p.y += p.vy
        if (p.x < W * 0.25) p.x = W * 0.99
        if (p.x > W)        p.x = W * 0.30
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        c.fillStyle = `rgba(${G},${p.a * 0.65})`
        c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fill()
      })
    }

    // ── Draw: magnifying glass (far right, mid-height) ───────────────────────
    function drawMagnifier() {
      const cx = W * 0.84, cy = H * 0.28
      const r  = Math.max(22, Math.min(36, W * 0.022))
      const al = 0.10

      c.save()
      c.strokeStyle = `rgba(${G},${al})`; c.lineWidth = 1.3

      // Lens
      c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke()

      // Handle
      const ang = Math.PI / 4
      const hx  = cx + r * Math.cos(ang), hy = cy + r * Math.sin(ang)
      c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx + r * 0.9, hy + r * 0.9); c.stroke()

      // Crosshair
      c.strokeStyle = `rgba(${G},${al * 0.45})`; c.lineWidth = 0.5
      c.beginPath()
      c.moveTo(cx - r * 0.6, cy); c.lineTo(cx + r * 0.6, cy)
      c.moveTo(cx, cy - r * 0.6); c.lineTo(cx, cy + r * 0.6)
      c.stroke()

      // Inner target rings
      c.strokeStyle = `rgba(${G},${al * 0.3})`
      ;[0.35, 0.65].forEach(frac => {
        c.beginPath(); c.arc(cx, cy, r * frac, 0, Math.PI * 2); c.stroke()
      })

      // Corner brackets
      const bLen = r * 0.35
      c.strokeStyle = `rgba(${G},${al * 0.8})`; c.lineWidth = 1.0
      ;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx, sy]) => {
        const bx = cx + (sx as number) * r * 0.62, by = cy + (sy as number) * r * 0.62
        c.beginPath()
        c.moveTo(bx, by + (sy as number) * bLen); c.lineTo(bx, by); c.lineTo(bx + (sx as number) * bLen, by)
        c.stroke()
      })
      c.restore()
    }

    // ── Draw: fingerprint scan (bottom-right) ─────────────────────────────────
    function drawFingerprint(time: number) {
      const cx = W * 0.90, cy = H * 0.72
      const al = 0.065
      const rings = 10

      c.save()
      c.strokeStyle = `rgba(${G},${al})`; c.lineWidth = 0.8

      for (let i = 1; i <= rings; i++) {
        const rx = i * 5.5, ry = i * 8.8
        const gap = 0.20 + i * 0.011
        c.beginPath(); c.ellipse(cx, cy, rx, ry, 0,  Math.PI * gap,       Math.PI * (1 - gap));      c.stroke()
        c.beginPath(); c.ellipse(cx, cy, rx, ry, 0,  Math.PI * (1 + gap), Math.PI * (2 - gap)); c.stroke()
      }

      // Scan line (animated)
      const scanA = al * 0.9 * (0.5 + 0.5 * Math.sin(time * 0.0016))
      c.strokeStyle = `rgba(${GB},${scanA})`; c.lineWidth = 1.2
      c.beginPath()
      c.moveTo(cx - rings * 5.5 - 6, cy); c.lineTo(cx + rings * 5.5 + 6, cy); c.stroke()

      // Corner scan brackets
      const bw = rings * 5.5 + 8, bh = rings * 8.8 + 8, bLen = 9
      c.strokeStyle = `rgba(${G},${al * 1.4})`; c.lineWidth = 0.9
      ;[[cx-bw, cy-bh, 1, 1],[cx+bw, cy-bh,-1, 1],[cx+bw, cy+bh,-1,-1],[cx-bw, cy+bh, 1,-1]]
        .forEach(([x, y, sx, sy]) => {
          c.beginPath()
          c.moveTo(x as number, (y as number) + (sy as number) * bLen)
          c.lineTo(x as number, y as number)
          c.lineTo((x as number) + (sx as number) * bLen, y as number)
          c.stroke()
        })
      c.restore()
    }

    // ── Update node positions ─────────────────────────────────────────────────
    function updateNodes() {
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        // Bounce
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
        // Prevent drifting too far left: push left-most cluster back
        if (n.x < W * 0.05) n.vx = Math.abs(n.vx)
        // Prevent dense cluster spreading too far left
        if (n.x < W * 0.35 && n.vx < 0) n.vx *= -0.7
      })
    }

    // ── RAF loop ──────────────────────────────────────────────────────────────
    function loop(time: number) {
      c.clearRect(0, 0, W, H)
      drawBG()
      drawBokeh()
      drawCodeRain()
      drawTraces(time)
      drawConnections()
      drawNodes()
      drawParticles()
      drawMagnifier()
      drawFingerprint(time)
      updateNodes()
      raf = requestAnimationFrame(loop)
    }

    const onResize = () => init()
    window.addEventListener("resize", onResize)
    init()
    raf = requestAnimationFrame(loop)

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize) }
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
