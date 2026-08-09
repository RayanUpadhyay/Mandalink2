import { useState, useEffect } from 'react'
import { api } from '../api.js'
import { currentBadge } from '../utils/badges.js'
import { avatarEmoji } from '../utils/avatars.js'
import BadgeIcon from '../components/BadgeIcon.jsx'
import './Leaderboard.css'

export default function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getLeaderboard().then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <h2 className="page-h">Leaderboard</h2>
      <p className="helper">See how you stack up against other Mandalink learners.</p>
      {loading ? (
        <p className="helper">Loading...</p>
      ) : users.length === 0 ? (
        <p className="helper">No users yet — be the first to earn XP!</p>
      ) : (
        <div>
          {users.map((u, i) => {
            const badge = currentBadge(u.xp)
            return (
              <div className={`lb-row ${i === 0 ? 'gold' : ''}`} key={u.id}>
                <span className="lb-rank">{String(i + 1).padStart(2, '0')}</span>
                <span className="lb-avatar">{avatarEmoji(u.avatar)}</span>
                <span className="lb-name">
                  {u.username}
                  <span className="lb-all-badges">
                    {badge && (
                      <BadgeIcon icon={badge.icon} name={badge.label} description={`Earned by reaching ${badge.xp}+ XP`} />
                    )}
                    {u.limitedBadges && u.limitedBadges.map((b, idx) => (
                      <BadgeIcon key={idx} icon={b.icon} name={b.name} description={b.description} />
                    ))}
                  </span>
                </span>
                <span className="lb-xp">{u.xp} xp · lvl {u.level}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
