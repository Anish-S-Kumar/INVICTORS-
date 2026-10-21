"use client"

import React, { useEffect, useRef } from "react"

interface GoldDustProps {
  count?: number
  className?: string
}

export function GoldDust({ count = 24, className = "" }: GoldDustProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    let animationId: number
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    interface Particle {
      x: number
      y: number
      radius: number
      baseSpeed: number
      alpha: number
      alphaSpeed: number
      wobble: number
      wobbleSpeed: number
    }

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.8 + Math.random() * 1.6,
      baseSpeed: 0.25 + Math.random() * 0.65,
      alpha: 0.2 + Math.random() * 0.6,
      alphaSpeed: 0.005 + Math.random() * 0.01,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
    }))

    const handleResize = () => {
      if (!canvas) return
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", handleResize)

    let isVisible = !document.hidden
    const handleVisibility = () => {
      isVisible = !document.hidden
    }
    document.addEventListener("visibilitychange", handleVisibility)

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height)

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          p.y -= p.baseSpeed
          p.wobble += p.wobbleSpeed
          p.x += Math.sin(p.wobble) * 0.35

          p.alpha += p.alphaSpeed
          if (p.alpha > 0.8 || p.alpha < 0.2) {
            p.alphaSpeed = -p.alphaSpeed
          }

          // Wrap vertically
          if (p.y < -10) {
            p.y = height + 10
            p.x = Math.random() * width
          }
          if (p.x < -10) p.x = width + 10
          if (p.x > width + 10) p.x = -10

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(212, 162, 76, ${p.alpha.toFixed(2)})`
          ctx.shadowBlur = 4
          ctx.shadowColor = "rgba(212, 162, 76, 0.4)"
          ctx.fill()
        }
      }
      animationId = requestAnimationFrame(render)
    }

    animationId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  )
}
