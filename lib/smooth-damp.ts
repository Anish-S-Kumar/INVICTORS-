/**
 * Game-standard critically damped spring smoothing (SmoothDamp).
 * Gradually changes a value towards a desired target over time, without overshoot.
 * 
 * Based on Unity's SmoothDamp algorithm (derived from Game Programming Gems 4, Chapter 1.10).
 * 
 * @param current Current value
 * @param target Target value
 * @param velocityRef Object holding current velocity ({ value: number }) so it mutates by reference
 * @param smoothTime Approximate time it takes to reach the target (seconds)
 * @param maxSpeed Optional maximum speed clamp
 * @param deltaTime Time elapsed since last frame (seconds)
 */
export function smoothDamp(
  current: number,
  target: number,
  velocityRef: { value: number },
  smoothTime: number,
  maxSpeed = Infinity,
  deltaTime: number
): number {
  // Clamp deltaTime to at most 1/30s to prevent numerical instability during long frames
  const dt = Math.max(0.0001, Math.min(deltaTime, 1 / 30))
  const st = Math.max(0.0001, smoothTime)

  const omega = 2 / st
  const x = omega * dt
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)

  let change = current - target
  const originalTo = target

  // Clamp maximum speed
  const maxChange = maxSpeed * st
  change = Math.max(-maxChange, Math.min(maxChange, change))
  const targetClamped = current - change

  const temp = (velocityRef.value + omega * change) * dt
  velocityRef.value = (velocityRef.value - omega * temp) * exp
  let output = targetClamped + (change + temp) * exp

  // Prevent overshooting target
  if (originalTo - current > 0.0 === output > originalTo) {
    output = originalTo
    velocityRef.value = (output - originalTo) / dt
  }

  return output
}

/**
 * Critically damped angular smoothing that wraps across 360 degrees or custom intervals.
 */
export function smoothDampAngle(
  current: number,
  target: number,
  velocityRef: { value: number },
  smoothTime: number,
  maxSpeed = Infinity,
  deltaTime: number
): number {
  let diff = target - current
  // Normalize difference to [-180, 180]
  diff = ((diff % 360) + 540) % 360 - 180
  const unwrappedTarget = current + diff
  return smoothDamp(current, unwrappedTarget, velocityRef, smoothTime, maxSpeed, deltaTime)
}
