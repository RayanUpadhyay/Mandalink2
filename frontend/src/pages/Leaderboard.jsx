import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { avatarEmoji } from '../utils/avatars.js'
import BadgeIcon from '../components/BadgeIcon.jsx'
import './Leaderboard.css'

export default function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
          {users.map((u, i) => (
            <div className={`lb-row ${i === 0 ? 'gold' : ''}`} key={u.id}>
              <span className="lb-rank">{String(i + 1).padStart(2, '0')}</span>
              <span className="lb-pfp-circle" onClick={() => navigate(`/profile/${u.username}`)}>
                {u.avatarImage ? <img src={u.avatarImage} alt="" className="lb-pfp-img" /> : avatarEmoji(u.avatar)}
              </span>
              <span className="lb-name">
                <span className="lb-name-link" onClick={() => navigate(`/profile/${u.username}`)}>
                  {u.username}
                </span>
                {/* Shows ONLY the user's chosen Featured Badge — never their
                    full collection. See Profile page for that. */}
                {u.featuredBadge && (
                  <span className="lb-featured-badge">
                    <BadgeIcon icon={u.featuredBadge.icon} name={u.featuredBadge.name} description={u.featuredBadge.description} />
                  </span>
                )}
              </span>
              <span className="lb-xp">{u.xp} xp · lvl {u.level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
