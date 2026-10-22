/**
 * Dial Anchor Store (v8 Alignment Contract)
 * Publishes measured center (cx, cy) and radius (R) of the dial outer chrome rim
 * relative to the stage container top-left.
 */

export interface Anchor {
  cx: number
  cy: number
  R: number
}

export interface DialAnchorState {
  // Laptop / default anchor (the full rotary dial)
  anchor: Anchor
  // Mobile Anchor L (Logo emblem)
  anchorL?: Anchor
  // Mobile Anchor D (Rotary dial base)
  anchorD?: Anchor
}

type AnchorListener = (state: DialAnchorState) => void

let currentState: DialAnchorState = {
  anchor: { cx: 600, cy: 400, R: 280 },
}

const listeners = new Set<AnchorListener>()

export function getDialAnchor(): DialAnchorState {
  return currentState
}

export function subscribeDialAnchor(listener: AnchorListener): () => void {
  listeners.add(listener)
  listener(currentState)
  return () => {
    listeners.delete(listener)
  }
}

export function updateDialAnchor(partial: Partial<DialAnchorState>, containerElement?: HTMLElement | null) {
  currentState = {
    ...currentState,
    ...partial,
    anchor: partial.anchor || currentState.anchor,
  }

  // Write CSS variables on container / stage root if provided
  if (containerElement && partial.anchor) {
    const { cx, cy, R } = partial.anchor
    containerElement.style.setProperty("--cx", `${cx.toFixed(1)}px`)
    containerElement.style.setProperty("--cy", `${cy.toFixed(1)}px`)
    containerElement.style.setProperty("--R", `${R.toFixed(1)}px`)
  }

  listeners.forEach((fn) => {
    try {
      fn(currentState)
    } catch (e) {
      console.error("[dial-anchor] listener error:", e)
    }
  })
}
