import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { avatarEmoji } from '../utils/avatars.js'
import { useTheme, logoFor } from '../utils/theme.js'
import './Nav.css'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/ib', label: 'IB' },
  { to: '/radicals', label: 'Radicals' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/timed', label: 'Timed Mode' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/stroke', label: 'Stroke Order' },
  { to: '/worksheet', label: 'Worksheet' },
  { to: '/ai', label: 'AI Help' },
  { to: '/profile', label: 'Profile' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/about', label: 'About' }
]

const isActive = (to, path) => (to === '/' ? path === '/' : path === to || path.startsWith(to + '/'))

export default function Nav({ user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [theme, setTheme] = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [fit, setFit] = useState(99)
  const wrapRef = useRef(null)
  const measureRef = useRef(null)
  const moreRef = useRef(null)

  const links = user && user.isAdmin ? [...LINKS, { to: '/admin', label: 'Admin' }] : LINKS

  // Priority+ nav: every tab keeps the same size; whatever doesn't fit on one row
  // moves (from the end) into a "More" menu. Recalculated on resize and font load.
  useLayoutEffect(() => {
    const calc = () => {
      const wrap = wrapRef.current, m = measureRef.current
      if (!wrap || !m) return
      const avail = wrap.clientWidth
      const kids = [...m.children]
      const moreW = kids[kids.length - 1].offsetWidth + 4
      const widths = kids.slice(0, -1).map(e => e.offsetWidth + 4)
      if (widths.reduce((a, b) => a + b, 0) <= avail) { setFit(widths.length); return }
      let used = 0, n = 0
      for (const w of widths) { if (used + w + moreW > avail) break; used += w; n++ }
      setFit(Math.max(1, n))
    }
    calc()
    const ro = new ResizeObserver(calc)
    if (wrapRef.current) ro.observe(wrapRef.current)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(calc)
    return () => ro.disconnect()
  }, [links.length, theme])

  useEffect(() => { setMoreOpen(false); setMenuOpen(false) }, [location.pathname])
  useEffect(() => {
    if (!moreOpen) return
    const h = e => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [moreOpen])

  const visible = links.slice(0, fit)
  const overflow = links.slice(fit)
  const overflowActive = overflow.some(l => isActive(l.to, location.pathname))
  const toggleTheme = () => setTheme(theme === 'v2' ? 'v1' : 'v2')

  return (
    <div className="topnav">
      <div className="logo-group" onClick={() => navigate('/')}>
        <img src={logoFor(theme)} alt="Mandalink logo" />
        <span className="logo-text">Mandalink</span>
      </div>

      <div className="nav-links" ref={wrapRef}>
        {visible.map(link => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive: a }) => (a || isActive(link.to, location.pathname) ? 'active' : '')}>
            {link.label}
          </NavLink>
        ))}
        {overflow.length > 0 && (
          <div className="nav-more-wrap" ref={moreRef}>
            <button className={`nav-more ${overflowActive ? 'active' : ''}`} onClick={() => setMoreOpen(o => !o)} aria-expanded={moreOpen}>More ▾</button>
            {moreOpen && (
              <div className="nav-more-menu">
                {overflow.map(link => (
                  <NavLink key={link.to} to={link.to} className={() => (isActive(link.to, location.pathname) ? 'active' : '')}>{link.label}</NavLink>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* invisible copy used only to measure tab widths */}
      <div className="nav-links nav-measure" ref={measureRef} aria-hidden="true">
        {links.map(link => <a key={link.to}>{link.label}</a>)}
        <button className="nav-more">More ▾</button>
      </div>

      <div className="nav-right">
        <div className="theme-switch" role="group" aria-label="Site look">
          <button className={theme !== 'v2' ? 'on' : ''} aria-pressed={theme !== 'v2'} onClick={() => setTheme('v1')} title="Classic look">V1</button>
          <button className={theme === 'v2' ? 'on' : ''} aria-pressed={theme === 'v2'} onClick={() => setTheme('v2')} title="New look">V2</button>
        </div>
        {user ? (
          <>
            <button className="signin-btn nav-profile-btn" onClick={() => navigate('/profile')}>
              <span className="nav-avatar">
                {user.avatarImage ? <img src={user.avatarImage} alt="" className="nav-avatar-img" /> : avatarEmoji(user.avatar)}
              </span> <span className="nav-username">{user.username}</span>
            </button>
            <button className="signin-btn" onClick={onLogout}>Log out</button>
          </>
        ) : (
          <button className="signin-btn primary" onClick={() => navigate('/auth')}>Sign in</button>
        )}
        <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {links.map(link => (
            <div key={link.to} className="mobile-menu-link" onClick={() => navigate(link.to)}>{link.label}</div>
          ))}
          <div className="mobile-menu-link" onClick={toggleTheme}>{theme === 'v2' ? 'Switch to V1 look' : 'Switch to V2 look'}</div>
        </div>
      )}
    </div>
  )
}
