// Achievement badges computed purely from XP — no backend needed.
export const BADGE_TIERS = [
  { xp: 2500, icon: '👑', label: 'Radical Legend' },
  { xp: 1000, icon: '💎', label: 'Diamond Sage' },
  { xp: 500, icon: '🥇', label: 'Gold Master' },
  { xp: 200, icon: '🥈', label: 'Silver Scholar' },
  { xp: 50, icon: '🥉', label: 'Bronze Learner' }
]

// Returns the single highest badge earned, or null if none yet.
export function currentBadge(xp) {
  return BADGE_TIERS.find(b => xp >= b.xp) || null
}

// Returns all badges earned, highest first.
export function earnedBadges(xp) {
  return BADGE_TIERS.filter(b => xp >= b.xp)
}

// Returns the next badge to work toward, or null if all earned.
export function nextBadge(xp) {
  const remaining = [...BADGE_TIERS].reverse().find(b => xp < b.xp)
  return remaining || null
}
