import { useState, useEffect } from 'react'
import { api } from '../api.js'
import './Flashcards.css'

export default function Flashcards() {
  const [radicals, setRadicals] = useState([])
  const [active, setActive] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    api.getRadicals().then(data => setRadicals(data.slice(0, 20)))
  }, [])

  const move = (dir) => {
    setFlipped(false)
    setActive(a => (a + dir + radicals.length) % radicals.length)
  }

  if (radicals.length === 0) {
    return (
      <div className="page">
        <h2 className="page-h">Flashcards</h2>
        <p className="helper">Loading radicals...</p>
      </div>
    )
  }

  return (
    <div className="page">
      <h2 className="page-h">Flashcards</h2>
      <p className="helper">Click a card to flip it, or use the arrows to move through the deck.</p>
      <div className="carousel-outer">
        <div className="carousel-track">
          {radicals.map((r, i) => {
            let offset = i - active
            if (offset > radicals.length / 2) offset -= radicals.length
            if (offset < -radicals.length / 2) offset += radicals.length
            const abs = Math.abs(offset)
            const isActive = abs === 0
            return (
              <div
                key={r.id}
                className={`flash-slide ${isActive && flipped ? 'flipped' : ''}`}
                style={{
                  transform: `translateX(${offset * 160}px) scale(${isActive ? 1 : 0.78}) rotateY(${offset * -22}deg)`,
                  opacity: abs > 2 ? 0 : (isActive ? 1 : 0.5),
                  zIndex: 10 - abs
                }}
                onClick={() => isActive ? setFlipped(f => !f) : setActive(i)}
              >
                <div className="ch">{r.character}</div>
                <div className="py">{r.pinyin}</div>
                <div className="mn">{r.meaning}</div>
                <div className="tap-hint">tap to flip</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="carousel-nav">
        <div className="nav-btn" onClick={() => move(-1)}>‹</div>
        <div className="nav-btn" onClick={() => move(1)}>›</div>
      </div>
    </div>
  )
}
