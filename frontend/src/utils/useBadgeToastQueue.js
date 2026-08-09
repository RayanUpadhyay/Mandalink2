import { useState, useCallback } from 'react'

// Small shared queue so multiple badges unlocked in one action (rare, but
// possible) show one at a time instead of overlapping.
export function useBadgeToastQueue() {
  const [queue, setQueue] = useState([])

  const pushUnlocked = useCallback((newlyUnlocked) => {
    if (!newlyUnlocked || newlyUnlocked.length === 0) return
    setQueue(q => [...q, ...newlyUnlocked])
  }, [])

  const dismissCurrent = useCallback(() => {
    setQueue(q => q.slice(1))
  }, [])

  return { current: queue[0] || null, pushUnlocked, dismissCurrent }
}
