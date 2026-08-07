import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { speakChinese, isSpeechSupported } from '../utils/speech.js'
import { earnedBadges, nextBadge } from '../utils/badges.js'
import './Home.css'

const primaryChar = (character) => (character || '').split(' ')[0].trim()

export default function Home({ user }) {
  const navigate = useNavigate()
  const [radicalCount, setRadicalCount] = useState(null)
  const [cotd, setCotd] = useState(null)

  useEffect(() => {
    api.getRadicalCount().then(data => setRadicalCount(data.count)).catch(() => {})
    api.getRadicalOfTheDay().then(setCotd).catch(() => {})
  }, [])

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
          Through interactive flashcards, AI-powered hints, timed challenges, and animated
          stroke-order guides, we make learning Chinese characters intuitive, engaging, and
          effective. Whether you're a complete beginner or brushing up your skills, Mandalink
          adapts to your pace and helps you build lasting knowledge.
        </p>
        <p className="hero-featuring">Featuring</p>
        <p className="hero-feature-list">Flashcards &bull; Quiz Games &bull; Stroke Order &bull; Timed Mode &bull; AI Help &bull; Leaderboard</p>

        <div className="hero-cta-row">
          <button className="btn primary hero-cta" onClick={() => navigate(user ? '/radicals' : '/auth')}>
            {user ? 'Explore Radicals' : 'Get Started'}
          </button>
          {!user && (
            <button className="btn" onClick={() => navigate('/auth')}>Sign In</button>
          )}
        </div>
        {radicalCount !== null && (
          <p className="hero-count">{radicalCount} radicals ready to learn — free forever</p>
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

      {user && (
        <div className="card badges-card">
          <div className="cotd-label">Your Achievements</div>
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
        <div className="feat" onClick={() => navigate(user ? '/leaderboard' : '/auth')}>
          <div className="ic">榜</div><h3>Leaderboard</h3><p>Climb the ranks with XP.</p>
        </div>
      </div>
    </div>
  )
}
