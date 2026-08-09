import { useEffect } from 'react'
import './BadgeToast.css'

// Subtle, self-dismissing celebration when a badge is newly unlocked.
// Pass the full list from a record-* API response; shows one at a time,
// queued, so multiple simultaneous unlocks don't overlap.
export default function BadgeToast({ badge, onDone }) {
  useEffect(() => {
    if (!badge) return
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [badge, onDone])

  if (!badge) return null

  return (
    <div className="badge-toast">
      <span className="badge-toast-icon">{badge.icon}</span>
      <div>
        <div className="badge-toast-title">Badge unlocked!</div>
        <div className="badge-toast-name">{badge.name}</div>
      </div>
    </div>
  )
}
