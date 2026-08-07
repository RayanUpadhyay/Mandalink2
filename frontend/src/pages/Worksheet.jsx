import { useState, useEffect, useMemo } from 'react'
import { api } from '../api.js'
import './Worksheet.css'

export default function Worksheet() {
  const [radicals, setRadicals] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState([])
  const [boxesPerChar, setBoxesPerChar] = useState(6)

  useEffect(() => {
    api.getRadicals().then(setRadicals)
  }, [])

  const results = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    return radicals.filter(r =>
      (r.character.includes(query) || r.pinyin.toLowerCase().includes(q) || r.meaning.toLowerCase().includes(q))
      && !selected.some(s => s.id === r.id)
    ).slice(0, 12)
  }, [radicals, query, selected])

  const addChar = (r) => {
    setSelected(s => [...s, r])
    setQuery('')
  }
  const removeChar = (id) => setSelected(s => s.filter(r => r.id !== id))

  const addRandom = (count) => {
    const pool = radicals.filter(r => !selected.some(s => s.id === r.id))
    const picked = [...pool].sort(() => 0.5 - Math.random()).slice(0, count)
    setSelected(s => [...s, ...picked])
  }

  return (
    <div className="page">
      <div className="worksheet-controls no-print">
        <h2 className="page-h">Practice worksheet</h2>
        <p className="helper">Pick characters below, then print a tracing worksheet to practice writing by hand.</p>

        <div className="search-bar">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search a character to add..."
          />
          {results.length > 0 && (
            <div className="worksheet-suggestions">
              {results.map(r => (
                <div key={r.id} className="worksheet-suggestion" onClick={() => addChar(r)}>
                  <span className="ws-sugg-char">{r.character}</span>
                  <span className="ws-sugg-meta">{r.pinyin} · {r.meaning}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="worksheet-quick-add">
          <button className="btn" onClick={() => addRandom(10)}>+ Add 10 random</button>
          <button className="btn" onClick={() => addRandom(20)}>+ Add 20 random</button>
          {selected.length > 0 && (
            <button className="btn" onClick={() => setSelected([])}>Clear all</button>
          )}
        </div>

        {selected.length > 0 && (
          <>
            <div className="worksheet-chips">
              {selected.map(r => (
                <div key={r.id} className="worksheet-chip">
                  {r.character}
                  <span className="chip-remove" onClick={() => removeChar(r.id)}>×</span>
                </div>
              ))}
            </div>

            <div className="worksheet-options">
              <label>
                Boxes per character:
                <select value={boxesPerChar} onChange={e => setBoxesPerChar(Number(e.target.value))}>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                </select>
              </label>
              <button className="btn primary" onClick={() => window.print()}>🖨 Print worksheet</button>
            </div>
          </>
        )}
      </div>

      {selected.length > 0 && (
        <div className="worksheet-print-area">
          <div className="worksheet-print-header">
            <h2>Mandalink Practice Worksheet</h2>
            <p>Name: _______________________          Date: _______________</p>
          </div>
          {selected.map(r => (
            <div key={r.id} className="worksheet-row">
              <div className="worksheet-row-label">
                <div className="wl-char">{r.character}</div>
                <div className="wl-pinyin">{r.pinyin}</div>
                <div className="wl-meaning">{r.meaning}</div>
              </div>
              <div className="worksheet-row-boxes">
                {Array.from({ length: boxesPerChar }).map((_, i) => (
                  <div key={i} className="trace-box">
                    <span className="trace-ghost">{r.character.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
