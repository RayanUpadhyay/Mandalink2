import { NavLink, useNavigate } from 'react-router-dom'
import './Nav.css'

const LINKS = [
  { to: '/', label: 'home' },
  { to: '/radicals', label: 'radicals' },
  { to: '/flashcards', label: 'flashcards' },
  { to: '/quiz', label: 'quiz' },
  { to: '/timed', label: 'timed mode' },
  { to: '/leaderboard', label: 'leaderboard' },
  { to: '/stroke', label: 'stroke order' },
  { to: '/ai', label: 'ai help' }
]

export default function Nav({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="topnav">
      <div className="logo-group">
        <img src="/logo.png" alt="Mandalink logo" />
        mandalink
      </div>
      <div className="nav-right">
        <div className="nav-links">
          {LINKS.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
              {link.label}
            </NavLink>
          ))}
        </div>
        {user ? (
          <button className="signin-btn" onClick={onLogout}>{user.username} · log out</button>
        ) : (
          <button className="signin-btn" onClick={() => navigate('/auth')}>sign in</button>
        )}
      </div>
    </div>
  )
}
