import { useState, useEffect, useMemo } from 'react'
import { api } from '../api.js'
import { speakChinese, isSpeechSupported } from '../utils/speech.js'
import './Flashcards.css'

const WINDOW = 3 // how many cards to render on each side of the active one

// Some entries store compound forms like "長 (镸, 长)" — speak just the primary character.
const primaryChar = (character) => (character || '').split(' ')[0].trim()

export default function Flashcards() {
  const [radicals, setRadicals] = useState([])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    api.getRadicals().then(setRadicals)
  }, [])

  const filtered = useMemo(() => {
    if (!query) return radicals
    const q = query.toLowerCase()
    return radicals.filter(r =>
      r.character.includes(query) ||
      r.pinyin.toLowerCase().includes(q) ||
      r.meaning.toLowerCase().includes(q)
    )
  }, [radicals, query])

  useEffect(() => {
    setActive(0)
    setFlipped(false)
  }, [query])

  const move = (dir) => {
    setFlipped(false)
    setActive(a => (a + dir + filtered.length) % filtered.length)
  }

  if (radicals.length === 0) {
    return (
      <div className="page">
        <h2 className="page-h">Flashcards</h2>
        <p className="helper">Loading radicals...</p>
      </div>
    )
  }

  const visible = []
  for (let offset = -WINDOW; offset <= WINDOW; offset++) {
    const i = ((active + offset) % filtered.length + filtered.length) % filtered.length
    if (filtered.length > WINDOW * 2 + 1 || visible.every(v => v.i !== i)) {
      visible.push({ i, offset, r: filtered[i] })
    }
  }

  return (
    <div className="page">
      <h2 className="page-h">Flashcards</h2>
      <p className="helper">Click the card to flip it, or use the arrows to move through the deck.</p>

      <div className="search-bar">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by character, pinyin, or meaning..."
        />
      </div>
      <p className="helper" style={{ marginTop: -14 }}>
        {filtered.length === 0 ? 'No matches' : `Card ${active + 1} of ${filtered.length}`}
      </p>

      {filtered.length === 0 ? null : (
        <>
          <div className="carousel-outer">
            <div className="carousel-track">
              {visible.map(({ i, offset, r }) => {
                const isActive = offset === 0
                return (
                  <div
                    key={r.id}
                    className="flash-slide"
                    style={{
                      transform: `translateX(${offset * 160}px) scale(${isActive ? 1 : 0.78}) rotateY(${offset * -22}deg)`,
                      opacity: Math.abs(offset) > 2 ? 0 : (isActive ? 1 : 0.5),
                      zIndex: 10 - Math.abs(offset)
                    }}
                    onClick={() => isActive ? setFlipped(f => !f) : setActive(i)}
                  >
                    <div className={`flip-inner ${isActive && flipped ? 'is-flipped' : ''}`}>
                      <div className="flip-face flip-front">
                        <div className="mn">{r.meaning}</div>
                        <div className="tap-hint">tap to flip</div>
                        {isActive && isSpeechSupported() && (
                          <button
                            className="card-speak-btn"
                            onClick={e => { e.stopPropagation(); speakChinese(primaryChar(r.character)) }}
                          >
                            🔊
                          </button>
                        )}
                      </div>
                      <div className="flip-face flip-back">
                        <div className="ch">{r.character}</div>
                        <div className="py">{r.pinyin}</div>
                        <div className="tap-hint">tap to flip back</div>
                        {isActive && isSpeechSupported() && (
                          <button
                            className="card-speak-btn"
                            onClick={e => { e.stopPropagation(); speakChinese(primaryChar(r.character)) }}
                          >
                            🔊
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="carousel-nav">
            <div className="nav-btn" onClick={() => move(-1)}>‹</div>
            {isSpeechSupported() && (
              <div
                className="nav-btn speak-btn"
                onClick={() => speakChinese(primaryChar(filtered[active]?.character))}
                title="Hear pronunciation"
              >
                🔊
              </div>
            )}
            <div className="nav-btn" onClick={() => move(1)}>›</div>
          </div>
        </>
      )}
    </div>
  )
}
