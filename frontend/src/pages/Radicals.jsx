import { useState, useEffect } from 'react'
import { api } from '../api.js'

export default function Radicals() {
  const [query, setQuery] = useState('')
  const [radicals, setRadicals] = useState([])
  const [totalCount, setTotalCount] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getRadicalCount().then(data => setTotalCount(data.count)).catch(() => {})
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true)
      api.getRadicals(query)
        .then(setRadicals)
        .catch(() => setRadicals([]))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div className="page">
      <h2 className="page-h">Radical meanings</h2>
      <p className="helper">Browse all {totalCount !== null ? totalCount : ''} radicals. Search by character, pinyin, or meaning.</p>
      <div className="search-bar">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search radicals..."
        />
      </div>
      {loading ? (
        <p className="helper">Loading...</p>
      ) : radicals.length === 0 ? (
        <p className="helper">No radicals found matching your search.</p>
      ) : (
        <div className="grid-4">
          {radicals.map(r => (
            <div className="rad-tile" key={r.id}>
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
