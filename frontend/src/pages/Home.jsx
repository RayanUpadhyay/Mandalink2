import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import SpecularButton from '../components/SpecularButton.jsx'
import './Home.css'

export default function Home({ user }) {
  const navigate = useNavigate()
  const heroRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const beams = []
    for (let i = 0; i < 12; i++) {
      const leftPct = 4 + Math.random() * 92
      const duration = 2.4 + Math.random() * 1.8
      const delay = Math.random() * duration
      const beam = document.createElement('div')
      beam.className = 'beam'
      beam.style.left = leftPct + '%'
      beam.style.animationDuration = duration + 's'
      beam.style.animationDelay = '-' + delay + 's'
      hero.appendChild(beam)
      beams.push(beam)
    }
    return () => beams.forEach(b => b.remove())
  }, [])

  return (
    <div className="page">
      <div className="beams-hero" ref={heroRef}>
        <div className="hero-copy">
          <div className="eyebrow"><span className="dot" />214 radicals · free forever</div>
          <h1 className="hero-h">Learn the building<br />blocks of <span className="accent">Mandarin</span></h1>
          <p className="hero-sub">Flashcards, stroke order, timed challenges, and an AI tutor.</p>
          <SpecularButton onClick={() => navigate('/radicals')}>enter mandalink</SpecularButton>
          {!user && (
            <div className="hero-auth-row">
              <button className="btn" onClick={() => navigate('/auth')}>log in</button>
              <button className="btn" onClick={() => navigate('/auth')}>sign up</button>
            </div>
          )}
        </div>
      </div>

      <div className="feat-grid">
        <div className="feat" onClick={() => navigate('/flashcards')}>
          <div className="ic">卡</div><h3>Flashcards</h3><p>Flip through radicals at your pace.</p>
        </div>
        <div className="feat" onClick={() => navigate('/stroke')}>
          <div className="ic">笔</div><h3>Stroke order</h3><p>Animated guides, then trace it.</p>
        </div>
        <div className="feat" onClick={() => navigate('/timed')}>
          <div className="ic">时</div><h3>Timed mode</h3><p>60 seconds on the clock.</p>
        </div>
        <div className="feat" onClick={() => navigate('/leaderboard')}>
          <div className="ic">榜</div><h3>Leaderboard</h3><p>Climb the ranks with XP.</p>
        </div>
      </div>
    </div>
  )
}
