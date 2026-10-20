import { useState, useEffect } from 'react'
import { api } from '../api.js'
import { speakChinese, isSpeechSupported } from '../utils/speech.js'

const primaryChar = (character) => (character || '').split(' ')[0].trim()

const TIERS = [
  { value: '', label: 'All difficulty levels' },
  { value: '1', label: 'Tier 1 — Core radicals (1–214)' },
  { value: '2', label: 'Tier 2 — Most common (215–734)' },
  { value: '3', label: 'Tier 3 — Common (735–1784)' },
  { value: '4', label: 'Tier 4 — Advanced (1785–5000)' }
]

export default function Radicals() {
  const [query, setQuery] = useState('')
  const [tier, setTier] = useState('')
  const [radicals, setRadicals] = useState([])
  const [totalCount, setTotalCount] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getRadicalCount().then(data => setTotalCount(data.count)).catch(() => {})
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true)
      api.getRadicals(query, tier || undefined)
        .then(setRadicals)
        .catch(() => setRadicals([]))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timeout)
  }, [query, tier])

  return (
    <div className="page">
      <h2 className="page-h">Radical meanings</h2>
      <p className="helper">Browse all {totalCount !== null ? totalCount : ''} radicals. Search by character, pinyin, or meaning.</p>
      <div className="filter-row">
        <div className="search-bar" style={{ flex: 1, marginBottom: 0 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search radicals..."
          />
        </div>
        <select className="tier-select" value={tier} onChange={e => setTier(e.target.value)}>
          {TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      {loading ? (
        <p className="helper">Loading...</p>
      ) : radicals.length === 0 ? (
        <p className="helper">No radicals found matching your search.</p>
      ) : (
        <div className="grid-4">
          {radicals.map(r => (
            <div
              className={`rad-tile ${isSpeechSupported() ? 'rad-tile-clickable' : ''}`}
              key={r.id}
              onClick={() => isSpeechSupported() && speakChinese(primaryChar(r.character))}
              title={isSpeechSupported() ? 'Click to hear pronunciation' : undefined}
            >
              <div className="ch">{r.character}</div>
              <div className="py">{r.pinyin}</div>
              <div className="mn">{r.meaning}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
