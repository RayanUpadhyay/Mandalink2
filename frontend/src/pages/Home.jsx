import { useNavigate } from 'react-router-dom'
import { APK_URL, isInstalled } from '../utils/platform.js'
import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { speakChinese, isSpeechSupported } from '../utils/speech.js'
import { earnedBadges, nextBadge } from '../utils/badges.js'
import './Home.css'

const primaryChar = (character) => (character || '').split(' ')[0].trim()

const formatCountdown = (seconds) => {
  if (seconds <= 0) return 'Expired'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${h}h ${m}m ${s}s`
}

export default function Home({ user }) {
  const [installed] = useState(() => isInstalled())
  const navigate = useNavigate()
  const [radicalCount, setRadicalCount] = useState(null)
  const [cotd, setCotd] = useState(null)
  const [drop, setDrop] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [claiming, setClaiming] = useState(false)
  const [claimMessage, setClaimMessage] = useState(null)

  useEffect(() => {
    api.getRadicalCount().then(data => setRadicalCount(data.count)).catch(() => {})
    api.getRadicalOfTheDay().then(setCotd).catch(() => {})
  }, [])

  useEffect(() => {
    if (!user) return
    api.getActiveBadgeDrop().then(data => {
      setDrop(data)
      setSecondsLeft(data.secondsRemaining || 0)
    }).catch(() => {})
  }, [user])

  useEffect(() => {
    if (!drop || !drop.hasActiveDrop) return
    const interval = setInterval(() => {
      setSecondsLeft(s => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [drop])

  // claims either the current 24-hour drop or one of the permanent badges
  const claimDrop = async (dropId = drop && drop.dropId) => {
    if (!drop || !dropId) return
    setClaiming(dropId)
    setClaimMessage(null)
    try {
      const result = await api.claimBadgeDrop(dropId)
      setClaimMessage({ dropId, text: result.message })
      if (result.success) {
        setDrop(d => ({
          ...d,
          alreadyClaimed: d.dropId === dropId ? true : d.alreadyClaimed,
          permanent: (d.permanent || []).map(p => p.dropId === dropId ? { ...p, alreadyClaimed: true } : p)
        }))
      }
    } catch (e) {
      setClaimMessage({ dropId, text: 'Could not reach the server.' })
    } finally {
      setClaiming(false)
    }
  }

  const badges = user ? earnedBadges(user.xp) : []
  const upNext = user ? nextBadge(user.xp) : null

  return (
    <div className="page">
      <div className="hero card">
        <img src="/logo.png" alt="Mandalink logo" className="hero-logo" />
        <h1 className="hero-h">Mandalink</h1>
        <p className="hero-tagline">Chinese Radicals Simplified</p>
        <div className="hero-divider"></div>
        <p className="hero-desc">
          Mandalink is your gateway to mastering the building blocks of Chinese — radicals.
          Through interactive flashcards, AI-powered hints, timed challenges, animated
          stroke-order guides and customisable practice worksheets, we make learning Chinese
          characters intuitive, engaging, and effective. Whether you're a complete beginner or
          brushing up your skills, Mandalink adapts to your pace and helps you build lasting
          knowledge.
        </p>
        <p className="hero-featuring">Featuring</p>
        <p className="hero-feature-list">Flashcards &bull; Quiz Games &bull; Stroke Order &bull; Timed Mode &bull; Practice Worksheet &bull; AI Help &bull; Leaderboard</p>

        <div className="hero-cta-row">
          <button className="btn primary hero-cta" onClick={() => navigate(user ? '/radicals' : '/auth')}>
            {user ? 'Explore Radicals' : 'Get Started'}
          </button>
          {!user && (
            <button className="btn" onClick={() => navigate('/auth')}>Sign In</button>
          )}
        </div>
        {radicalCount !== null && (
          <p className="hero-count hero-count-highlight">{radicalCount} radicals ready to learn — Lifetime Free Access</p>
        )}
        {!installed && (
          <p className="hero-apps">
            📱 On your phone: <a href={APK_URL}>⬇ Android app</a> · iPhone: open in Safari, tap Share, then Add to Home Screen
          </p>
        )}
      </div>

      {cotd && (
        <div className="card cotd-card">
          <div className="cotd-label">Character of the Day</div>
          <div className="cotd-row">
            <div className="cotd-char">{primaryChar(cotd.character)}</div>
            <div className="cotd-info">
              <div className="cotd-pinyin">{cotd.pinyin}</div>
              <div className="cotd-meaning">{cotd.meaning}</div>
            </div>
            {isSpeechSupported() && (
              <button className="cotd-speak" onClick={() => speakChinese(primaryChar(cotd.character))}>🔊</button>
            )}
          </div>
        </div>
      )}

      {user && drop && drop.hasActiveDrop && (
        <div className="card drop-card">
          <div className="cotd-label">⚡ Limited Edition — 24 Hours Only</div>
          <div className="drop-row">
            <div className="drop-icon">{drop.icon}</div>
            <div className="drop-info">
              <div className="drop-name">{drop.name}</div>
              <div className="drop-desc">{drop.description}</div>
              <div className="drop-countdown">Expires in {formatCountdown(secondsLeft)}</div>
            </div>
            {drop.alreadyClaimed ? (
              <div className="drop-claimed">✓ Claimed</div>
            ) : (
              <button className="btn primary" disabled={!!claiming || secondsLeft <= 0} onClick={() => claimDrop(drop.dropId)}>
                {claiming === drop.dropId ? 'Claiming...' : 'Claim'}
              </button>
            )}
          </div>
          {claimMessage && claimMessage.dropId === drop.dropId && <p className="helper" style={{ margin: '10px 0 0' }}>{claimMessage.text}</p>}
        </div>
      )}

      {user && drop && (drop.permanent || []).map(p => (
        <div className="card drop-card" key={p.dropId}>
          <div className="cotd-label">🏅 Always available</div>
          <div className="drop-row">
            <div className="drop-icon">{p.icon}</div>
            <div className="drop-info">
              <div className="drop-name">{p.name}</div>
              <div className="drop-desc">{p.description}</div>
            </div>
            {p.alreadyClaimed ? (
              <div className="drop-claimed">✓ Claimed</div>
            ) : (
              <button className="btn primary" disabled={!!claiming} onClick={() => claimDrop(p.dropId)}>
                {claiming === p.dropId ? 'Claiming...' : 'Claim'}
              </button>
            )}
          </div>
          {claimMessage && claimMessage.dropId === p.dropId && <p className="helper" style={{ margin: '10px 0 0' }}>{claimMessage.text}</p>}
        </div>
      ))}

      {user && (
        <div className="card badges-card">
          <div className="cotd-label achievements-label">Your Achievements</div>
          {badges.length === 0 ? (
            <p className="helper" style={{ margin: '10px 0 0' }}>
              Earn XP in Quiz or Timed Mode to unlock your first badge.
            </p>
          ) : (
            <div className="badges-row">
              {badges.map(b => (
                <div key={b.label} className="badge-pill" title={`${b.label} — ${b.xp}+ XP`}>
                  <span className="badge-icon">{b.icon}</span> {b.label}
                </div>
              ))}
            </div>
          )}
          {upNext && (
            <p className="helper badge-next" style={{ margin: '10px 0 0' }}>
              {user.xp} / {upNext.xp} XP to {upNext.icon} {upNext.label}
            </p>
          )}
        </div>
      )}

      <div className="feat-grid">
        <div className="feat" onClick={() => navigate(user ? '/flashcards' : '/auth')}>
          <div className="ic">卡</div><h3>Flashcards</h3><p>Flip through radicals at your pace.</p>
        </div>
        <div className="feat" onClick={() => navigate(user ? '/stroke' : '/auth')}>
          <div className="ic">笔</div><h3>Stroke Order</h3><p>Animated guides, then trace it.</p>
        </div>
        <div className="feat" onClick={() => navigate(user ? '/timed' : '/auth')}>
          <div className="ic">时</div><h3>Timed Mode</h3><p>60 seconds on the clock.</p>
        </div>
        <div className="feat" onClick={() => navigate(user ? '/quiz' : '/auth')}>
          <div className="ic">问</div><h3>Quiz</h3><p>Test yourself, radical by radical.</p>
        </div>
        <div className="feat" onClick={() => navigate(user ? '/worksheet' : '/auth')}>
          <div className="ic">卷</div><h3>Practice Worksheet</h3><p>Print a tracing sheet by hand.</p>
        </div>
        <div className="feat" onClick={() => navigate(user ? '/leaderboard' : '/auth')}>
          <div className="ic">榜</div><h3>Leaderboard</h3><p>Climb the ranks with XP.</p>
        </div>
      </div>
    </div>
  )
}
