import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Nav.css'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/radicals', label: 'Radicals' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/timed', label: 'Timed Mode' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/stroke', label: 'Stroke Order' },
  { to: '/ai', label: 'AI Help' },
  { to: '/worksheet', label: 'Worksheet' },
  { to: '/about', label: 'About' }
]

export default function Nav({ user, onLogout }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const go = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <div className="topnav">
      <div className="logo-group" onClick={() => go('/')}>
        <img src="/logo.png" alt="Mandalink logo" />
        <span className="logo-text">Mandalink</span>
      </div>

      <div className="nav-links">
        {LINKS.map(link => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-right">
        {user ? (
          <button className="signin-btn" onClick={onLogout}>{user.username} · Log out</button>
        ) : (
          <button className="signin-btn primary" onClick={() => go('/auth')}>Sign in</button>
        )}
        <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {LINKS.map(link => (
            <div key={link.to} className="mobile-menu-link" onClick={() => go(link.to)}>
              {link.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
